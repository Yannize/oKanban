const database = require('../database');
const { Model, DataTypes } = require('sequelize');

class List extends Model {}

List.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0,
      },
    },
  },
  {
    sequelize: database,
    tableName: 'list',
    defaultScope: {
      order: [['position', 'ASC']],
    },
  }
);

module.exports = List;
