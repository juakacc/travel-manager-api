'use strict';
/* Insere o motorista padrão para iniciar a navegação na aplicação
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all
    npx sequelize-cli db:seed --seed 20200322111924-demo-permissoes
 */
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('motorista', [{
            nome: 'Admin',
            apelido: 'admin',
            cnh: '1',
            categoria: 'A',
            telefone: '',
            senha: '$2a$10$xKoNAoO.2keb1MopWfZI9OjjsLRYlBzQkAf/l/8c0PeXyYF7K7rHi'        
        }], {})
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('motorista', null, {})
  }
};
