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

const Quotation = sequelize.define('quotations', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    quotationRequestId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    sourcingRequestId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    specialManufacturingRequestId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    privateLabelingId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    productName: {
        type: DataTypes.STRING,
    },
    minQuantity: {
        type: DataTypes.INTEGER,
    },
    requestedQuantity:DataTypes.INTEGER,
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
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
        values: ['open', 'seen', 'pending', 'accepted', 'rejected'],
        defaultValue: 'open'
    },
    qualityConditions: {
        type: DataTypes.STRING,
    },
    docs: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        set(value) {
            let paths = []
            value.forEach(element => {
                paths.push(element.finalPath)
            });
            this.setDataValue('docs', paths)
        }
    },
    shippingSize:DataTypes.STRING,
    supplyLocation:DataTypes.STRING,
    deadline:DataTypes.DATE,
    formCode:{
        type:DataTypes.STRING,
        unique:true
    }
}, {
    timestamps: true,
});


Quotation.belongsTo(QuotationRequest);
Quotation.belongsTo(SpecialManufacturingRequest)
// Quotation.belongsTo(Product)
Quotation.belongsTo(Importer)
Quotation.belongsTo(Factory)
Quotation.belongsTo(PrivateLabeling)
Quotation.belongsTo(WhiteLabeling,{foreignKey:{allowNull:true}})
Quotation.belongsTo(SourcingRequest)

export default Quotation;