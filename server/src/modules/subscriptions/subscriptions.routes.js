import { Router } from "express";
import * as controller from "./subscriptions.controller.js"
import { checkUserToken } from "../../middelwares/chcek_user_token.js";
import { allowedTo } from "../../middelwares/authorization.js";
import * as validations from "./subscription.validation.js"
import { appValidator } from "../../middelwares/app.validation.js";
export const subscriptionsRouter=Router()

subscriptionsRouter.post("/add",checkUserToken,allowedTo(['admin']),appValidator(validations.addSubscriptionValidationSchema),controller.addSubscription)

subscriptionsRouter.get("/",controller.getSubscriptions)

subscriptionsRouter.get("/:id",controller.getSubscription)

subscriptionsRouter.put("/update/:id",checkUserToken,allowedTo(['admin']),appValidator(validations.updateSubscriptionValidationSchema),controller.updateSubscription)

subscriptionsRouter.delete("/:id",checkUserToken,allowedTo(['admin']),controller.deleteSubscription)