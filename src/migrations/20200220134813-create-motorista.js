'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
        return Promise.all([
            queryInterface.createTable('motorista', {
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
            }, { transaction: t }),

            queryInterface.createTable('auth_papeis', {
                id: {
                  allowNull: false,
                  autoIncrement: true,
                  primaryKey: true,
                  type: Sequelize.INTEGER
                },
                nome: {
                  type: Sequelize.STRING,
                  unique: true
                }
              }, { transaction: t }),

              queryInterface.createTable('auth_permissoes', {
                id_motorista: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'motorista',
                        key: 'id'
                    }
                },
                id_permissao: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'auth_papeis',
                        key: 'id'
                    }
                }
              }, { transaction: t })
        ]);
    })
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction(t => {
          return Promise.all([
            queryInterface.dropTable('motorista', { transaction: t }),
            queryInterface.dropTable('auth_papeis', { transaction: t }),
            queryInterface.dropTable('auth_permissoes', { transaction: t })
          ])
      })
  }
};