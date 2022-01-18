const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'seaflux',
    database: 'node-complete',
    password: 'nodecomplete'
})

module.exports = pool.promise()