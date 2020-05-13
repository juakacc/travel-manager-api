"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("servico_revisao", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      descricao: {
        type: Sequelize.STRING,
      },
      momento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      quilometragem: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      id_servico: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "servico",
          key: "id",
        },
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("servico_revisao");
  },
};
