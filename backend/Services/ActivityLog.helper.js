const pool = require('../Database/connection');

class ActivityLogService {
  constructor() {}

  async CreateEntry(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      var insertQuery =
        'INSERT INTO ActivityLog("User", type, description) VALUES($1, $2, $3)';
      const result = await client.query(insertQuery, [
        data.userId,
        data.type,
        data.description,
      ]);

      if (result.rowCount == 1) {
        await client.query('COMMIT');
        return true;
      } else {
        await client.query('ROLLBACK');
        console.log('Did not add activity log');
        return false;
      }
    } catch (err) {
      await client.query('ROLLBACK');

      console.log(err);
      return false;
    } finally {
      client.release();
    }
  }

  async GetAll() {
    try {
      var result = await pool.query('SELECT * FROM ActivityLog');
      if (result.rows.length >= 0) {
        return result;
      }
    } catch (err) {
      console.log('Get all error');
      throw err;
    }
  }

  async GetByUser(userId) {
    try {
      var result = await pool.query(
        'SELECT * FROM ActivityLog WHERE user = $1',
        userId
      );
      if (result.rows.length >= 0) {
        return result;
      }
    } catch (err) {
      console.log('Get all error');
      throw err;
    }
  }

  async GetByDateRange(data) {
    try {
      var result = await pool.query(
        'SELECT * FROM ActivityLog WHERE Created > $1 AND Created < $1',
        data.date1,
        data.date2
      );
      if (result.rows.length >= 0) {
        return result;
      }
    } catch (err) {
      console.log('Get all error');
      return [];
    }
  }
}

module.exports = ActivityLogService;
