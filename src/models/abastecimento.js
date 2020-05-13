"use strict";
module.exports = (sequelize, DataTypes) => {
  const abastecimento = sequelize.define(
    "abastecimento",
    {
      quilometragem: DataTypes.DECIMAL,
      quantidade: DataTypes.DECIMAL,
      tipo: DataTypes.STRING,
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
  abastecimento.associate = function (models) {
    abastecimento.belongsTo(models.veiculo, {
      foreignKey: "id_veiculo",
    });
    abastecimento.belongsTo(models.motorista, {
      foreignKey: "id_responsavel",
    });
  };
  return abastecimento;
};
