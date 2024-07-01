import Joi from "joi";

let id = Joi.number()
let sourcingRequestId=Joi.number()
let price = Joi.number().min(1)
let string=Joi.string()

export const addSourcingQuotationValidation = Joi.object({
    price:price.required(),
    sourcingRequestId:sourcingRequestId.required(),
    shippingConditions:string.required(),
    packingConditions:string.required(),
    paymentTerms:string.required()
}).required()


export const updateSourcingQuotationValidation = Joi.object({
    id:id.required(),
    price,
    sourcingRequestId,
    shippingConditions:string,
    packingConditions:string,
    paymentTerms:string
}).required()
