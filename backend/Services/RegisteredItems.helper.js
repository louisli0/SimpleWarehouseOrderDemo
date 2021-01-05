const pool = require('../Database/connection');

class RegisteredItems {
    constructor() {}
    
    async Create(data) {
        console.log(data);
        const client = await pool.connect();
        try {
            await client.query('BEGIN')
            let registerItemQUery = 'INSERT INTO registereditems(serialnumber, linkedUser, itemid) VALUES($1, $2, $3)'
            await client.query(registerItemQUery, [data.serial, data.userId, data.itemId])

            // Activity Log
            var adminLogQuery =
            'INSERT INTO ActivityLog("User", type, description) VALUES($1, $2, $3)';
          await client.query(adminLogQuery, [
            data.userId,
            'Registered Item',
            `Registered ${data.serial}`,
          ]);

            await client.query('COMMIT')
            return true;
        } catch (err) {
            console.log("Registered Item Error", err);
            await client.query('ROLLBACK');
            return false;
        } finally {
            client.release();
        }
    }
    
}

module.exports = RegisteredItems;