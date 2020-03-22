'use strict';
module.exports = (sequelize, DataTypes) => {
  const auth_permissoes = sequelize.define('auth_permissoes', {
    id_motorista: DataTypes.INTEGER,
    permissao: DataTypes.INTEGER
  }, {
      timestamps: false,
      underscored: true,
    //   freezeTableName: true
  })
  auth_permissoes.associate = function(models) {
    auth_permissoes.belongsTo(models.motorista, {
        foreignKey: 'id_motorista',
        onDelete: 'CASCADE'
    })
    auth_permissoes.belongsTo(models.auth_papeis, {
        foreignKey: 'permissao'
    })
  }
  auth_permissoes.removeAttribute('id')
  return auth_permissoes
}