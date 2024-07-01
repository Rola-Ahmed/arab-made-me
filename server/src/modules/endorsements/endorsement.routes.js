import { Router } from "express";
import * as controller from "./endorsement.controller.js"
import * as validationSchemas from "./endorsement.validation.js"
import { checkImporterVerified, checkUserIsImporter } from "../importers/importers.middelwares.js";
import { checkUserToken } from "../../middelwares/chcek_user_token.js"
import { appValidator } from "../../middelwares/app.validation.js"
import { allowedTo } from "../../middelwares/authorization.js";
import { checkEndorsementForImporter } from "./endorsement.middelwares.js";
export const endorsementRouter = Router()


endorsementRouter.post(
    "/add", checkUserToken, checkUserIsImporter, checkImporterVerified,
    appValidator(validationSchemas.addEndorsementValidation),
    controller.addEndorsement
)


endorsementRouter.get("", controller.getEndorsements)

endorsementRouter.get("/:id", controller.getEndorsement)

endorsementRouter.get("/factory/:id", controller.getEndorsementForFactory)

endorsementRouter.delete("/:id", checkUserToken, checkUserIsImporter, checkEndorsementForImporter, controller.deleteEndorsement)

endorsementRouter.delete("/formAdmin/:id", checkUserToken, allowedTo(['admin']), controller.deleteEndorsementFromAdmin)



