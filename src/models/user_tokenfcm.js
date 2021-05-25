'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_tokenfcm = sequelize.define('user_tokenfcm', {
    token: DataTypes.STRING,
    id_user: DataTypes.INTEGER,
  }, {
    freezeTableName: true,
    underscored: false
  });
  user_tokenfcm.associate = function(models) {
    user_tokenfcm.belongsTo(models.motorista, {
      foreignKey: 'id_user'
    })
  };
  return user_tokenfcm;
};