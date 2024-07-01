import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js"
import { User } from "./user.model.js";

export const LoginTimes = sequelize.define('loginTimes', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    times: {
      type: DataTypes.INTEGER,
      defaultValue:1
    },
    expirationDate:{
      type:DataTypes.DATE
    }
  },
  {
    timestamps:true,
    hooks:{
        beforeCreate:(instance,options)=>{
            let expirationDate= new Date()
            expirationDate.setSeconds(expirationDate.getSeconds()+(60*2)) // each 4 hours
            instance.expirationDate=expirationDate
        }
    }
  });


  LoginTimes.belongsTo(User)

