import Joi from "joi";

export const addTeamMemberValidation=Joi.object({
    name:Joi.string().required(),
    role:Joi.string().required()
}).required()


export const updateTeamMemberValidation=Joi.object({
    id:Joi.number().required(),
    name:Joi.string(),
    role:Joi.string()
}).required()