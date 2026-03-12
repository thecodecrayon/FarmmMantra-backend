"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // DEFINE ASSOCIATIONS HERE;
      Product.belongsTo(models.Categories, {
        foreignKey: "categoryId",
      });

      Product.belongsTo(models.Artisans, {
        foreignKey: "artisanId",
      });

      Product.hasMany(models.Views, {
        foreignKey: "productId",
      });

      Product.hasMany(models.Inquiries, {
        foreignKey: "productId",
      });
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      artisanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      defaultQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantityNote: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discountInPercent: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      keyFeatures: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      isDeleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Products",
    },
  );
  return Product;
};
