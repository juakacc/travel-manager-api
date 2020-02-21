'use strict';
module.exports = (sequelize, DataTypes) => {
  const viagem = sequelize.define('viagem', {
    saida: DataTypes.DATE,
    km_inicial: DataTypes.DECIMAL,
    chegada: DataTypes.DATE,
    km_final: DataTypes.DECIMAL,
    descricao: DataTypes.TEXT,
    id_veiculo: DataTypes.INTEGER,
    id_motorista: DataTypes.INTEGER,
  }, {
    timestamps: false,
    freezeTableName: true
  });
  viagem.associate = function(models) {
    viagem.belongsTo(models.veiculo, {
        foreignKey: 'id_veiculo'
    })
    viagem.belongsTo(models.motorista, {
        foreignKey: 'id_motorista'
    })
  };
  return viagem;
};