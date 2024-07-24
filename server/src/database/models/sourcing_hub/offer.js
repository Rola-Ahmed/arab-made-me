import { DataTypes } from "sequelize";
import { sequelize } from "../../connection.js";
import { Category } from "../category.model.js";
import { Factory } from "../factory.model.js";
import { Product } from "../product.model.js";

export const SourcingOffer = sequelize.define('sourcingOffers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    productId:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    preferredCountries: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue:[]
      },
    productName:{
        type:DataTypes.STRING
    },
    productDescription:{
        type:DataTypes.STRING
    },
    productHSNCode:{
        type:DataTypes.STRING
    },
    quantity:{
        type:DataTypes.INTEGER,
    },
    qualityConditions:{
        type:DataTypes.STRING
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
    deliveryTerms:{
        type:DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM,
        values:['pending','accepted','rejected'],
        defaultValue:'pending'
      },
    images: {
        type:DataTypes.ARRAY(DataTypes.STRING),
        set(value){
            let paths=[]
            value.forEach(element => {
                paths.push(element.finalPath)    
            });
            this.setDataValue('images',paths)
        }
    },
}, {
    timestamps: true,
});


SourcingOffer.belongsTo(Factory)
SourcingOffer.belongsTo(Category)
SourcingOffer.belongsTo(Product)