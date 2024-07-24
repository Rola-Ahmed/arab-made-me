import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Factory } from "./factory.model.js";

export const TeamMember = sequelize.define('teamMembers', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique:true
    },
    role: {
      type: DataTypes.STRING, // You can store keywords as a string
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


  TeamMember.belongsTo(Factory)