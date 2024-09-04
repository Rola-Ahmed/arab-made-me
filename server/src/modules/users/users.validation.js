import Joi from "joi";

export const addUserSchema=Joi.object({
    // firstName:Joi.string().min(1).max(25).required(),
    // lastName:Joi.string().min(1).max(25).required(),
    email:Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp("^(?=.{6,})")).required(),//RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})")).required(),
    // phone:Joi.string()
    
}).required()

export const updateUserValidation = Joi.object({
    name: Joi.array().items(Joi.string()),
    //email: Joi.string().email(),
    password: Joi.string().min(6),
    oldPassword:Joi.string().min(6),
    phone: Joi.string(),
    language: Joi.string().valid('english', 'arabic', 'german', 'french'),
    logout: Joi.boolean(),
    socketId: Joi.string(),
})

export const updateFromAdminValidation= Joi.object({
    id: Joi.number().integer().positive().required(),
    name: Joi.array().items(Joi.string()),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    phone: Joi.string(),
    language: Joi.string().valid('english', 'arabic', 'german', 'french'),
    emailActivated: Joi.boolean(),
    role: Joi.string().valid('admin', 'importer', 'factory', 'user'),
    importerId: Joi.number().integer().optional(),
    factoryId: Joi.number().integer().optional(),
    logout: Joi.boolean(),
    socketId: Joi.string(),
  });