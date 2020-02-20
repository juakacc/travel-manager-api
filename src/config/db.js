const Sequelize = require('sequelize')
const mysql = require('mysql2/promise')
require('dotenv').config()

const local_db = process.env.LOCAL_DB
const database_db = process.env.DATABASE_DB
const username_db = process.env.USERNAME_DB
const password_db = process.env.PASSWORD_DB

mysql.createConnection({
    user: username_db,
    password: password_db
}).then(connection => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${database_db}`)
})

const sequelize = new Sequelize(database_db, username_db, password_db, {
    host: local_db,
    dialect: 'mysql',
    dialectOptions: {
        // useUTC: false, // for reading from database
        dateStrings: true,
        typeCast: function (field, next) { // for reading from database
            if (field.type === 'DATETIME') {
                return field.string()
            }
            return next()
        }
    },
    timezone: '-03:00', // for writing to database
})

sequelize.authenticate()
.then(() => {
    console.log('Conexão estabelecida com sucesso')
})
.catch(err => {
    console.log('Erro ao conectar com o BD: ', err)
})

module.exports = sequelize