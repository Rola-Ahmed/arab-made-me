import {Router} from "express"
import {checkUserToken} from "../../middelwares/chcek_user_token.js"
import {appValidator} from "../../middelwares/app.validation.js"
import * as controller from "./chatting.controller.js"
import * as validations from "./chatting.validation.js"
import { checkMessageInChatForUser, checkUserIsPaticipentInChat } from "./chatting.middelwares.js"
import { allowedTo } from "../../middelwares/authorization.js"
export const chatRouter=Router()

chatRouter.post("/add",checkUserToken,appValidator(validations.addChatValidation),controller.addChatOrMessage)

chatRouter.put("/:id/message",checkUserToken,appValidator(validations.updateMessageInChat),
checkMessageInChatForUser,controller.updateMessage)

chatRouter.delete("/:id/message",checkUserToken,
appValidator(validations.deleteMessageInChat),
controller.deleteMessage
)


chatRouter.get("/",checkUserToken,allowedTo(['admin']),controller.getAllChats)

chatRouter.get("/:id",checkUserToken,checkUserIsPaticipentInChat,controller.getOneChat)

chatRouter.get("/user/chats",checkUserToken,controller.getAllChatsForUser)

chatRouter.get("/twoUsers",controller.getChatsForTwoUsers)