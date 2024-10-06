import { DataTypes } from "sequelize";
import { sequelize } from "../../connection.js";
import { Importer } from "../importer.model.js";
import { Product } from "../product.model.js";

export const SourcingRequest = sequelize.define('sourcingRequests', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    deadline: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM,
      values:['pending','accepted','rejected'],
      defaultValue:'pending'
    },
    productName:{
      type:DataTypes.STRING,
      allowNull:false
    },
    productDescription:{
      type:DataTypes.STRING,
      allowNull:false
    },
    specialCharacteristics: {
      type: DataTypes.JSONB,
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preferredCountries: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue:[]
    },
    shippingConditions: {
      type: DataTypes.STRING,
    },
    packingConditions: {
      type: DataTypes.STRING,
    },
    qualityConditions: {
      type: DataTypes.STRING,
    },
    paymentTerms: {
      type: DataTypes.STRING,
    },
    otherInfoRequest: {
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
   timestamps:true
  });

  SourcingRequest.belongsTo(Importer,{onDelete:'CASCADE'})
  // SourcingRequest.belongsTo(Product)