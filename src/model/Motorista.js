const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Motorista = sequelize.define('motorista', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apelido: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cnh: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamp: false
})

Motorista.sync()
module.exports = Motorista