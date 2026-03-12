"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Artisan extends Model {
    static associate(models) {
      // DEFINE ASSOCIATIONS HERE;
      Artisan.hasMany(models.Products, {
        foreignKey: "artisanId",
      });
    }
  }
  Artisan.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tagline: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numberOfArtisans: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      yearsActive: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productsSold: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      impactPoints: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      badges: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      isDeleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Artisans",
    },
  );
  return Artisan;
};
