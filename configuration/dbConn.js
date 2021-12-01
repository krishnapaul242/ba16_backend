const mysql = require('mysql2');
const config = require('./config');
const db = mysql.createConnection({
    host: config.DB.MYSQL_HOST,
    port: config.DB.MYSQL_PORT,
    user: config.DB.MYSQL_USER,
    password: config.DB.MYSQL_PASSWORD,
    database: config.DB.MYSQL_DATABASE
});
module.exports = db;

