import Joi from 'joi';

const stringSchema = Joi.string().trim();

export const addVisitValidation = Joi.object({
  purpose: stringSchema.required(),
  date: Joi.date().required(),
  factoryId: Joi.number().required(),
}).required();


export const updateVisitValidation = Joi.object({
    id:Joi.number(),
    purpose: stringSchema,
    date: Joi.date(),
    status: Joi.string().valid('open', 'seen', 'pending', 'accepted', 'rejected'),
  });