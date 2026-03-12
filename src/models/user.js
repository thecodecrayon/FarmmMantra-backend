"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // DEFINE ASSOCIATIONS HERE;
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Users",
    },
  );
  return User;
};
