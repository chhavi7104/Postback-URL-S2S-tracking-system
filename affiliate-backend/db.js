// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",      // your Postgres username
  host: "localhost",
  database: "affiliate", // make sure this DB exists
  password: "postgres",  // your Postgres password
  port: 5432,
});

module.exports = pool;
