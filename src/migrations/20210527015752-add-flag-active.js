'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('motorista', 'ativo', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }),
      queryInterface.addColumn('motorista', 'ultimo_login', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }),
      queryInterface.addColumn('veiculo', 'ativo', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('motorista', 'ativo'),
      queryInterface.removeColumn('motorista', 'ultimo_login'),
      queryInterface.removeColumn('veiculo', 'ativo')
    ])
  }
};
