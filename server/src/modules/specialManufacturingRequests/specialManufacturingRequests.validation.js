import Joi from "joi"


const stringSchema = Joi.string().trim();

const jsonbSchema = Joi.object();

export const addSpecialManufacturingRequestValidationSchema = Joi.object({
    productName: stringSchema.required(),
    technicalSpecifications: stringSchema.required(),
    specialCharacteristics: jsonbSchema.required(),
    inqueries: stringSchema,
    quantity:Joi.number(),
    factoryId: Joi.number().integer().positive().required(),
    packingType:Joi.string(),
    supplyLocation:Joi.string(),
    shippingConditions:Joi.string(),
    shippingSize:Joi.string(),
    deadline:Joi.date(),
    qualityConditions:Joi.string(),
    timeLine: Joi.array().items(Joi.object())
});

export const updateSpecialManufacturingRequestValidationSchema = Joi.object({
    id:Joi.number().integer().required(),
    productName: stringSchema,
    technicalSpecifications: stringSchema,
    specialCharacteristics: jsonbSchema,
    inqueries: stringSchema,
    quantity:Joi.number(),
    status:Joi.string(),
    packingType:Joi.string(),
    supplyLocation:Joi.string(),
    shippingConditions:Joi.string(),
    shippingSize:Joi.string(),
    qualityConditions:Joi.string(),
    timeLine: Joi.array().items(Joi.object())
});
