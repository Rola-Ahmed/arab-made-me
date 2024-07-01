import Joi from "joi";


let joiString = Joi.string()
let quantity = Joi.number()
let shippingConditions = Joi.string().max(255)
let packingConditions = Joi.string().max(255)
let paymentTerms = Joi.string().max(255)
let otherInfoRequest = Joi.string().max(255)
let qualityConditions = Joi.string().max(255)
let deadline=Joi.date()
let preferredCountries=Joi.array().items(Joi.string())
let specialCharacteristics=Joi.object()
let id=Joi.number()



export const addSourcingRequestValidation = Joi.object({
    productName: joiString.required(),
    productDescription:joiString.required(),
    quantity: quantity.required(),
    shippingConditions,
    packingConditions,
    paymentTerms,
    otherInfoRequest,
    qualityConditions,
    specialCharacteristics,
    deadline,
    preferredCountries
}).required()


export const updateSourcingRequestValidation = Joi.object({
    id:id.required(),
    productName: joiString,
    productDescription:joiString,
    quantity: quantity,
    shippingConditions,
    packingConditions,
    paymentTerms,
    otherInfoRequest,
    qualityConditions,
    specialCharacteristics,
    deadline,
    preferredCountries,
    status:joiString.valid('pending','accepted','rejected')
}).required()