const pool = require('../Database/connection');
const ActivityLogService = new (require('./ActivityLog.helper'))();

class ItemService {
  constructor() {}

  async Create(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const createQuery =
        'INSERT INTO ItemDetails(Name, Description, Category) VALUES($1, $2, $3) RETURNING *';
      const { rowCount, rows } = await client.query(createQuery, [
        data.name,
        data.description,
        data.category,
      ]);

      const logState = await ActivityLogService.CreateEntry({
        userId: data.userId,
        type: 'Add new Item',
        description: `Added ${data.name}`,
      });

      if (rowCount != 1 || !logState) {
        console.log('Error in Insert or Log Query');
        await client.query('ROLLBACK');
        return false;
      }

      await client.query('COMMIT');
      return {
        id: rows[0].id,
      };
    } catch (err) {
      console.log('Item Create Error', err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async Update(id, data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const updateQuery =
        'UPDATE ItemDetails SET(Name, Description, Category) = ($1, $2, $3) WHERE Id = $4';
      const updateResult = await client.query(updateQuery, [
        data.name,
        data.description,
        data.category,
        id,
      ]);

      const logState = await ActivityLogService.CreateEntry({
        userId: data.userId,
        type: 'Update Item',
        description: `Updated ${data.name}`,
      });

      if (updateResult.rowCount != 1 || !logState) {
        await client.query('ROLLBACK');
        console.log('Error in Update / Log QUery');
        return false;
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      console.log('Item Update Error', err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async Delete(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const deleteQuery = 'DELETE FROM ItemDetails WHERE id = $1';
      const result = await client.query(deleteQuery, [data.id]);

      const logState = await ActivityLogService.CreateEntry({
        userId: data.userId,
        type: 'Delete Item',
        description: `Deleted Item ${data.id}`,
      });

      if (!logState || result.rowCount != 1) {
        console.log('Error Occured');
        await client.query('ROLLBACK');
        return false;
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      console.log(err);
      throw err;
    } finally {
      client.release();
    }
  }

  async GetAllAsync() {
    try {
      const { rows } = await pool.query('SELECT * FROM ItemDetails');
      return rows;
    } catch (err) {
      console.log('GetAll Error', err);
      throw err;
    }
  }

  async GetById(id) {
    try {
      const {
        rows,
      } = await pool.query('SELECT * FROM ItemDetails WHERE Id = $1', [id]);
      return rows[0];
    } catch (err) {
      console.log('item get Error', err);
      throw err;
    }
  }

  async GetRegisteredItems(data) {
    try {
      const {
        rows,
      } = await pool.query(
        'SELECT registereditems.id, name, serialnumber, itemid FROM registereditems INNER JOIN itemdetails ON registereditems.itemid = itemdetails.id WHERE LinkedUser = $1',
        [data]
      );
      return rows;
    } catch (err) {
      console.log('Registered Items err', err);
      throw err;
    }
  }

  async GetAllSerialByItemId(data) {
    try {
      const {
        rows,
      } = await pool.query(
        'SELECT serial, createdat FROM SerialisedItems WHERE itemid = $1',
        [data]
      );
      return rows;
    } catch (err) {
      console.log('Serial Items List err', err);
      throw err;
    }
  }

  async GetItemBySerialAndId(data) {
    try {
      const {
        rows,
      } = await pool.query(
        'SELECT serial FROM SerialisedItems WHERE itemid = $1 AND serial = $2',
        [data.itemId, data.serial]
      );
      return rows;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = ItemService;
