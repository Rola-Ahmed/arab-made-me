import Joi from "joi"


const stringSchema = Joi.string().trim();

const jsonbSchema = Joi.object();

export const addSpecialManufacturingRequestValidationSchema = Joi.object({
    productName: stringSchema.required(),
    technicalSpecifications: stringSchema.required(),
    specialCharacteristics: jsonbSchema.required(),
    inqueries: stringSchema,
    factoryId: Joi.number().integer().positive().required(),
});

export const updateSpecialManufacturingRequestValidationSchema = Joi.object({
    id:Joi.number().integer().required(),
    productName: stringSchema,
    technicalSpecifications: stringSchema,
    specialCharacteristics: jsonbSchema,
    inqueries: stringSchema,
    status:Joi.string()
});
