import { Router } from "express";
import { checkFactoryVerified, checkUserHasFactory } from "../factories/factories.middelwares.js";
import * as quotationsController from "./quotations.controller.js"
import * as validationSchemas from "./quotations.validation.js"
import { appValidator } from "../../middelwares/app.validation.js"
import { checkUserToken } from "../../middelwares/chcek_user_token.js"
import { allowedTo } from "../../middelwares/authorization.js"
import { multerUploader } from "../../utils/multer.js";
import {
    checkQuotationDataPrivateLabel, checkQuotationDataRFQ, checkQuotationDataSourcingRequest,
    checkQuotationDataSpmf, checkQuotationForFactory,
    checkQuotationUpdatesForFactory
} from "./quotations.middelwares.js";


export const quotationsUpdatesRouter = Router()

const fields = [
    { name: 'docs', maxCount: 3 },
]
const fields2 = [{ name: 'docs', maxCount: 1 }]
const types = {
    docs: 'file',
}

quotationsUpdatesRouter.post(
    "/add/",
    checkUserToken,
    checkUserHasFactory,
    checkFactoryVerified,
    appValidator(validationSchemas.addQuotationValidationRFQ),
    checkQuotationForFactory,
    quotationsController.addQuotation)





quotationsUpdatesRouter.put("/uploadMedia/:id", checkUserToken, checkUserHasFactory, checkQuotationUpdatesForFactory, multerUploader('quotations', types).fields(fields), quotationsController.uploadMedia)

quotationsUpdatesRouter.patch("/updateMedia/:id", checkUserToken, checkUserHasFactory, checkQuotationUpdatesForFactory, multerUploader('quotations', types).fields(fields2), quotationsController.updateOneFile)



quotationsUpdatesRouter.get("/:id", quotationsController.getQuotation)

quotationsUpdatesRouter.get("", quotationsController.getQuotations)

quotationsUpdatesRouter.get("/forQuote/:id", quotationsController.getQuotationsUpdatesofQuote)


quotationsUpdatesRouter.delete("/:id", checkUserToken, checkUserHasFactory, checkQuotationUpdatesForFactory, quotationsController.deleteQutoation)

quotationsUpdatesRouter.delete("/fromAdmin/:id", checkUserToken, allowedTo(['admin']), quotationsController.deleteQutoationFromAdmin)

