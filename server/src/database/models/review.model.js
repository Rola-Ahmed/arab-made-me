import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Product } from "./product.model.js";
import { Importer } from "./importer.model.js";

export const Review = sequelize.define("reviews", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    comment: {
        type: DataTypes.STRING
    },
    rate: {
        type: DataTypes.INTEGER,
        allowNull:false,
        validate: {
            isValid(v) {
                if (v > 5 || v < 1) throw (new Error("rates are only from 1 to 5", { status: 404 }))
            }
        }
    }
}, {
    timestamps: true
})

Review.belongsTo(Product)
Review.belongsTo(Importer)