'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
        return Promise.all([
          queryInterface.bulkInsert('auth_papeis', [{
              nome: 'admin'
          }, {
              nome: 'motorista'
          }], { transaction: t }),

          queryInterface.bulkInsert('auth_permissoes', [{
              id_motorista: 1,    // ADMIN
              permissao: 'admin'     // admin
          }], { transaction: t })
        ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
        return Promise.all([
          queryInterface.bulkDelete('auth_papeis', null, { transaction: t }),
          queryInterface.bulkDelete('auth_permissoes', null, { transaction: t }),
        ])
    })
  }
};
