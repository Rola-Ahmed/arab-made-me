import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { User } from "./user.model.js";
import { Sector } from "./sector.model.js";
import Trim from "trim";

export const Importer = sequelize.define(
  "importers",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //     isValid(value) {
      //         if (value.length < 10) { throw new Error(`The description should be atleast 10 characters.`) }

      //     }
      // }
    },
    repName: {
      type: DataTypes.STRING,
      // allowNull: false,
      set(value) {
        this.setDataValue("repName", Trim(value));
      },
    },
    repEmail: {
      type: DataTypes.STRING,
      // allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(v) {
        this.setDataValue("emailActivated", false);
        this.setDataValue("repEmail", v);
      },
    },
    vatNumber: {
      type: DataTypes.BIGINT,
      //   allowNull: false,
      //unique: true,
      // validate: {
      //   isValid(value) {
      //     console.log(
      //       value.toString().length >= 8 && value.toString().length <= 16
      //     );
      //     if (
      //       !(value.toString().length >= 8 && value.toString().length <= 16)
      //     ) {
      //       console.log("here -- 1");
      //       throw new Error(`The Vat Number should be (8:16) digits.`);
      //     }
      //   },
      // },
    },

    importerLicenseNumber: {
      type: DataTypes.BIGINT,
      //   allowNull: false,
      //unique: true,
      // validate: {
      //   isValid(value) {
      //     console.log(
      //       value.toString().length >= 8 && value.toString().length <= 16
      //     );
      //     if (
      //       !(value.toString().length >= 8 && value.toString().length <= 16)
      //     ) {
      //       console.log("here -- 1");
      //       throw new Error(
      //         `The importer License Number should be (8:16) digits.`
      //       );
      //     }
      //   },
      // },
    },

    repPhone: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    address: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      // allowNull: false,
      defaultValue: [],
    },
    // sector: {
    //     type: DataTypes.ENUM,
    //     values: ['electronics', 'chemicals', 'clothes']
    // },
    exportingCountries: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    commercialRegisterationNumber: {
      type: DataTypes.BIGINT,
      //   allowNull: false,
      //unique: true,
      validate: {
        isValid(value) {
          console.log(
            value.toString().length > 8 && value.toString().length < 16
          );
          if (
            !(value.toString().length >= 8 && value.toString().length <= 16)
          ) {
            console.log("here -- 1");
            throw new Error(
              `The commercial Registeration should be (8:16) digits.`
            );
          }
        },
      },
    },
    verified: {
      type: DataTypes.ENUM,
      values: ["0", "1"],
      defaultValue: "1",
    },
    legalDocs: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      set(value) {
        let paths = [];
        value.forEach((element) => {
          paths.push(element.finalPath);
        });
        this.setDataValue("legalDocs", paths);
      },
      defaultValue: [],
    },

    yearOfEstablishmint: DataTypes.INTEGER,
    website: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    socialLinks: DataTypes.JSONB,
    businessHours: DataTypes.STRING,
    emailActivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    allowEmailNotification: { type: DataTypes.BOOLEAN, defaultValue: true },
    image: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue("image", value[0].finalPath);
      },
    },
  },
  {
    timestamps: true,
  }
);

Importer.belongsTo(User, { onDelete: "CASCADE" });
Importer.belongsTo(Sector);
