import { Router } from "express";
import * as controller from "./contactUs.controller.js"
import { checkUserToken } from "../../middelwares/chcek_user_token.js";
import { allowedTo } from "../../middelwares/authorization.js";
import { appValidator } from "../../middelwares/app.validation.js";
import * as validations from "./contactUs.validation.js"
export const contactUsRouter=Router()

contactUsRouter.post("/add",appValidator(validations.addContactUsValidation),controller.addContactUs)

contactUsRouter.get("/",controller.getContactUss)


contactUsRouter.get("/:id",controller.getContactUs)


contactUsRouter.delete("/:id",checkUserToken,allowedTo(['admin']),controller.deleteContactUs)