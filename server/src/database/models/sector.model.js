import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Product } from "./product.model.js";
import { Category } from "./category.model.js";


export const Sector = sequelize.define('sectors', {
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
      type: DataTypes.ARRAY(DataTypes.STRING), // You can store keywords as a string
    },
    image: {
      type: DataTypes.STRING, 
      //allowNull: false,
      set(value){
        this.setDataValue('image',value[0].finalPath)
      }
    },
  },
  {
    timestamps:true
  });

  
  // Sector.hasMany(Product)

  
  // Sector.hasMany(Category)