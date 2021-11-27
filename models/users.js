'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasMany(models.events,{
        foreignKey:"company_id",
        as:"Company"
      })
      users.hasMany(models.events,{
        foreignKey:"vendor_id",
        as:"Vendor"
      })
    }
  };
  users.init({
    name: DataTypes.STRING,
    role: DataTypes.ENUM('company', 'vendor'),
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};