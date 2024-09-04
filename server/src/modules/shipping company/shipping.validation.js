import Joi from "joi";

export const addShippingCompanySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().min(10).required(),
    country:Joi.string(),
    city:Joi.string(),
     repEmail: Joi.string().email(),
}).required()

export const updateShippingCompanyValidation = Joi.object({
    id:Joi.number(),
    name: Joi.string(),
    description: Joi.string().min(10),
    country:Joi.string(),
    city:Joi.string(),
     repEmail: Joi.string().email(),
});

export const updateShippingCompanyValidationAdmin = Joi.object({
    id:Joi.number(),
    name: Joi.string(),
    description: Joi.string().min(10),
    verified:Joi.string().valid('1','0'),
    emailActivated:Joi.boolean(),
    country:Joi.string(),
    city:Joi.string(),
     repEmail: Joi.string().email(),
});

