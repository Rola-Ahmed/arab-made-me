import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Factory } from "./factory.model.js";
import { Importer } from "./importer.model.js";

export const Endorsement = sequelize.define('endorsements', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
   
  },
  {
    timestamps:true
  });



  Endorsement.belongsTo(Factory,{onDelete:'CASCADE'})
  Endorsement.belongsTo(Importer,{onDelete:'CASCADE'})