'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('motorista', {
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
        apelido: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        cnh: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        categoria: {
            type: Sequelize.STRING,
            allowNull: false
        },
        telefone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        disponivel: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        senha: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    })
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('motorista')
  }
};