import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../connection.js";
import bcrypt from "bcrypt"
import { Subscription } from "./subscription.model.js";

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
        set(v) {
            this.setDataValue('emailActivated', false)
            this.setDataValue('email', v)
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isValid(value) {
                if (value.length < 6) { throw new Error(`The password must be atleast 6 characters.`) }
            }
        },
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 9))
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },

    language: {
        type: DataTypes.ENUM,
        values: ['english', 'arabic', 'german', 'french'],
        defaultValue: 'english'
    },

    emailActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

    role: {
        type: DataTypes.ENUM,
        values: ['admin', 'importer', 'factory', 'user','shippingCompany'],
        defaultValue: 'user'
    },
    importerId: {
        type: DataTypes.INTEGER
    },
    factoryId: {
        type: DataTypes.INTEGER
    },
    shippingCompanyId:{
        type:DataTypes.INTEGER
    },
    logout: {
        type: DataTypes.BOOLEAN,
    },
    socketId: {
        type: DataTypes.STRING
    },
    activeTimeLimit: {
        type: DataTypes.DATE
    },
    test:{
        type:DataTypes.STRING,
        defaultValue:"test"
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: (instance, options) => {
            let timeLimit = new Date()
            timeLimit.setHours(timeLimit.getHours() + (24 * 5)) // each 5 days
            instance.activeTimeLimit = timeLimit
        }
    }
})


