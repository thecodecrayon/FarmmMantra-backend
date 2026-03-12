"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class View extends Model {
    static associate(models) {
      // DEFINE ASSOCIATION HERE;
      View.belongsTo(models.Products, {
        foreignKey: "productId",
      });
    }
  }
  View.init(
    {
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Views",
    },
  );
  return View;
};
