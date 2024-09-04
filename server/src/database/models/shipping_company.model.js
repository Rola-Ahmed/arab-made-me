import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import {User} from "./user.model.js"

export const ShippingCompany = sequelize.define('shippingCompanies', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    description: {
      type: DataTypes.STRING,
    },
    country:{
        type:DataTypes.STRING
    },
    city:{
        type:DataTypes.STRING
    },
    repEmail:{
        type:DataTypes.STRING,
        validate: {
            isEmail: true,
        }
    },
    verified: {
        type:DataTypes.ENUM,
        values:['0','1'],
        defaultValue:'1'
    },
    emailActivated:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    legalDocs:{
        type:DataTypes.ARRAY(DataTypes.STRING),
        set(value){
            let paths=[]
            value.forEach(element => {
                paths.push(element.finalPath)    
            });
            this.setDataValue('legalDocs',paths)
        }
    },
    coverImage: {
        type: DataTypes.STRING,
        set(value) {
            this.setDataValue('coverImage', value[0].finalPath)
        }
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        set(value) {
            let paths = []
            value.forEach(element => {
                paths.push(element.finalPath)
            });
            this.setDataValue('images', paths)
        }
    },
    // SectorId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  },
  {
    timestamps:true
  });


  // ShippingCompany.hasMany(Product)

  ShippingCompany.belongsTo(User,{onDelete:'CASCADE'})
 