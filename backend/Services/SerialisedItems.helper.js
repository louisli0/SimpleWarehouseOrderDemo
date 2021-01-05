const pool = require('../Database/connection');
const ActivityService = new (require('../Services/ActivityLog.helper'))();

class SerialisedItems {
  constructor() {}

  async Create(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      let insertQuery = 'INSERT INTO SerialisedItems(Serial, ItemId) VALUES($1, $2)';
      await client.query(insertQuery, [data.serial, data.itemId]);

      //Activity Log
      const logData = {
        userId: data.userId,
        type: 'New Serial',
        description: `Item: ${data.itemId} Serial: ${data.serial}`
      };
      await ActivityService.CreateEntry(logData)
      await client.query('COMMIT');
      return true;
    } catch(err) {
      await client.query('ROLLBACK');
      console.log("Serialised Add Error", err);
      return false;
    } finally {
      client.release();
    }
  }
  async Edit(data) {}
}

module.exports = SerialisedItems;