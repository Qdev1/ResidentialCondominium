const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'residential'
});

module.exports = db;
