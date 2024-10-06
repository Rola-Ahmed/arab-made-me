import Joi from 'joi';



// Common schema for JSONB fields
const jsonbSchema = Joi.object();

// Validation schema for the WhiteLabeling model
export const addWhiteLabelingValidationSchema = Joi.object({
    productName: Joi.string().optional(),
    moreDetails:Joi.string(),
    // specialCharacteristics: jsonbSchema.required(),
    factoryId: Joi.number().integer().positive().required(),
    productId: Joi.number().integer().positive().optional(),
    supplyLocation:Joi.string(),
    shippingConditions:Joi.string(),
    shippingSize:Joi.string(),
    quantity:Joi.string(),
    qualityConditions:Joi.string(),
    packingConditions:Joi.string(),
    deadline:Joi.date()
});

export const updateWhiteLabelingValidationSchema = Joi.object({
    id: Joi.number().integer().required(),
    moreDetails:Joi.string(),
    //specialCharacteristics: jsonbSchema,
    productId: Joi.number().integer().positive(),
    status: Joi.string(),
    supplyLocation:Joi.string(),
    shippingConditions:Joi.string(),
    shippingSize:Joi.string(),
    quantity:Joi.string(),
    qualityConditions:Joi.string(),
    packingConditions:Joi.string(),
    deadline:Joi.date()
});
