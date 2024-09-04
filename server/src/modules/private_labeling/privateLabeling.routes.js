import { Router } from "express";
import { checkProductForFactory, checkProductForFactoryWithIds } from "../products/products.middelwares.js";
import * as controller from "./privateLabeling.controller.js"
import * as validationSchemas from "./privateLabeling.validation.js"
import { checkImporterVerified, checkUserIsImporter } from "../importers/importers.middelwares.js";
import { checkUserToken } from "../../middelwares/chcek_user_token.js"
import { multerUploader } from "../../utils/multer.js";
import { appValidator } from "../../middelwares/app.validation.js"
import { allowedTo } from "../../middelwares/authorization.js";
import { checkPrivateLabelingForFactory, checkPrivateLabelingForImporter, checkProductForFactoryInPrivateLabeling } from "./privateLabeling.middelwares.js";
import { checkUserHasFactory } from "../factories/factories.middelwares.js";
export const privateLabelingRouter = Router()

const fields = [
    { name: 'docs', maxCount: 3 },
    {name:'tradeMark',maxCount:1}
]
const types = {
    docs: 'file',
    tradeMark:'file'
}

privateLabelingRouter.post(
    "/add", checkUserToken, checkUserIsImporter, checkImporterVerified,checkProductForFactoryWithIds,
    appValidator(validationSchemas.addPrivateLabelingValidationSchema),
    controller.addPrivateLabeling
)

privateLabelingRouter.put("/uploadMedia/:id", checkUserToken, checkUserIsImporter, checkPrivateLabelingForImporter,

    multerUploader('private_labelings', types).fields(fields),
    controller.uploadMedia
)

privateLabelingRouter.get("", controller.getPrivateLabelings)

privateLabelingRouter.get("/:id", controller.getPrivateLabeling)

privateLabelingRouter.delete("/:id", checkUserToken, checkUserIsImporter, checkPrivateLabelingForImporter, controller.deletePrivateLabeling)

privateLabelingRouter.delete("/formAdmin/:id", checkUserToken, allowedTo(['admin']), controller.deletePrivateLabelingFromAdmin)

privateLabelingRouter.put("/:id", checkUserToken, checkUserIsImporter,
    checkPrivateLabelingForImporter,
    appValidator(validationSchemas.updatePrivateLabelingValidationSchema),
    checkProductForFactoryInPrivateLabeling,
    controller.updatePrivateLabeling)

    privateLabelingRouter.put("/factory/:id", checkUserToken, checkUserHasFactory,
    checkPrivateLabelingForFactory,
    appValidator(validationSchemas.updatePrivateLabelingValidationSchema),
    checkProductForFactoryInPrivateLabeling,
    controller.updatePrivateLabeling)

    privateLabelingRouter.patch("/updateMedia/:id", checkUserToken, checkUserIsImporter, checkPrivateLabelingForImporter, multerUploader('rfqs', types).fields([
    { name: 'docs', maxCount: 1 }]), controller.updateOneFile
)
