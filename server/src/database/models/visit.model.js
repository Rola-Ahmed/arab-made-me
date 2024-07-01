import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Factory } from "./factory.model.js";
import { Importer } from "./importer.model.js";

export const Visit=sequelize.define('visits',{
    purpose:{
        type:DataTypes.STRING,
        allowNull:false
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM,
        values:['open','seen','pending','accepted','rejected'],
        defaultValue:'open'
    }
},{
    timestamps:true
})


Visit.belongsTo(Factory)
Visit.belongsTo(Importer)