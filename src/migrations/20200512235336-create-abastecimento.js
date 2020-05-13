"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("abastecimento", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      quilometragem: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      quantidade: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      momento: {
        allowNull: false,
        type: Sequelize.DATE,
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
    return queryInterface.dropTable("abastecimentos");
  },
};
