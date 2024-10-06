import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Product } from "./product.model.js";
import { Factory } from "./factory.model.js";
import { Importer } from "./importer.model.js";

export const QuotationRequest = sequelize.define(
  "quotationRequests",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    deadline: {
      type: DataTypes.DATE,
      validate: {
        isValid(value) {
          if (
            new Date().toISOString.toString().split("T")[0] >
            new Date(value).toISOString.toString().split("T")[0]
          ) {
            throw new Error("deadline can't be in the past");
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: ["open", "seen", "pending", "accepted", "rejected"],
      defaultValue: "open",
    },
    // ProductId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true
    // },
    // factoryId: {
    //     type: DataTypes.INTEGER,
    // },
    // ImporterId: {
    //     type: DataTypes.INTEGER,
    // },
    productName: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingConditions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    packingConditions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qualityConditions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentTerms: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otherInfoRequest: {
      type: DataTypes.STRING,
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
  },
  {
    timestamps: true,
  }
);

// Define associations
QuotationRequest.belongsTo(Product);
QuotationRequest.belongsTo(Factory);
QuotationRequest.belongsTo(Importer);

export default QuotationRequest;
