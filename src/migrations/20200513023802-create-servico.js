"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("servico", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quilometragem: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      momento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      id_veiculo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "veiculo",
          key: "id",
        },
      },
      id_responsavel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "motorista",
          key: "id",
        },
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("servico");
  },
};
