'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('veiculo', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        },
        placa: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }, 
        renavam: {
            type: Sequelize.STRING,
            allowNull: false
        },
        marca: {
            type: Sequelize.STRING,
            allowNull: false
        },
        modelo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        quilometragem: {
            type: Sequelize.DECIMAL,
            defaultValue: 0
        },
        disponivel: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        cnh_requerida: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('veiculo');
  }
};