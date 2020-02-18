const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Veiculo = sequelize.define('veiculo', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    placa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, 
    renavam: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quilometragem: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
    disponivel: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    cnh_requerida: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
})

Veiculo.sync()
module.exports = Veiculo