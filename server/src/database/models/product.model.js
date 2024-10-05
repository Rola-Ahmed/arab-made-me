import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { Factory } from "./factory.model.js";

export const Product = sequelize.define(
  "products",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate:{
      //   isValid(value){
      //     if(value.length<16)
      //     throw(new Error("description is atleast 16"))
      //   }
      // }
    },
    coverImage: {
      type: DataTypes.STRING,
      //allowNull: false,
      set(value) {
        this.setDataValue("coverImage", value[0].finalPath);
      },
    },
    coverVideo: {
      allowNull: true,

      type: DataTypes.STRING,
      set(value) {
        if (!value) {
          this.setDataValue("coverVideo", "");
        } else {
          this.setDataValue("coverVideo", value[0].finalPath);
        }
      },
    },
    hsnCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValid(value) {
          if (value.length < 6)
            throw new Error("hsn code minimum length is 6 characters");
        },
      },
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      // allowNull:false,
      set(value) {
        let paths = [];
        value.forEach((element) => {
          paths.push(element.finalPath);
        });
        this.setDataValue("images", paths);
      },
      defaultValue: [],
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //   factoryId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //   },

    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    minOrderQuantity: {
      type: DataTypes.STRING,
    },
    maxOrderQuantity: {
      type: DataTypes.STRING,
    },
    specialCharacteristics: {
      type: DataTypes.JSONB,
    },
    guarantee: {
      type: DataTypes.STRING,
    },
    averageRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },

    leadTime: DataTypes.STRING,
  },
  {
    timestamps: true,
  }
);

// Product.belongsTo(Sector);
// Product.belongsTo(Factory, { onDelete: "CASCADE" });
Factory.hasMany(Product);

Product.belongsTo(
  Factory,
  { foreignKey: "factoryId" },
  { onDelete: "CASCADE" }
);
Factory.hasMany(Product, { foreignKey: "factoryId" });
