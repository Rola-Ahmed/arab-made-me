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
    checkQuotationDataSpmf, checkQuotationDataWhiteLabeling, checkQuotationForFactory
} from "./quotations.middelwares.js";


export const quotationsRouter = Router()

const fields = [
    { name: 'docs', maxCount: 3 },
]
const fields2 = [{ name: 'docs', maxCount: 1 }]
const types = {
    docs: 'file',
}

quotationsRouter.post(
    "/add/rfq",
    checkUserToken,
    checkUserHasFactory,
    checkFactoryVerified,
    appValidator(validationSchemas.addQuotationValidationRFQ),
    checkQuotationDataRFQ,
    quotationsController.addQuotation)

quotationsRouter.post(
    "/add/sourcingRequest",
    checkUserToken,
    checkUserHasFactory,
    checkFactoryVerified,
    appValidator(validationSchemas.addQuotationValidationSourcingRequest),
    checkQuotationDataSourcingRequest,
    quotationsController.addQuotation)


quotationsRouter.post(
    "/add/privateLabel",
    checkUserToken,
    checkUserHasFactory,
    checkFactoryVerified,
    appValidator(validationSchemas.addQuotationValidationPrivateLabel),
    checkQuotationDataPrivateLabel,
    quotationsController.addQuotation)


    quotationsRouter.post(
        "/add/whiteLabel",
        checkUserToken,
        checkUserHasFactory,
        checkFactoryVerified,
        appValidator(validationSchemas.addQuotationValidationWhiteLabel),
        checkQuotationDataWhiteLabeling,
        quotationsController.addQuotation)



quotationsRouter.post(
    "/add/spmf",
    checkUserToken,
    checkUserHasFactory,
    checkFactoryVerified,
    appValidator(validationSchemas.addQuotationValidationSpmf),
    checkQuotationDataSpmf,
    quotationsController.addQuotation)



quotationsRouter.put("/uploadMedia/:id", checkUserToken, checkUserHasFactory, checkQuotationForFactory, multerUploader('quotations', types).fields(fields), quotationsController.uploadMedia)

quotationsRouter.patch("/updateMedia/:id", checkUserToken, checkUserHasFactory, checkQuotationForFactory, multerUploader('quotations', types).fields(fields2), quotationsController.updateOneFile)

quotationsRouter.put("/:id", checkUserToken, checkUserHasFactory, checkQuotationForFactory, appValidator(validationSchemas.updateQuotationValidation), quotationsController.updateQuotation)

quotationsRouter.get("/:id",quotationsController.getQuotation)
//, appValidator(validationSchemas.getQuotationsValidation)
quotationsRouter.get("",quotationsController.getQuotations)

quotationsRouter.get("/byFormId",quotationsController.getQuotationByFormId)

quotationsRouter.delete("/:id", checkUserToken, checkUserHasFactory, checkQuotationForFactory, quotationsController.deleteQutoation)

quotationsRouter.delete("/fromAdmin/:id", checkUserToken, allowedTo(['admin']), quotationsController.deleteQutoationFromAdmin)

