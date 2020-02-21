'use strict'
module.exports = (sequelize, DataTypes) => {
  const motorista = sequelize.define('motorista', {
    nome:       DataTypes.STRING,
    apelido:    DataTypes.STRING,
    cnh:        DataTypes.STRING,
    categoria:  DataTypes.STRING,
    telefone:   DataTypes.STRING,
    disponivel: DataTypes.BOOLEAN,
    senha:      DataTypes.TEXT
  }, {
    timestamps: false,
    freezeTableName: true
  })
  motorista.associate = function(models) {
    // associations can be defined here
  }
  return motorista
}