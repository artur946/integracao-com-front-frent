require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'senacrs',
  database: process.env.DB_NAME || 'sistema_agendamento',
  port: process.env.DB_PORT || 3306

});

module.exports = pool;