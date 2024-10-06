import Joi from "joi";

const baseQuotationSchema = {
  quotationId: Joi.number(),
  productName: Joi.string(),
  importerId: Joi.number(),
  quantity: Joi.string().required(),

  shippingConditions: Joi.string(),
  packingConditions: Joi.string(),
  paymentTerms: Joi.string(),
  minQuantity: Joi.string().required(),
  qualityConditions: Joi.string(),
  price: Joi.string().required(),
  discounts: Joi.number(),
  timeLine: Joi.array().items(Joi.object()),
  notes: Joi.string(),
  supplyLocation: Joi.string(),
  shippingSize: Joi.string(),
  deadline: Joi.date(),
  formCode: Joi.string(),
};

const extendedSchema = (additionalFields) =>
  Joi.object({
    ...baseQuotationSchema,
    ...additionalFields,
  }).required();

export const addQuotationValidationRFQ = extendedSchema({
  productId: Joi.number(),
  quotationId: Joi.number().required(),
});

export const addQuotationValidationSourcingRequest = extendedSchema({
  sourcingRequestId: Joi.number().required(),
});

export const addQuotationValidationPrivateLabel = extendedSchema({
  privateLabelingId: Joi.number().required(),
});

export const addQuotationValidationSpmf = extendedSchema({
  specialManufacturingRequestId: Joi.number().required(),
});

export const updateQuotationValidation = Joi.object({
  productName: Joi.string(),
  id: Joi.number().required(),
  quantity: Joi.string().required(),
  shippingConditions: Joi.string(),
  packingConditions: Joi.string(),
  paymentTerms: Joi.string(),
  minQuantity: Joi.string().required(),
  qualityConditions: Joi.string(),
  price: Joi.string(),
  // price: Joi.string().required(),
  discounts: Joi.number(),
  timeLine: Joi.array().items(Joi.object()),
  notes: Joi.string(),
  supplyLocation: Joi.string(),
  shippingSize: Joi.string(),
  deadline: Joi.date(),
  formCode: Joi.string(),
  status: Joi.string(),
}).required();

export const getQuotationsValidation = Joi.object({
  include: Joi.string().valid(
    "factory",
    "sourcingRequest",
    "importer",
    "privateLabeling",
    "specialManufacturingRequest",
    "quotationRequest"
  ),
  id: Joi.number(),
});
