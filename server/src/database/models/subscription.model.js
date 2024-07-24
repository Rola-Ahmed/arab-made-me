import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

export const Subscription = sequelize.define('subscriptions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    type:{
        type:DataTypes.ENUM,
        values:['Free','Standard','Gold','Premium']
    },
    description:{
        type:DataTypes.ARRAY(DataTypes.STRING()),
        allowNull:false
    },
    price:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },
}, {
    timestamps: true
})