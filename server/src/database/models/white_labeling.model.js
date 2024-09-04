import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Factory } from "./factory.model.js";
import { Importer } from "./importer.model.js";
import { Product } from "./product.model.js";

export const WhiteLabeling = sequelize.define('whiteLabelings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // specialCharacteristics: {
  //     type: DataTypes.JSONB
  // },
  moreDetails: {
    type: DataTypes.STRING
  },
  productName: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM,
    values: ['open', 'seen', 'pending', 'accepted', 'rejected'],
    defaultValue: 'open'
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
  quantity: DataTypes.INTEGER,
  shippingConditions: DataTypes.STRING,
  shippingSize: DataTypes.STRING,
  supplyLocation: DataTypes.STRING,
  packingConditions: DataTypes.STRING,
  qualityConditions: DataTypes.STRING,
  deadline: DataTypes.DATE
}, {
  timestamps: true
})

WhiteLabeling.belongsTo(Factory)
WhiteLabeling.belongsTo(Importer)
WhiteLabeling.belongsTo(Product,{foreignKey:{allowNull:true}})