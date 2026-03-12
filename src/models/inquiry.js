"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inquiry extends Model {
    static associate(models) {
      // DEFINE ASSOCIATION HERE;
      Inquiry.belongsTo(models.Products, {
        foreignKey: "productId",
      });
    }
  }
  Inquiry.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "contacted", "resolved"),
        defaultValue: "pending",
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Inquiries",
    },
  );
  return Inquiry;
};
