import Joi from "joi";

export const addImporterSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().min(10).required(),
    repName: Joi.string(),
    repEmail: Joi.string().email(),
    repPhone: Joi.string(),
    address: Joi.array().items(Joi.string()),
    exportingCountries: Joi.array().items(Joi.string()),
    commercialRegisterationNumber: Joi.string(),
    sectorId: Joi.number().integer(),
    yearOfEstablishment: Joi.number().integer(),
    website: Joi.string().uri(),
    country: Joi.string().required(),
    city: Joi.string(),
    allowEmailNotification:Joi.boolean(),
    socialLinks: Joi.object({
        facebook: Joi.string().uri(),
        linkedin: Joi.string().uri(),
        instagram: Joi.string().uri()
    }),
}).required()

export const updateImporterValidation = Joi.object({
    id:Joi.number(),
    name: Joi.string(),
    description: Joi.string().min(10),
    repName: Joi.string(),
    repEmail: Joi.string().email(),
    repPhone: Joi.string(),
    address: Joi.array().items(Joi.string()),
    exportingCountries: Joi.array().items(Joi.string()),
    commercialRegisterationNumber: Joi.string(),
    sectorId: Joi.number().integer(),
    yearOfEstablishment: Joi.number().integer(),
    website: Joi.string().uri(),
    country: Joi.string(),
    city: Joi.string(),
    allowEmailNotification:Joi.boolean(),
    socialLinks: Joi.object({
        facebook: Joi.string().uri(),
        linkedin: Joi.string().uri(),
        instagram: Joi.string().uri()
    }),
});

export const updateImporterValidationAdmin = Joi.object({
    id:Joi.number(),
    name: Joi.string(),
    description: Joi.string().min(10),
    repName: Joi.string(),
    repEmail: Joi.string().email(),
    repPhone: Joi.string(),
    address: Joi.array().items(Joi.string()),
    exportingCountries: Joi.array().items(Joi.string()),
    commercialRegisterationNumber: Joi.string(),
    emailActivated:Joi.boolean(),
    verified:Joi.number().valid(0,1),
    sectorId: Joi.number().integer(),
    yearOfEstablishment: Joi.number().integer(),
    website: Joi.string().uri(),
    country: Joi.string(),
    city: Joi.string(),
    allowEmailNotification:Joi.boolean(),
    socialLinks: Joi.object({
        facebook: Joi.string().uri(),
        linkedin: Joi.string().uri(),
        instagram: Joi.string().uri()
    }),
});

