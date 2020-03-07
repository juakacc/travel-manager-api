'use strict';
/* Insere o motorista padrão para iniciar a navegação na aplicação
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all - motorista - papeis - permissoes 
 */
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction(t => {
          return Promise.all([
            queryInterface.bulkInsert('motorista', [{
                nome: 'Admin',
                apelido: 'admin',
                cnh: '1',
                categoria: 'A',
                telefone: '',
                senha: '$2a$10$xKoNAoO.2keb1MopWfZI9OjjsLRYlBzQkAf/l/8c0PeXyYF7K7rHi'        
            }], { transaction: t }),

            queryInterface.bulkInsert('auth_papeis', [{
                nome: 'admin'
            }, {
                nome: 'motorista'
            }], { transaction: t }),

            queryInterface.bulkInsert('auth_permissoes', [{
                id_motorista: 1,    // ADMIN
                id_permissao: 1     // admin
            }], { transaction: t })
          ])
      })
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction(t => {
          return Promise.all([
            queryInterface.bulkDelete('motorista', null, { transaction: t }),
            queryInterface.bulkDelete('auth_papeis', null, { transaction: t }),
            queryInterface.bulkDelete('auth_permissoes', null, { transaction: t }),
          ])
      })
  }
};
