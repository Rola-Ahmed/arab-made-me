import Joi from "joi";

export const addSourcingOfferSchema = Joi.object({
  price: Joi.string().required(),
  productName: Joi.string().required(),
  productDescription: Joi.string().required(),
  productHSNCode: Joi.string().min(6),
  quantity: Joi.string().required(),
  qualityConditions: Joi.string(),
  shippingConditions: Joi.string(),
  packingConditions: Joi.string(),
  paymentTerms: Joi.string(),
  deliveryTerms: Joi.string(),
  productId: Joi.number().integer(),
  preferredCountries: Joi.array().items(Joi.string()),
});

export const updateSourcingOfferSchema = Joi.object({
  id: Joi.number().integer(),
  price: Joi.string().required(),
  productName: Joi.string(),
  productDescription: Joi.string(),
  productHSNCode: Joi.string().min(6),
  quantity: Joi.string().required(),
  qualityConditions: Joi.string(),
  shippingConditions: Joi.string(),
  packingConditions: Joi.string(),
  paymentTerms: Joi.string(),
  deliveryTerms: Joi.string(),
  productId: Joi.number().integer(),
  status: Joi.string(),
  preferredCountries: Joi.array().items(Joi.string()),
});
