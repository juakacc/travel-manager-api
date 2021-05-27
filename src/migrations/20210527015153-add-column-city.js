'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('motorista', 'cidade', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Olivedos/PB'
      }),
      queryInterface.addColumn('veiculo', 'cidade', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Olivedos/PB'
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('motorista', 'cidade'),
      queryInterface.removeColumn('veiculo', 'cidade')
    ])
  }
};
