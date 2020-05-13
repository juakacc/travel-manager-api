"use strict";
module.exports = (sequelize, DataTypes) => {
  const servico = sequelize.define(
    "servico",
    {
      quilometragem: DataTypes.DECIMAL,
      descricao: DataTypes.STRING,
      momento: DataTypes.DATE,
      id_veiculo: DataTypes.INTEGER,
      id_responsavel: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: true,
    }
  );
  servico.associate = function (models) {
    servico.belongsTo(models.veiculo, {
      foreignKey: "id_veiculo",
    });
    servico.belongsTo(models.motorista, {
      foreignKey: "id_responsavel",
    });
  };
  return servico;
};
