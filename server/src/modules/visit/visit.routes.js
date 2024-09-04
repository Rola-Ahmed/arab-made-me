import { Router } from "express";
import * as controller from "./visit.controller.js"
import * as validationSchemas from "./visit.validation.js"
import { checkImporterVerified, checkUserIsImporter } from "../importers/importers.middelwares.js";
import { checkUserToken } from "../../middelwares/chcek_user_token.js"
import { appValidator } from "../../middelwares/app.validation.js"
import { allowedTo } from "../../middelwares/authorization.js";
import { checkVisitForFactory, checkVisitForImporter } from "./visit.middelwares.js";
import { checkUserHasFactory } from "../factories/factories.middelwares.js";
export const visitRouter = Router()


visitRouter.post(
    "/add", checkUserToken, checkUserIsImporter, checkImporterVerified,
    appValidator(validationSchemas.addVisitValidation),
    controller.addVisit
)


visitRouter.get("", controller.getVisits)

visitRouter.get("/:id", controller.getVisit)

visitRouter.delete("/:id", checkUserToken, checkUserIsImporter, checkVisitForImporter, controller.deleteVisit)

visitRouter.delete("/formAdmin/:id", checkUserToken, allowedTo(['admin']), controller.deleteVisitFromAdmin)

visitRouter.put("/:id", checkUserToken, checkUserIsImporter,
    checkVisitForImporter,
    appValidator(validationSchemas.updateVisitValidation),
    controller.updateVisit)


    visitRouter.put("/factroy/:id", checkUserToken, checkUserHasFactory,
    checkVisitForFactory,
    appValidator(validationSchemas.updateVisitValidation),
    controller.updateVisit)

