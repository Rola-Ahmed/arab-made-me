import Joi from 'joi';

// Common schema for string fields with optional trim
const stringSchema = Joi.string().trim();

// Common schema for array fields
const arraySchema = Joi.array().items(Joi.string());

// Validation schema for the Subscription model
export const addContactUsValidation = Joi.object({
  message: stringSchema.required(),
  address: Joi.string(),
  company: Joi.string(),
  // userId:Joi.number().required(),
  name: stringSchema.required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required()
});


