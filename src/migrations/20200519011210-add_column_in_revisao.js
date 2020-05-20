"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("servico_revisao", "realizada", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.changeColumn("servico_revisao", "momento", {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.changeColumn("servico_revisao", "quilometragem", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("servico_revisao", "realizada"),
      queryInterface.changeColumn("servico_revisao", "momento", {
        type: Sequelize.DATE,
        allowNull: false,
      }),
      queryInterface.changeColumn("servico_revisao", "quilometragem", {
        type: Sequelize.DECIMAL,
        allowNull: false,
      }),
    ]);
  },
};
