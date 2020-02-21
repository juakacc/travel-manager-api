'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('viagem', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        saida: {
            type: Sequelize.DATE,
            allowNull: false
        },
        km_inicial: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        chegada: {
            type: Sequelize.DATE,
            allowNull: true
        },
        km_final: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        descricao: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        id_veiculo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'veiculo',
                key: 'id'
            }
        },
        id_motorista: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'motorista',
                key: 'id'
            }
        }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('viagem');
  }
};