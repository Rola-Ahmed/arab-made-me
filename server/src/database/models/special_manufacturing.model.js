import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Factory } from "./factory.model.js";
import { Importer } from "./importer.model.js";

export const SpecialManufacturingRequest = sequelize.define('specialManufacturingRequests', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productName: {
        type: DataTypes.STRING
    },
    technicalSpecifications: {
        type: DataTypes.STRING
    },
    specialCharacteristics: {
        type: DataTypes.JSONB
    },
    inqueries: {
        type: DataTypes.STRING
    },
    status:{
        type:DataTypes.ENUM,
        values:['open','seen','pending','accepted','rejected'],
        defaultValue:'open'
    },
    docs: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        set(value) {
            let paths = []
            value.forEach(element => {
                paths.push(element.finalPath)
            });
            this.setDataValue('docs', paths)
        }
    },
},
    {
        timestamps: true
    })

    SpecialManufacturingRequest.belongsTo(Factory)
    SpecialManufacturingRequest.belongsTo(Importer)