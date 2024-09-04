import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import QuotationRequest from "./qoutation_request.model.js";
import { Product } from "./product.model.js";
import { User } from "./user.model.js";
import { Importer } from "./importer.model.js";
import { Factory } from "./factory.model.js";
import { SourcingOffer } from "./sourcing_hub/offer.js";
import Quotation from "./quotation.model.js";

const PurchasingOrder = sequelize.define('purchasingOrders', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    
    repName: {
        type: DataTypes.STRING,
    },
    contactData: {
        type: DataTypes.JSONB,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    productName:{
        type:DataTypes.STRING,
        allowNull:true
    },
   sourcingOfferId:{
    type:DataTypes.INTEGER,
    allowNull:true
   },
   quotationId:{
    type:DataTypes.INTEGER,
    allowNull:true
   },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status:{
        type:DataTypes.ENUM,
        values:['open','seen','pending','accepted','rejected'],
        defaultValue:'open'
    },
    instructions: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    shippingConditions: {
        type: DataTypes.STRING,
    },
    packingConditions: {
        type: DataTypes.STRING,
    },
    qualityConditions:DataTypes.STRING,
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
    legalStamp: {
        type: DataTypes.STRING, 
        //allowNull: false,
        set(value){
          this.setDataValue('legalStamp',value[0].finalPath)
        }
    },
    paymentTerms: {
        type: DataTypes.STRING,
    },
    conditionsOfDelays: {
        type: DataTypes.STRING,
    },
    estimationDelay: {
        type: DataTypes.STRING,
    },
    timeOfManufacturingDelay: {
        type: DataTypes.STRING,
    },
    examinationDelay: {
        type: DataTypes.STRING,
    },
    companyQualityTesting: {
        type: DataTypes.STRING,
    },
    timeLine:{
        type:DataTypes.JSONB,
    },
    supplyLocation:DataTypes.STRING,
    deadline:DataTypes.DATE,
    shippingTypeAndSize:DataTypes.STRING
},
{
    timestamps:true
});

PurchasingOrder.belongsTo(Factory);
PurchasingOrder.belongsTo(Product)
PurchasingOrder.belongsTo(SourcingOffer)
// PurchasingOrder.belongsTo(User,{as:'requester'})
PurchasingOrder.belongsTo(Importer)
PurchasingOrder.belongsTo(Quotation)

export default PurchasingOrder;