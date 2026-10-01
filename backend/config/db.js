import mysql from 'mysql2';
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
     rejectUnauthorized: true,
    ca: process.env.DB_SSL_CA
  }
}).promise()

export default db;
