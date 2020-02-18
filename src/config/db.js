const Sequelize = require('sequelize')
const mysql = require('mysql2/promise')

const local_db = ''
const database_db = ''
const username_db = ''
const password_db = ''

mysql.createConnection({
    user: username_db,
    password: password_db
}).then(connection => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${database_db}`)
})

const sequelize = new Sequelize(database_db, username_db, password_db, {
    host: local_db,
    dialect: 'mysql'
})

sequelize.authenticate()
.then(() => {
    console.log('Conexão estabelecida com sucesso')
})
.catch(err => {
    console.log('Erro ao conectar com o BD: ', err)
})

module.exports = sequelize