import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Factory } from "./factory.model.js";
import { Importer } from "./importer.model.js";

export const SpecialManufacturingRequest = sequelize.define(
  "specialManufacturingRequests",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING,
    },
    technicalSpecifications: {
      type: DataTypes.STRING,
    },
    specialCharacteristics: {
      type: DataTypes.JSONB,
    },
    inqueries: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["open", "seen", "pending", "accepted", "rejected"],
      defaultValue: "open",
    },
    packingType: DataTypes.STRING,
    supplyLocation: DataTypes.STRING,
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
    deadline: DataTypes.DATE,
    qualityConditions: DataTypes.STRING,
    timeLine: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
    },
  },
  {
    timestamps: true,
  }
);

SpecialManufacturingRequest.belongsTo(Factory);
SpecialManufacturingRequest.belongsTo(Importer);
