const pool = require('../Database/connection');
const ActivityLog = new (require('./ActivityLog.helper'))();

class TicketHelper {
  /**
   *
   * @param {*} data
   *
   * Create a new TicketActivity Entry for an existing ticket
   *
   * Return True / False according to query row count.
   */
  async CreateTicketHistory(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const query =
        'INSERT INTO TicketActivity(ticketid, createdby, description) VALUES($1, $2, $3)';
      const { rowCount } = await client.query(query, [
        data.id,
        data.userId,
        data.description,
      ]);

      if (rowCount != 1) {
        console.log('Error in ticketactivty query');
        return false;
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      console.log('Ticket Create Error', err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async CreateTicketItem(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const insertQuery =
        'INSERT INTO TicketItem(ticketid, itemid) VALUES($1,$2)';
      const { rowCount } = await client.query(insertQuery, [
        data.ticketId,
        data.itemId,
      ]);

      if (rowCount != 1) {
        await client.query('ROLLBACK');
        return false;
      }
      await client.query('COMMIT');
      return true;
    } catch (err) {
      console.log('CreateTicketItem error', err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
  /**
   *
   * @param {*} data
   *
   * Create a new Ticket Entry
   *
   * Return True / False according to row count.
   */
  async Create(data) {
    console.log(data);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const query =
        'INSERT INTO Ticket(Type, Status, creator) VALUES($1,$2,$3) RETURNING Id';
      const ticketRes = await client.query(query, [
        data.type,
        'NEW',
        data.userId,
      ]);

      // For each item entry, Create a TicketItem
      for (let i = 0; i < data.items.length; i++) {
        let addState = await this.CreateTicketItem({
          ticketId: ticketRes.rows[0].id,
          itemId: data.items[i].id, //Registered Item Id
        });

        if (!addState) {
          console.log('Failed in TicketItem');
          await client.query('ROLLBACK');
          return false;
        }
      }

      const ticketLogState = await this.CreateTicketHistory({
        id: ticketRes.rows[0].id,
        userId: data.userId,
        description: data.description,
      });

      const logState = await ActivityLog.CreateEntry({
        userId: data.userId,
        type: 'Created Ticket',
        description: `Created ${ticketRes.rows[0].id}`,
      });

      if (ticketRes.rowCount != 1 || !ticketLogState || !logState) {
        console.log(
          'Ticket Create: Insert query affected row count does not match specification.'
        );
        await client.query('ROLLBACK');
        return false;
      }
      await client.query('COMMIT');
      return {
        id: ticketRes.rows[0].id,
      };
    } catch (err) {
      console.log('Ticket Creation Error:', err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   *
   * @param {int} ticketId
   * @param {*} data
   *
   * Update Ticket Details.
   *
   */
  async Update(ticketId, data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const query = 'SELECT id, status FROM Ticket WHERE Id = $1';
      const ticketRes = await client.query(query, [ticketId]);
      const { id, status } = ticketRes.rows[0];

      if (ticketRes.rows.length == 0) {
        await client.query('ROLLBACK');
        return false;
      }

      let actionMessage = 'Update Ticket';

      // Ticket Status Change
      if (data.status != undefined) {
        actionMessage = `Change status from ${status} to ${data.status}`;
        const updateStatusQuery = 'UPDATE Ticket SET status = $1 WHERE id = $2';
        const updateStatusRes = await client.query(updateStatusQuery, [
          data.status,
          id,
        ]);

        if (updateStatusRes.rowCount != 1) {
          await client.query('ROLLBACK');
          return false;
        }
      }

      // Ticket Activity Update
      const historyState = await this.CreateTicketHistory({
        id: id,
        userId: data.userId,
        description: data.description,
      });

      const logState = await ActivityLog.CreateEntry({
        userId: data.userId,
        type: `Update`,
        description: `${actionMessage}`,
      });

      if (!historyState || !logState) {
        console.log('Ticket History or Activity log fail');
        await client.query('ROLLBACK');
        return false;
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      console.log('Error updating ticket', err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   *
   * @param {*} data
   *
   * Add Ticket Acitivy via CreateTicketHistory
   */
  async AddActivity(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const historyState = await this.CreateTicketHistory({
        id: data.ticketId,
        userId: data.userId,
        description: data.description,
      });

      if (!historyState) {
        console.log('Failed to insert query');
        await client.query('ROLLBACK');
        return false;
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      console.log(err);
      await client.query('ROLLBACK');
      return false;
    } finally {
      client.release();
    }
  }

  /** Return ticket details and activity on Id */
  async GetById(data) {
    const result = await pool.query('SELECT * FROM ticket WHERE id = $1', [
      data,
    ]);

    const resultActivity = await pool.query(
      'SELECT * FROM ticketactivity WHERE ticketId = $1',
      [data]
    );

    const items = await pool.query(
      'SELECT r.itemid, i2."name", i2.category FROM TicketItem inner join registereditems r on r.id = TicketItem.itemid inner join itemdetails i2 on r.itemid = i2.id WHERE ticketid = $1',
      [data]
    );

    const warehouseOrder = await pool.query(
      'SELECT * FROM warehouseorder where ticketid = $1',
      [data]
    );

    return {
      details: result.rows,
      activity: resultActivity.rows,
      items: items.rows,
      whOrders: warehouseOrder.rows,
    };
  }

  /**
   * Return Tickets that was only created by the user
   *  */
  async GetAll(data) {
    try {
      const {
        rows,
      } = await pool.query('SELECT * FROM Ticket WHERE creator = $1', [data]);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Return Ticket where assignment to a user is null
   */
  async GetNonAssigned() {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM Ticket WHERE assignedto IS NULL'
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param {int} id
   * Get Tickets assigned to User Id.
   */
  async GetAssigned(id) {
    try {
      const {
        rows,
      } = await pool.query('SELECT * FROM Ticket WHERE assignedto = $1', [id]);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  async GetCreated(id) {
    try {
      const {
        rows,
      } = await pool.query('SELECT * FROM Ticket WHERE creator = $1', [id]);
      return rows;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = TicketHelper;
