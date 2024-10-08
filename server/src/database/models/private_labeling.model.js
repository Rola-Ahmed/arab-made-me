import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Factory } from "./factory.model.js";
import { Importer } from "./importer.model.js";
import { Product } from "./product.model.js";

export const PrivateLabeling = sequelize.define(
  "privateLabelings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // specialCharacteristics: {
    //     type: DataTypes.JSONB
    // },
    moreDetails: {
      type: DataTypes.STRING,
    },
    productName: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["open", "seen", "pending", "accepted", "rejected"],
      defaultValue: "open",
    },
    docs: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      set(value) {
        let paths = [];
        value.forEach((element) => {
          paths.push(element.finalPath);
        });
        this.setDataValue("docs", paths);
      },
    },
    tradeMark: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue("tradeMark", value[0].finalPath);
      },
    },
    quantity: DataTypes.STRING,
    shippingConditions: DataTypes.STRING,
    shippingSize: DataTypes.STRING,
    supplyLocation: DataTypes.STRING,
    packingConditions: DataTypes.STRING,
    qualityConditions: DataTypes.STRING,
    deadline: DataTypes.DATE,
  },
  {
    timestamps: true,
  }
);

PrivateLabeling.belongsTo(Factory);
Factory.hasMany(PrivateLabeling);
PrivateLabeling.belongsTo(Importer);
PrivateLabeling.belongsTo(Product, { foreignKey: { allowNull: true } });
