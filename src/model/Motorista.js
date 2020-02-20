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
    disponivel: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    senha: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
})

// Motorista.sync()
module.exports = Motorista