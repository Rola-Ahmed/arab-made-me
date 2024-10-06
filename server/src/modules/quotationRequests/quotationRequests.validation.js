import Joi from "joi";

let factoryId = Joi.number()
let importerId = Joi.number()
let productId = Joi.number().min(1)
let quantity = Joi.string()
let shippingConditions = Joi.string().max(255)
let packingConditions = Joi.string().max(255)
let paymentTerms = Joi.string().max(255)
let otherInfoRequest = Joi.string().max(255)
let qualityConditions = Joi.string().max(255)
let deadline=Joi.date()
let id=Joi.number()


export const addQuotationRequestValidation = Joi.object({
    productName:Joi.string().required(),
    factoryId:factoryId.required(),
    //importerId: importerId.required(),
    productId: productId.required(),
    quantity: quantity,
    shippingConditions: shippingConditions,
    packingConditions: packingConditions,
    paymentTerms: paymentTerms,
    otherInfoRequest,
    qualityConditions: qualityConditions,
    deadline,
}).required()


export const updateQuotationRequestValidation = Joi.object({
    productName:Joi.string(),
    id:id.required(),
    quantity,
    shippingConditions,
    packingConditions,
    paymentTerms,
    otherInfoRequest,
    qualityConditions,
    deadline,
    status:Joi.string()
}).required()