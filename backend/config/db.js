import mysql from 'mysql2';
const db = mysql.createPool({
        host:'localhost',
        user:'root',
        password:'Balaji@1557',
        database:'quickdine'
}).promise()

export default db;