import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Product } from "./product.model.js";
import { Sector } from "./sector.model.js";

export const Category = sequelize.define('categories', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    keywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    // SectorId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  },
  {
    timestamps:true
  });


  // Category.hasMany(Product)

  Category.belongsTo(Sector,{onDelete:'CASCADE'})
  Product.belongsTo(Category)