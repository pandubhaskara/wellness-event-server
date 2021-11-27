'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      events.belongsTo(models.users,{
        foreignKey:"company_id",
        as:"Company"
      })
      events.belongsTo(models.users,{
        foreignKey:"vendor_id",
        as:"Vendor"
      })
    }
  };
  events.init({
    place: DataTypes.STRING,
    date: DataTypes.STRING,
    vendor_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    status: DataTypes.ENUM('approved', 'pending', 'rejected')
  }, {
    sequelize,
    modelName: 'events',
  });
  return events;
};