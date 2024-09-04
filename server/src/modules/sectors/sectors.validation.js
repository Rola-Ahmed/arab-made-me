import Joi from "joi";

export const addSectorValidationSchema=Joi.object({
    name:Joi.string().min(3).required(),
    keywords:Joi.array().items(Joi.string().min(3).max(25)).required()
}).required()

export const updateSectorValidationSchema=Joi.object({
    name:Joi.string().min(3).max(25),
    keywords:Joi.array().items(Joi.string().min(3).max(25))
})