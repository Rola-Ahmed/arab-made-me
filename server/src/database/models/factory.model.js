import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import { User } from "./user.model.js";
import { Sector } from "./sector.model.js";
import { Product } from "./product.model.js";
import { Subscription } from "./subscription.model.js";
import Trim from "trim";

export const Factory = sequelize.define('factories', {
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
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        validate: {
            isValid(value) {
                if (value.length < 10) { throw new Error(`The description must be atleast 10 characters.`) }
            }
        },
        allowNull: false
    },
    whyUs: {
        type: DataTypes.TEXT,
        validate: {
            isValid(value) {
                if (value.length < 10) { throw new Error(`The description must be atleast 10 characters.`) }
            }
        },
    },
    repName: {
        type: DataTypes.ARRAY(DataTypes.STRING(50)),
        set(value) {
            this.setDataValue('repName', [Trim(value[0]), Trim(value[1])])
        },
        allowNull: true,
    },
    allowEmailNotification:{type:DataTypes.BOOLEAN, defaultValue:true},
    repEmail: {
        type: DataTypes.STRING,
        // unique: true,
        validate: {
            isEmail: true
        },
        // set(v) {
        //     this.setDataValue('emailActivated', false)
        //     this.setDataValue('repEmail', v)
        // }
    },
    repPhone: {
        type: DataTypes.STRING,
        //  allowNull: false
    },
    address: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        // allowNull: false,
    },
    // sector: {
    //     type: DataTypes.ENUM,
    //     values: ['electronics', 'chemicals', 'clothes']
    // },
    importingCountries: DataTypes.ARRAY(DataTypes.STRING),
    commercialRegisterationNumber: {
        type: DataTypes.BIGINT,
        //   allowNull: false,
        // unique: true,
        validate: {
            isValid(value) {
                console.log(value.toString().length > 8 && value.toString().length < 16);
                if (!(value.toString().length >= 8 && value.toString().length <= 16)) {
                    console.log("here -- 1");
                    throw new Error(`The taxRegisterationNo should be (8:16) digits.`)
                }

            }
        }
    },
    taxRegisterationNumber: {
        type: DataTypes.BIGINT,
        //   allowNull: false,
        //unique: true,
        validate: {
            isValid(value) {
                console.log(value.toString().length >= 8 && value.toString().length <= 16);
                if (!(value.toString().length >= 8 && value.toString().length <= 16)) {
                    console.log("here -- 1");
                    throw new Error(`The taxRegisterationNo should be (8:16) digits.`)
                }

            }
        }
    },
    directorName: DataTypes.STRING,
    directorEmail: { type: DataTypes.STRING, unique: true, validate: { isEmail: true } },
    directorPhone: DataTypes.STRING,
    numberOfProductonLines: { type: DataTypes.INTEGER },
    numberOfEmployees: { type: DataTypes.STRING },
    qualityCertificates: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        set(value) {
            let paths = []
            value.forEach(element => {
                paths.push(element.finalPath)
            });
            this.setDataValue('qualityCertificates', paths)
        }
    },
    testLaboratory: DataTypes.BOOLEAN,
    researchAndDevelopmentSection: DataTypes.BOOLEAN,
    acceptManufacturingForOthers: DataTypes.BOOLEAN,
    acceptSpecialOrders: DataTypes.BOOLEAN,
    acceptManufacturingForSpecialBrands: DataTypes.BOOLEAN,
    acceptPaymentWithArabCurriencies: DataTypes.BOOLEAN,
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
    legalDocs: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        set(value) {
            let paths = []
            value.forEach(element => {
                paths.push(element.finalPath)
            });
            this.setDataValue('legalDocs', paths)
        }
    },
    coverVideo: {
        type: DataTypes.STRING,
        set(value) {
            this.setDataValue('coverVideo', value[0].finalPath)
        }
    },
    verified: {
        type: DataTypes.ENUM,
        values: ['0', '1'],
        defaultValue: '1'
    },
    yearOfEstablishmint: DataTypes.STRING,
    phone: DataTypes.STRING,
    yearlySalesIncome: DataTypes.STRING,
    website: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    },
    // subscriptionId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true
    // },
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    socialLinks: DataTypes.JSONB,
    businessHours: DataTypes.STRING,
    emailActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    IndustrialRegistrationNumber:{
        type:DataTypes.BIGINT,
    },
    IndustrialLicenseNumber:{
        type:DataTypes.BIGINT
    }
    // team:{
    //     type:DataTypes.ARRAY(DataTypes.JSONB),
    //     defaultValue:[]
    // }

}, {
    timestamps: true
})


Factory.belongsTo(User, { onDelete: 'CASCADE' })
Factory.belongsTo(Sector)
Factory.belongsTo(Subscription,{foreignKey:{allowNull:true}})


