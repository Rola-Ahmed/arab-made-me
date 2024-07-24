import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { User } from "./user.model.js";


export const Session = sequelize.define('sessions', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    data: {
      type: DataTypes.JSONB,
    },
  },
  {
    timestamps:true
  });

  
Session.belongsTo(User)