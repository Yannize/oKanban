const database = require('../database');
const { Model, DataTypes } = require('sequelize');

class Card extends Model {}

Card.init(
  {
    text: {
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
    color: {
        type: DataTypes.TEXT,
    },
    list_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'List',
            key: 'id'
        }
    }
  },
  {
    sequelize: database,
    tableName: 'card',
  }
);

module.exports = Card;