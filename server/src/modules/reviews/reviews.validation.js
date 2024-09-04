import Joi from 'joi';




export const addReviewValidation = Joi.object({
    comment: Joi.string(),
    rate: Joi.number().integer().min(1).max(5).required().error(new Error("Rates must be between 1 and 5")),
    productId: Joi.number().integer().required(),
});


export const updateReviewValidation = Joi.object({
    id:Joi.number().integer().required(),
    comment: Joi.string(),
    rate: Joi.number().integer().min(1).max(5).error(new Error("Rates must be between 1 and 5")),
});

