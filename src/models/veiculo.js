'use strict';
module.exports = (sequelize, DataTypes) => {
  const veiculo = sequelize.define('veiculo', {
    nome:          DataTypes.STRING,
    placa:         DataTypes.STRING,
    renavam:       DataTypes.STRING,
    marca:         DataTypes.STRING,
    modelo:        DataTypes.STRING,
    quilometragem: DataTypes.DECIMAL,
    disponivel:    DataTypes.BOOLEAN,
    cnh_requerida: DataTypes.STRING,
  }, {
    timestamps: false,
    freezeTableName: true
  });
  veiculo.associate = function(models) {
    // associations can be defined here
  };
  return veiculo;
};