"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("servico_revisao", "realizada", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("servico_revisao", "realizada");
  },
};
