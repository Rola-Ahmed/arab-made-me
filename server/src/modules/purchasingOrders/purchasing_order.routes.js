import { Router } from "express";

import * as poController from "./purchasing_order.controller.js"
import * as validationSchemas from "./purchasing_orders.validation.js"
import { checkImporterVerified, checkUserIsImporter } from "../importers/importers.middelwares.js";
import { appValidator } from "../../middelwares/app.validation.js"
import { checkUserToken } from "../../middelwares/chcek_user_token.js"
import { allowedTo } from "../../middelwares/authorization.js"
import { multerUploader } from "../../utils/multer.js";

import {
    checkPODataProduct, checkPODataQutoation, checkPODataSourcingOffer, checkPurchasingOrderForFactroy, checkPurchasingOrderForImporter
} from "./purchasing_order.middelwares.js";
import { checkUserHasFactory } from "../factories/factories.middelwares.js";
export const purchasingOrderRouter = Router()

const fields = [
    { name: 'docs', maxCount: 3 },
]
const fields2 = [{ name: 'docs', maxCount: 1 }]
const types = {
    docs: 'file',
}

purchasingOrderRouter.post(
    "/add/product",
    checkUserToken,
    checkUserIsImporter,
    checkImporterVerified,
    appValidator(validationSchemas.addPurchasingOrderValidationSchemaProduct),
    checkPODataProduct,
    poController.addPurchasingOrder)


purchasingOrderRouter.post(
    "/add/sourcingOffer",
    checkUserToken,
    checkUserIsImporter,
    checkImporterVerified,
    appValidator(validationSchemas.addPurchasingOrderValidationSchemaSourcingOffer),
    checkPODataSourcingOffer,
    poController.addPurchasingOrder)

purchasingOrderRouter.post(
    "/add/quotation",
    checkUserToken,
    checkUserIsImporter,
    checkImporterVerified,
    appValidator(validationSchemas.addPurchasingOrderValidationSchemaQuotation),
    checkPODataQutoation,
    poController.addPurchasingOrder)



purchasingOrderRouter.put("/uploadMedia/:id", checkUserToken, checkUserIsImporter, checkPurchasingOrderForImporter, multerUploader('POs', types).fields(fields), poController.uploadMedia)

purchasingOrderRouter.patch("/updateMedia/:id", checkUserToken, checkUserIsImporter, checkPurchasingOrderForImporter, multerUploader('POs', types).fields(fields2), poController.updateOneFile)

purchasingOrderRouter.put(
    "/:id", checkUserToken, checkUserIsImporter, checkPurchasingOrderForImporter
    , appValidator(validationSchemas.updatePurchasingOrderValidationSchema),
    poController.updatePurchasingOrder)

    purchasingOrderRouter.put(
        "/factory/:id", checkUserToken, checkUserHasFactory, checkPurchasingOrderForFactroy
        , appValidator(validationSchemas.updatePurchasingOrderValidationSchema),
        poController.updatePurchasingOrder)

//, appValidator(validationSchemas.getPOsValidation)
purchasingOrderRouter.get("/:id", poController.getPurchasingOrder)
//, appValidator(validationSchemas.getPOsValidation)
purchasingOrderRouter.get("", poController.geturchasingOrders)

purchasingOrderRouter.delete("/:id", checkUserToken, checkUserIsImporter, checkPurchasingOrderForImporter, poController.deletePurchasingOrder)

purchasingOrderRouter.delete("/fromAdmin/:id", checkUserToken, allowedTo(['admin']), poController.deletePurchasingOrderFromAdmin)

