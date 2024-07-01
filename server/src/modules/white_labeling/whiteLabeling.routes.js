import { Router } from "express";
import { checkProductForFactory, checkProductForFactoryWithIds } from "../products/products.middelwares.js";
import * as controller from "./whiteLabeling.controller.js"
import * as validationSchemas from "./whiteLabeling.validation.js"
import { checkImporterVerified, checkUserIsImporter } from "../importers/importers.middelwares.js";
import { checkUserToken } from "../../middelwares/chcek_user_token.js"
import { multerUploader } from "../../utils/multer.js";
import { appValidator } from "../../middelwares/app.validation.js"
import { allowedTo } from "../../middelwares/authorization.js";
import { checkWhiteLabelingForFactory, checkWhiteLabelingForImporter, checkProductForFactoryInWhiteLabeling } from "./whiteLabeling.middelwares.js";
import { checkUserHasFactory } from "../factories/factories.middelwares.js";
export const whiteLabelingsRouter = Router()

const fields = [
    { name: 'docs', maxCount: 3 },
]
const types = {
    docs: 'file',
}

whiteLabelingsRouter.post(
    "/add", checkUserToken, checkUserIsImporter, checkImporterVerified,checkProductForFactoryWithIds,
    appValidator(validationSchemas.addWhiteLabelingValidationSchema),
    controller.addWhiteLabeling
)

whiteLabelingsRouter.put("/uploadMedia/:id", checkUserToken, checkUserIsImporter, checkWhiteLabelingForImporter,

    multerUploader('white_labelings', types).fields(fields),
    controller.uploadMedia
)

whiteLabelingsRouter.get("/", controller.getWhiteLabelings)

whiteLabelingsRouter.get("/:id", controller.getWhiteLabeling)

whiteLabelingsRouter.delete("/:id", checkUserToken, checkUserIsImporter, checkWhiteLabelingForImporter, controller.deleteWhiteLabeling)

whiteLabelingsRouter.delete("/formAdmin/:id", checkUserToken, allowedTo(['admin']), controller.deleteWhiteLabelingFromAdmin)

whiteLabelingsRouter.put("/:id", checkUserToken, checkUserIsImporter,
    checkWhiteLabelingForImporter,
    appValidator(validationSchemas.updateWhiteLabelingValidationSchema),
    checkProductForFactoryInWhiteLabeling,
    controller.updateWhiteLabeling)

    whiteLabelingsRouter.put("/factory/:id", checkUserToken, checkUserHasFactory,
    checkWhiteLabelingForFactory,
    appValidator(validationSchemas.updateWhiteLabelingValidationSchema),
    checkProductForFactoryInWhiteLabeling,
    controller.updateWhiteLabeling)

    whiteLabelingsRouter.patch("/updateMedia/:id", checkUserToken, checkUserIsImporter, checkWhiteLabelingForImporter, multerUploader('rfqs', types).fields([
    { name: 'docs', maxCount: 1 }]), controller.updateOneFile
)
