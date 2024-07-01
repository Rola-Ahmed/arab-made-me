import Joi from 'joi';

// Common schema for string fields with optional trim
const stringSchema = Joi.string().trim();

// Common schema for array fields
const arraySchema = Joi.array().items(Joi.string());

// Validation schema for the Subscription model
export const addSubscriptionValidationSchema = Joi.object({
    name: stringSchema.required(),
    description: arraySchema.required(),
    price: Joi.number().positive().required(),
    type:stringSchema.required()
});

export const updateSubscriptionValidationSchema = Joi.object({
    id:Joi.number().integer(),
    name: stringSchema,
    description: arraySchema,
    price: Joi.number().positive(),
    type:stringSchema
});
