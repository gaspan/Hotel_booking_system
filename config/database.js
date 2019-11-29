const mysql = require('mysql')

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'hotel_booking',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const conn_knex = {
    host : process.env.DB_HOST,
    user : process.env.DB_USER || 'root',
    password : process.env.DB_PASSWORD || 'password',
    database : process.env.DB_NAME || 'hotel_booking'
}

module.exports = {
    pool :pool,
    connection_knex :conn_knex
}