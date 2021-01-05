const pool = require('../Database/connection');
const ActivityLogService = new (require('./ActivityLog.helper'))();

class InventoryService {
  constructor() {}

  async Create(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const addToInventoryQuery =
        'INSERT INTO Inventory(WarehouseId, ItemId) VALUES($1, $2) RETURNING Id';
      const { rowCount, rows } = await client.query(addToInventoryQuery, [
        data.warehouseId,
        data.itemId,
      ]);

      const logState = await ActivityLogService.CreateEntry({
        userId: data.userId,
        type: 'Create Inventory Item',
        description: `${data.userId} added ${data.itemId} to the inventory`,
      });

      if (rowCount != 1 || !logState) {
        console.log('Insert / Log Query error');
        await client.query('ROLLBACK');
        return false;
      }

      await client.query('COMMIT');
      return {
        id: rows[0].id,
      };
    } catch (err) {
      console.log('Inventory Create Error', err);
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
        'UPDATE Inventory SET(WarehouseId, ItemId) = ($1, $2) WHERE Id = $3';
      const { rowCount } = await client.query(updateQuery, [
        data.warehouseId,
        data.itemId,
        id,
      ]);

      const logState = await ActivityLogService.CreateEntry({
        userId: data.userId,
        type: 'Update Inventory',
        description: `${data.userId} updated inventory ${id}`,
      });

      if (rowCount != 1 || !logState) {
        console.log('Insert / Log Quyery error');
        await client.query('ROLLBACK');
        return false;
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      console.log('Inventory Update Error', err);
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
      const deleteQuery = 'DELETE FROM inventory WHERE id = $1';
      const result = await client.query(deleteQuery, [data.id]);

      const logState = await ActivityLogService.CreateEntry({
        userId: data.userId,
        type: 'Delete Inventory',
        description: `${data.userId} removed ${data.id}`,
      });

      if (result.rowCount != 1 || !logState) {
        console.log('Insert.Log Query error');
        await client.query('ROLLBACK');
        return false;
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      console.log('err');
      await client.query('ROLLBACK');
      throw err;
    }
  }

  async GetAllAsync() {
    try {
      const { rows } = await pool.query('SELECT * FROM Inventory');
      return rows;
    } catch (err) {
      console.log('Error:', err);
      throw err;
    }
  }

  async GetById(id) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM Inventory WHERE Id = $1',
        [id]
      );
      return rows[0];
    } catch (err) {
      console.log('Error', err);
      throw err;
    }
  }

  async GetByWarehouseId(id) {
    try {
      const {
        rows,
      } = await pool.query(
        'SELECT inventory.id, name, category FROM Inventory inner join itemdetails i on Inventory.itemid = i.id  WHERE warehouseId = $1',
        [id]
      );
      return rows;
    } catch (err) {
      console.log('inventory get by wh Error', err);
      throw err;
    }
  }

  async GetByItemId(id) {
    try {
      const {
        rows,
      } = await pool.query(
        'SELECT inventory.id, name, warehouseid, itemId FROM Inventory INNER JOIN warehouse ON warehouse.id = inventory.warehouseid WHERE itemId = $1',
        [id]
      );
      return rows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async FindWHItemInventory(data) {
    try {
      const itemQuery =
        'SELECT id, warehouseid FROM inventory WHERE itemid = $1';
      const { rows } = await pool.query(itemQuery, [data]);
      return rows;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = InventoryService;
