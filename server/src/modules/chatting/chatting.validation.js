import Joi from "joi"
export const addChatValidation = Joi.object(
    {
        messageObj: Joi.object({
            reciever: Joi.number().required(),
            message: Joi.string().required(),
            status: Joi.string().valid('pending').required()
        }).required()
    }
).required()

export const updateMessageInChat = Joi.object({
    id: Joi.number().integer().required(),
    messageIndex:Joi.number().integer().required(),
    messageObj: Joi.object({
        reciever:Joi.number().integer().required(),
        message: Joi.string().required(),
        status: Joi.string().valid('pending','seen').required()
    }).required()
}).required()

export const deleteMessageInChat= Joi.object({
    id:Joi.number().integer().required(),
    messageIndex:Joi.number().integer().required()
}).required()

export const addMessageInChat = Joi.object({
    id: Joi.number().integer().required(),
    messageObj: Joi.object({
        reciever: Joi.number().required(),
        message: Joi.string().required(),
        status: Joi.string().valid('pending').required()
    }).required()
}).required()