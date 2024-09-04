import { Router } from "express";
import { checkUserHasFactory } from "../factories/factories.middelwares.js";
import { checkProductForFactory } from "../products/products.middelwares.js";
import * as rfqController from "./quotationRequests.controller.js"
import * as validationSchemas from "./quotationRequests.validation.js"
import { checkImporterVerified, checkUserIsImporter } from "../importers/importers.middelwares.js";
import {checkUserToken} from "../../middelwares/chcek_user_token.js"
import { multerUploader } from "../../utils/multer.js";
import {appValidator} from "../../middelwares/app.validation.js"
import multer from "multer";
import { checkQuotationRequestForFactroy, checkQuotationRequestForImporter } from "./quotationRequests.middelwares.js";
import { allowedTo } from "../../middelwares/authorization.js";
export const quotationRequestRouter=Router()

const fields=[
    {name:'docs',maxCount:3},
]
const types={
    docs:'file',
}

quotationRequestRouter.post(
    "/add",checkUserToken,checkUserIsImporter,checkImporterVerified,
    appValidator(validationSchemas.addQuotationRequestValidation),
    rfqController.addQuotationRequest
    )

 quotationRequestRouter.put("/uploadMedia/:id",checkUserToken,checkUserIsImporter,checkQuotationRequestForImporter,
 
 multerUploader('rfqs',types).fields(fields),
 rfqController.uploadMedia
 )   

    quotationRequestRouter.get("",rfqController.getQuotationRequests)

quotationRequestRouter.get("/:id",rfqController.getQuotationRequest)

quotationRequestRouter.delete("/:id",checkUserToken,checkUserIsImporter,checkQuotationRequestForImporter,rfqController.deleteQutoationRequest)

quotationRequestRouter.delete("/formAdmin/:id",checkUserToken,allowedTo(['admin']),rfqController.deleteQutoationRequestFromAdmin)

quotationRequestRouter.put("/:id",checkUserToken,checkUserIsImporter,checkQuotationRequestForImporter,
appValidator(validationSchemas.updateQuotationRequestValidation),
rfqController.updateQuotationRequest)

quotationRequestRouter.put("/factory/:id",checkUserToken,checkUserHasFactory,checkQuotationRequestForFactroy,
appValidator(validationSchemas.updateQuotationRequestValidation),
rfqController.updateQuotationRequest)

quotationRequestRouter.patch("/updateMedia/:id",checkUserToken,checkUserIsImporter,checkQuotationRequestForImporter,multerUploader('rfqs',types).fields([
    {name:'docs',maxCount:1}]),rfqController.updateOneFile
)
