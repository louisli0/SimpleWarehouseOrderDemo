require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 10000,
  max: 10,
});

module.exports = pool;
