'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction(t => {
          return Promise.all([
            queryInterface.createTable('auth_papeis', {
                nome: {
                  type: Sequelize.STRING,
                  allowNull: false,
                  primaryKey: true
                }
            }, { transaction: t }),

            queryInterface.createTable('auth_permissoes', {
                id_motorista: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    onDelete: 'CASCADE',
                    references: {
                        model: 'motorista',
                        key: 'id'
                    }
                },
                permissao: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    references: {
                        model: 'auth_papeis',
                        key: 'nome'
                    }
                }
            }, { transaction: t })
          ])
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
        return Promise.all([
          queryInterface.dropTable('auth_papeis', { transaction: t }),
          queryInterface.dropTable('auth_permissoes', { transaction: t })
        ])
    })
  }
};