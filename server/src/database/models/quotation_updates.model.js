import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import QuotationRequest from "./qoutation_request.model.js";
import { Product } from "./product.model.js";
import { User } from "./user.model.js";
import { Importer } from "./importer.model.js";
import { Factory } from "./factory.model.js";
import { SpecialManufacturingRequest } from "./special_manufacturing.model.js";
import { PrivateLabeling } from "./private_labeling.model.js";
import { SourcingRequest } from "./sourcing_hub/request.model.js";
import { WhiteLabeling } from "./white_labeling.model.js";
import Quotation from "./quotation.model.js";

const QuotationUpdates = sequelize.define(
  "quotationsUpdates",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    productName: {
      type: DataTypes.STRING,
    },
    minQuantity: {
      type: DataTypes.INTEGER,
    },
    requestedQuantity: DataTypes.INTEGER,
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    discounts: {
      type: DataTypes.STRING,
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
    timeLine: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
    },
    notes: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["open", "seen", "pending", "accepted", "rejected"],
      defaultValue: "open",
    },
    qualityConditions: {
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
    shippingSize: DataTypes.STRING,
    supplyLocation: DataTypes.STRING,
    deadline: DataTypes.DATE,
    formCode: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

QuotationUpdates.belongsTo(Quotation);
QuotationUpdates.belongsTo(SpecialManufacturingRequest, {
  foreignKey: { allowNull: true },
});
// Quotation.belongsTo(Product)
QuotationUpdates.belongsTo(Importer, { foreignKey: { allowNull: true } });
QuotationUpdates.belongsTo(Factory, { foreignKey: { allowNull: true } });
QuotationUpdates.belongsTo(PrivateLabeling, {
  foreignKey: { allowNull: true },
});
QuotationUpdates.belongsTo(WhiteLabeling, { foreignKey: { allowNull: true } });
QuotationUpdates.belongsTo(SourcingRequest, {
  foreignKey: { allowNull: true },
});

export default QuotationUpdates;
