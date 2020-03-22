'use strict';
module.exports = (sequelize, DataTypes) => {
  const auth_papeis = sequelize.define('auth_papeis', {
    nome: {
        type: DataTypes.STRING,
        primaryKey: true
    }
  }, {
      timestamps: false
  })
  auth_papeis.associate = function(models) {
    // associations can be defined here
  }
  auth_papeis.removeAttribute('id')
  return auth_papeis
}