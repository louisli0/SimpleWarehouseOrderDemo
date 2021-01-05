const pool = require('../Database/connection');

class WarehouseService {
  constructor() {}

  async Create(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const createQuery = 'INSERT INTO Warehouse(name) VALUES($1) RETURNING Id';
      const { rowCount, rows } = await client.query(createQuery, [data.name]);

      if (rowCount != 1) {
        console.log('INsert query fail');
        await client.query('ROLLBACK');
        return false;
      }

      await client.query('COMMIT');
      return {
        id: rows[0].id,
      };
    } catch (err) {
      console.log('Create error', err);
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
      const updateQuery = 'UPDATE Warehouse SET name = $1 WHERE id = $2';
      const updateRes = await client.query(updateQuery, [data.name, id]);

      if (updateRes.rowCount != 1) {
        console.log('Did not update');
        await client.query('ROLLBACK');
        return false;
      }
      await client.query('COMMIT');
      return true;
    } catch (err) {
      console.log('Create error', err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async GetById(id) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM Warehouse WHERE Id = $1',
        [id]
      );
      return rows[0];
    } catch (err) {
      console.log('Error Retrieving', err);
      throw err;
    }
  }

  async GetAllAsync() {
    try {
      const { rows } = await pool.query('SELECT id, name FROM Warehouse');
      return rows;
    } catch (err) {
      console.log('Get all error', err);
      throw err;
    }
  }

  async Delete(id) {
    try {
      const deleteQuery = 'DELETE FROM Warehouse WHERE id = $1';
      const results = await pool.query(deleteQuery, [id]);
      if (results.rowCount == 1) {
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = WarehouseService;
