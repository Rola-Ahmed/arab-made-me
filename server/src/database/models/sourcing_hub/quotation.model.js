import { DataTypes } from "sequelize";
import { sequelize } from "../../connection.js";
import { Factory } from "../factory.model.js";
import { SourcingRequest } from "./request.model.js";

const SourcingQuotation = sequelize.define('sourcingQuotations', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    shippingConditions: {
        type: DataTypes.STRING,
    },
    packingConditions: {
        type: DataTypes.STRING,
    },
    paymentTerms: {
        type: DataTypes.STRING,
    },
    docs: {
        type:DataTypes.ARRAY(DataTypes.STRING),
        set(value){
            let paths=[]
            value.forEach(element => {
                paths.push(element.finalPath)    
            });
            this.setDataValue('docs',paths)
        }
    },
}, {
    timestamps: true,
});


SourcingQuotation.belongsTo(SourcingRequest);
SourcingQuotation.belongsTo(Factory)

export default SourcingQuotation;