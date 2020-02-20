const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Motorista = require('./Motorista')
const Veiculo = require('./Veiculo')

Motorista.sync()
Veiculo.sync()

const Viagem = sequelize.define('viagem', {

    saida: {
        type: DataTypes.DATE,
        allowNull: false
    },
    km_inicial: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    chegada: {
        type: DataTypes.DATE,
        allowNull: true
    },
    km_final: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_veiculo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Veiculo,
            key: 'id'
        }
    },
    id_motorista: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Motorista,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    freezeTableName: true
})

Viagem.sync()
module.exports = Viagem