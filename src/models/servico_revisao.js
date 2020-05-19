"use strict";
module.exports = (sequelize, DataTypes) => {
  const servico_revisao = sequelize.define(
    "servico_revisao",
    {
      quilometragem: DataTypes.DECIMAL,
      descricao: DataTypes.STRING,
      momento: DataTypes.DATE,
      id_servico: DataTypes.INTEGER,
      realizada: DataTypes.BOOLEAN,
    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: true,
    }
  );
  servico_revisao.associate = function (models) {
    servico_revisao.belongsTo(models.servico, {
      foreignKey: "id_servico",
    });
  };
  return servico_revisao;
};
