import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Factory } from "./factory.model.js";
import { Importer } from "./importer.model.js";

export const Visit = sequelize.define(
  "visits",
  {
    purpose: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requiredProducts: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visitType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    individualsNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["open", "seen", "pending", "accepted", "rejected"],
      defaultValue: "open",
    },
  },
  {
    timestamps: true,
  }
);

Visit.belongsTo(Factory);
Visit.belongsTo(Importer);
