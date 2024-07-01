import { Router } from "express";
import * as controller from "./specialManufacturingRequests.controller.js"
import * as validationSchemas from "./specialManufacturingRequests.validation.js"
import { checkImporterVerified, checkUserIsImporter } from "../importers/importers.middelwares.js";
import { checkUserToken } from "../../middelwares/chcek_user_token.js"
import { multerUploader } from "../../utils/multer.js";
import { appValidator } from "../../middelwares/app.validation.js"

import { allowedTo } from "../../middelwares/authorization.js";
import { checkSpecialManufacturingRequestForFactory, checkSpecialManufacturingRequestForImporter } from "./specialMnufacturingRequests.middelwares.js";
import { checkUserHasFactory } from "../factories/factories.middelwares.js";
export const specialManufacturingRequestRouter = Router()

const fields = [
    { name: 'docs', maxCount: 3 },
]
const types = {
    docs: 'file',
}

specialManufacturingRequestRouter.post(
    "/add", checkUserToken, checkUserIsImporter, checkImporterVerified,
    appValidator(validationSchemas.addSpecialManufacturingRequestValidationSchema),
    controller.addSpecialManufacturingRequest
)

specialManufacturingRequestRouter.put("/uploadMedia/:id", checkUserToken, checkUserIsImporter, checkSpecialManufacturingRequestForImporter,

    multerUploader('spmfs', types).fields(fields),
    controller.uploadMedia
)

specialManufacturingRequestRouter.get("", controller.getSpecialManufacturingRequests)

specialManufacturingRequestRouter.get("/:id", controller.getSpecialManufacturingRequest)

specialManufacturingRequestRouter.delete("/:id", checkUserToken, checkUserIsImporter, checkSpecialManufacturingRequestForImporter, controller.deleteSpecialManufacturingRequest)

specialManufacturingRequestRouter.delete("/formAdmin/:id", checkUserToken, allowedTo(['admin']), controller.deleteSpecialManufacturingRequestFromAdmin)

specialManufacturingRequestRouter.put("/:id", checkUserToken, checkUserIsImporter,
    checkSpecialManufacturingRequestForImporter,
    appValidator(validationSchemas.updateSpecialManufacturingRequestValidationSchema),
    controller.updateSpecialManufacturingRequest)

    specialManufacturingRequestRouter.put("/factory/:id", checkUserToken, checkUserHasFactory,
    checkSpecialManufacturingRequestForFactory,
    appValidator(validationSchemas.updateSpecialManufacturingRequestValidationSchema),
    controller.updateSpecialManufacturingRequest)

specialManufacturingRequestRouter.patch("/updateMedia/:id", checkUserToken, checkUserIsImporter, checkSpecialManufacturingRequestForImporter, multerUploader('rfqs', types).fields([
    { name: 'docs', maxCount: 1 }]), controller.updateOneFile
)
