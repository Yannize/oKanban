const database = require('../database');
const { Model, DataTypes } = require('sequelize');

class Label extends Model {};

Label.init({
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    color: {
        type: DataTypes.TEXT,
        defaultValue: '#ccc'
    },
}, {
    sequelize: database,
    tableName: "label"
});

module.exports = Label;
