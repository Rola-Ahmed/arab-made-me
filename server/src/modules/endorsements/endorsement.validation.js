import Joi from 'joi';



export const addEndorsementValidation = Joi.object({
  factoryId: Joi.number().required(),
}).required();


