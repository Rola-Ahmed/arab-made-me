import Joi from "joi";

export const addFactorySchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().min(10).required(),
  whyUs: Joi.string(),
  repName: Joi.array().items(Joi.string().max(50).trim()).optional(),
  // repName:Joi.string().required(),
  repEmail: Joi.string().email(),
  repPhone: Joi.string(),
  sectorId:Joi.number().integer().required(),
  address: Joi.array().items(Joi.string()).optional(),
  importingCountries: Joi.array().items(Joi.string()).optional(),
  commercialRegisterationNumber: Joi.number().integer().optional(),
  taxRegisterationNumber: Joi.number().integer().optional(),
  directorName: Joi.string().optional(),
  directorEmail: Joi.string().email().optional(),
  directorPhone: Joi.string().optional(),
  numberOfProductonLines: Joi.number().integer().optional(),
  numberOfEmployees: Joi.string().optional(),
  qualityCertificates: Joi.array().items(Joi.string()).optional(),
  testLaboratory: Joi.boolean().optional(),
  researchAndDevelopmentSection: Joi.boolean().optional(),
  acceptManufacturingForOthers: Joi.boolean().optional(),
  acceptSpecialOrders: Joi.boolean().optional(),
  acceptManufacturingForSpecialBrands: Joi.boolean().optional(),
  acceptPaymentWithArabCurriencies: Joi.boolean().optional(),
  yearOfEstablishmint: Joi.string(),
  yearlySalesIncome: Joi.string(),
  phone: Joi.string(),
  website: Joi.string().uri(),
  country: Joi.string().required(),
  city: Joi.string(),
  subscriptionId: Joi.number().integer(),
  // team:Joi.array().items(Joi.object({
  //   name:Joi.string().required(),
  //   role:Joi.string().required(),
  //   email:Joi.string().email()
  // })),
  socialLinks: Joi.object({
    facebook: Joi.string().uri(),
    linkedin: Joi.string().uri(),
    email: Joi.string().email(),
    instagram:Joi.string().uri(),
    whatsapp:Joi.string()
  }),
  allowEmailNotification:Joi.boolean(),
  IndustrialRegistrationNumber:Joi.number(),
  IndustrialLicenseNumber:Joi.number()
}).required()

export const updateFactorySchema = Joi.object({
  id: Joi.number(),
  name: Joi.string().trim().optional(),
  description: Joi.string().min(10).optional(),
  whyUs: Joi.string(),
  repName: Joi.array().items(Joi.string().max(50).trim()).optional(),
  // repName:Joi.string().required(),
  repEmail: Joi.string().email().optional(),
  repPhone: Joi.string().optional(),
  address: Joi.array().items(Joi.string()).optional(),
  importingCountries: Joi.array().items(Joi.string()).optional(),
  commercialRegisterationNumber: Joi.number().integer().optional(),
  taxRegisterationNumber: Joi.number().integer().optional(),
  directorName: Joi.string().optional(),
  directorEmail: Joi.string().email().optional(),
  directorPhone: Joi.string().optional(),
  numberOfProductonLines: Joi.number().integer().optional(),
  numberOfEmployees: Joi.string().optional(),
  qualityCertificates: Joi.array().items(Joi.string()).optional(),
  testLaboratory: Joi.boolean().optional(),
  researchAndDevelopmentSection: Joi.boolean().optional(),
  acceptManufacturingForOthers: Joi.boolean().optional(),
  acceptSpecialOrders: Joi.boolean().optional(),
  acceptManufacturingForSpecialBrands: Joi.boolean().optional(),
  acceptPaymentWithArabCurriencies: Joi.boolean().optional(),
  yearOfEstablishmint: Joi.string(),
  yearlySalesIncome: Joi.string(),
  phone: Joi.string(),
  website: Joi.string().uri(),
  country: Joi.string(),
  city: Joi.string(),
  subscriptionId: Joi.number().integer(),
  // team:Joi.array().items(Joi.object({
  //   name:Joi.string().required(),
  //   role:Joi.string().required(),
  //   email:Joi.string().email()
  // })),
  socialLinks: Joi.object({
    facebook: Joi.string().uri(),
    linkedin: Joi.string().uri(),
    email: Joi.string().email(),
    instagram:Joi.string().uri(),
    whatsapp:Joi.string()
  }),
  allowEmailNotification:Joi.boolean(),
  IndustrialRegistrationNumber:Joi.number(),
  IndustrialLicenseNumber:Joi.number()
});

export const verfiyFactorySchema = Joi.object({
  taxRegisterationNumber: Joi.number().required,
  commercialRegisterationNumber: Joi.number().required(),
}).required()