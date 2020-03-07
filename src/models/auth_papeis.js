'use strict';
module.exports = (sequelize, DataTypes) => {
  const auth_papeis = sequelize.define('auth_papeis', {
    nome: DataTypes.STRING
  }, {
    timestamps: false,
    // freezeTableName: true
  });
  auth_papeis.associate = function(models) {
    // associations can be defined here
  };
  return auth_papeis;
};