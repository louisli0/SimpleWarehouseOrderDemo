const pool = require('../Database/connection');
const ActivityLog = new (require('./ActivityLog.helper'))();
const TicketService = new (require('./Ticket.helper'))();

class WarehouseOrderHelper {
  constructor() {}

  async Create(data) {
    const client = await pool.connect();
    try {
      console.log(data);

      await client.query('BEGIN');
      const insertQuery =
        'INSERT INTO WarehouseOrder(ticketid, quantity, assigneditem, inventoryid) VALUES($1, $2, $3, $4) RETURNING *';
      const { rowCount } = await client.query(insertQuery, [
        data.ticketId,
        data.quantity,
        data.itemid,
        data.inventoryid,
      ]);

      //Log Event
      const logState = await ActivityLog.CreateEntry({
        type: 'Create Order',
        userId: data.userId,
        description: 'Created Warehouse order',
      });

      const ticketHistory = await TicketService.CreateTicketHistory({
        id: data.ticket,
        userId: data.userId,
        description: 'Work Order Created',
      });

      if (rowCount == 0 || !logState || !ticketHistory) {
        console.log('Error occured saving ticket history or log');
        await client.query('ROLLBACK');
        return false;
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      console.log(err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async Edit(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      let updateQuery =
        'UPDATE WarehouseOrder SET(Quantity = $1 , AssignedItem = $2) WHERE Id = $3';
      const { rowCount } = await ClientBase.query(updateQuery, [
        data.quantity,
        data.item,
        data.id,
      ]);

      //Log Event
      const logState = await ActivityLog.CreateEntry({
        userId: data.userId,
        type: 'Update Order',
        description: 'Updated Warehouse Order',
      });

      if (rowCount == 0 || !logState) {
        console.log('Query error or log error');
        await client.query('ROLLBACK');
        return false;
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      console.log(err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = WarehouseOrderHelper;
