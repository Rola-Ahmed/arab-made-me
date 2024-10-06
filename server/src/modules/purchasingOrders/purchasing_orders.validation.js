import Joi from "joi";

const commonFields = {
  factoryId: Joi.number().integer(),
  repName: Joi.string(),
  contactData: Joi.object(),
  quantity: Joi.string().required(),
  instructions: Joi.string(),
  shippingConditions: Joi.string(),
  packingConditions: Joi.string(),
  paymentTerms: Joi.string(),
  conditionsOfDelays: Joi.string(),
  estimationDelay: Joi.string(),
  timeOfManufacturingDelay: Joi.string(),
  examinationDelay: Joi.string(),
  companyQualityTesting: Joi.string(),
  timeLine: Joi.array().max(5).items(Joi.object({
    date: Joi.date(),
    quantity: Joi.string().required()
  })).required(),
  supplyLocation: Joi.string(),
  deadline:Joi.date(),
  shippingTypeAndSize:Joi.string(),
  qualityConditions:Joi.string()
};

const productFields = {
  productId: Joi.number().integer().required()
};

const sourcingOfferFields = {
  sourcingOfferId: Joi.number().required()
};

const quotationFields = {
  quotationId: Joi.number().required()
};

const updateFields = {
  id: Joi.number().required(),
  status: Joi.string()
};

export const addPurchasingOrderValidationSchemaProduct = Joi.object({
  productName: Joi.string().required(),
  ...commonFields,
  ...productFields
});

export const addPurchasingOrderValidationSchemaSourcingOffer = Joi.object({
  productName: Joi.string().required(),
  ...commonFields,
  ...sourcingOfferFields
});

export const addPurchasingOrderValidationSchemaQuotation = Joi.object({
  productName: Joi.string().required(),
  ...commonFields,
  ...quotationFields
});

export const updatePurchasingOrderValidationSchema = Joi.object({
  productName: Joi.string(),
  ...commonFields,
  ...updateFields
}).required();



  export const getPOsValidation=Joi.object({
    include:Joi.string().valid("factory","sourcingOffer","importer","quotation","product")
})