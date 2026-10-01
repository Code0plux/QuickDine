import mysql from 'mysql2';
const db = mysql.createPool({
        host: process.env.DB_HOST || process.env.MYSQL_ADDON_HOST,
        user: process.env.DB_USER || process.env.MYSQL_ADDON_USER,
        password: process.env.DB_PASSWORD || process.env.MYSQL_ADDON_PASSWORD,
        database: process.env.DB_NAME || process.env.MYSQL_ADDON_DB,
        port: process.env.DB_PORT || process.env.MYSQL_ADDON_PORT
}).promise()

export default db;