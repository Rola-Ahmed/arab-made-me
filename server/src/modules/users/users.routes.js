import { Router } from "express";
import * as usersController from "./users.controller.js"
import * as usersValidationSchemas from "./users.validation.js"
import { appValidator } from "../../middelwares/app.validation.js";
import { allowedTo } from "../../middelwares/authorization.js";
import { checkUserToken } from "../../middelwares/chcek_user_token.js";
import { signInLimiter } from "./users.middelwares.js";
import { sendingEmailLimit } from "../../middelwares/sendin_email_limit.js";
export const usersRouter=Router()

usersRouter.post("/signup",signInLimiter,appValidator(usersValidationSchemas.addUserSchema),usersController.signup)

//signInLimiter
usersRouter.post("/signin",signInLimiter,usersController.signin)

usersRouter.get("/",usersController.getUsers)



usersRouter.get("/:id",usersController.getUserData)

usersRouter.get("/confirmEmail/:token",usersController.confirmEmail)

//sendingEmailLimit
usersRouter.get("/resendConfirmationMail/:id",usersController.resendConfirmationMail)

usersRouter.put("/update/fromUser",checkUserToken,
appValidator(usersValidationSchemas.updateUserValidation),usersController.updateUser)

usersRouter.put("/update/fromAdmin/:id",checkUserToken,allowedTo(['admin'])
,appValidator(usersValidationSchemas.updateFromAdminValidation),usersController.updateFromAdmin)

usersRouter.delete("/delete/fromAdmin/:id",checkUserToken,allowedTo(['admin']),usersController.deleteUserFromAdmin)

usersRouter.delete("/delete/fromUser",checkUserToken,usersController.deleteUserFromProfile)

usersRouter.delete("/delete/unActiveUsers",checkUserToken,allowedTo(['admin']),usersController.cleanUnActive)

usersRouter.post("/forgetPassword",sendingEmailLimit,usersController.forgetPassword)

usersRouter.patch("/resetPassword/:token",usersController.resetPassword)

usersRouter.patch("/logout",checkUserToken,usersController.logoutUser)

usersRouter.post("/createAdmin",checkUserToken,allowedTo(['admin']),usersController.createAdmin)