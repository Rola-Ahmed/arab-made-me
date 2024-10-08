import Joi from "joi";

const string = Joi.string();
// const stringMin16 = Joi.string().min(16);
const stringMin16 = Joi.string();
const stringMin6 = Joi.string().min(6);
const arrayString = Joi.array().items(Joi.string());
const number = Joi.number();
const bool = Joi.boolean();
const object = Joi.object();

export const addProductValidation = Joi.object({
  name: string.required(),
  description: Joi.string().required(),
  // coverImage: string,
  hsnCode: stringMin6.optional().allow(null),
  // images: arrayString,
  price: string.required(),
  // available: bool,
  minOrderQuantity: string.required(),
  maxOrderQuantity: string,
  specialCharacteristics: object,
  guarantee: string,
  leadTime: string,
});

export const updateProductValidation = Joi.object({
  id: number,
  name: string,
  description: Joi.string(),
  // coverImage: string,
  hsnCode: stringMin6.optional().allow(null),
  // images: arrayString,
  price: string,
  available: bool,
  minOrderQuantity: number,
  maxOrderQuantity: number,
  specialCharacteristics: object,
  guarantee: string,
  averageRate: number,
  leadTime: string,
});
