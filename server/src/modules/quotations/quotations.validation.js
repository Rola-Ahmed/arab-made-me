import Joi from "joi";

let factoryId = Joi.number()
let importerId = Joi.number()
let productId = Joi.number()
let quotationRequestId=Joi.number()
let quantity = Joi.number().min(1)
let minQuantity = Joi.number().min(1)
let price = Joi.number().min(1)
let discounts = Joi.number()
let shippingConditions = Joi.string()
let packingConditions = Joi.string()
let paymentTerms = Joi.string()
let qualityConditions= Joi.string()
let notes= Joi.string()
let timeForDelivery=Joi.object()
let specialManufacturingRequestId=Joi.number()
let privateLabelingId=Joi.number()
let sourcingRequestId=Joi.number()

export const addQuotationValidationRFQ = Joi.object({
    productName:Joi.string().required(),
    importerId: importerId.required(),
    quantity: quantity.required(),
    shippingConditions: shippingConditions.required(),
    packingConditions: packingConditions.required(),
    paymentTerms: paymentTerms.required(),
    minQuantity:minQuantity.required(),
    qualityConditions:qualityConditions.required(),
    price:price.required(),
    discounts,
    timeForDelivery,
    notes,
    // specialManufacturingRequestId,
    // privateLabelingId,
    // sourcingRequestId,
    productId:productId.required(),
    quotationRequestId:quotationRequestId.required()
}).required()

export const addQuotationValidationSourcingRequest = Joi.object({
    productName:Joi.string().required(),
    importerId: importerId.required(),
    quantity: quantity.required(),
    shippingConditions: shippingConditions.required(),
    packingConditions: packingConditions.required(),
    paymentTerms: paymentTerms.required(),
    minQuantity:minQuantity.required(),
    qualityConditions:qualityConditions.required(),
    price:price.required(),
    discounts,
    timeForDelivery,
    notes,
    // specialManufacturingRequestId,
    // privateLabelingId,
    // sourcingRequestId,
    sourcingRequestId:sourcingRequestId.required()
}).required()


export const addQuotationValidationPrivateLabel = Joi.object({
    productName:Joi.string().required(),
    importerId: importerId.required(),
    quantity: quantity.required(),
    shippingConditions: shippingConditions.required(),
    packingConditions: packingConditions.required(),
    paymentTerms: paymentTerms.required(),
    minQuantity:minQuantity.required(),
    qualityConditions:qualityConditions.required(),
    price:price.required(),
    discounts,
    timeForDelivery,
    notes,
    // specialManufacturingRequestId,
    // privateLabelingId,
    // sourcingRequestId,
    privateLabelingId:privateLabelingId.required()
}).required()

export const addQuotationValidationSpmf = Joi.object({
    productName:Joi.string().required(),
    importerId: importerId.required(),
    quantity: quantity.required(),
    shippingConditions: shippingConditions.required(),
    packingConditions: packingConditions.required(),
    paymentTerms: paymentTerms.required(),
    minQuantity:minQuantity.required(),
    qualityConditions:qualityConditions.required(),
    price:price.required(),
    discounts,
    timeForDelivery,
    notes,
    // specialManufacturingRequestId,
    // privateLabelingId,
    // sourcingRequestId,
    specialManufacturingRequestId:specialManufacturingRequestId.required()
}).required()

export const updateQuotationValidation=Joi.object({
    productName:Joi.string(),
    id:Joi.number().required(),
    quantity,
    shippingConditions,
    packingConditions,
    paymentTerms,
    qualityConditions,
    minQuantity,
    price,
    discounts,
    notes,
    timeForDelivery,
    status:Joi.string()
}).required()


export const getQuotationsValidation=Joi.object({
    include:Joi.string().valid("factory","sourcingRequest","importer","privateLabeling","specialManufacturingRequest","quotationRequest"),
    id:Joi.number()
})