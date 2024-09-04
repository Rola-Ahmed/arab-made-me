import { Router } from "express";
import { checkFactoryVerified, checkUserHasFactory } from "../../factories/factories.middelwares.js";
import * as quotationsController from "./quotations.controller.js"
import * as validationSchemas from "./quotations.validation.js"
import {appValidator} from "../../../middelwares//app.validation.js"
import {checkUserToken} from "../../../middelwares/chcek_user_token.js"
import {allowedTo} from "../../../middelwares/authorization.js"
import { multerUploader } from "../../../utils/multer.js";
import { checkSourcingQuotationForFactory } from "./quotations.middelwares.js";
export const sourcingQuotationsRouter=Router()

const fields=[
    {name:'docs',maxCount:3},
]
const fields2=[{name:'docs',maxCount:1}]
const types={
    docs:'file',
}

sourcingQuotationsRouter.post(
    "/add",checkUserToken,checkUserHasFactory,checkFactoryVerified,appValidator(validationSchemas.addSourcingQuotationValidation),quotationsController.addQuotation)



sourcingQuotationsRouter.put("/uploadMedia/:id",checkUserToken,checkUserHasFactory,checkSourcingQuotationForFactory,multerUploader('quotations',types).fields(fields),quotationsController.uploadMedia)

sourcingQuotationsRouter.patch("/updateMedia/:id",checkUserToken,checkUserHasFactory,checkSourcingQuotationForFactory,multerUploader('quotations',types).fields(fields2),quotationsController.updateOneFile)

sourcingQuotationsRouter.put("/:id",checkUserToken,checkUserHasFactory,checkSourcingQuotationForFactory,appValidator(validationSchemas.updateSourcingQuotationValidation),quotationsController.updateQuotation)

sourcingQuotationsRouter.get("/:id",quotationsController.getQuotation)

sourcingQuotationsRouter.get("",quotationsController.getQuotations)

sourcingQuotationsRouter.delete("/:id",checkUserToken,checkUserHasFactory,checkSourcingQuotationForFactory,quotationsController.deleteQutoation)

sourcingQuotationsRouter.delete("/fromAdmin/:id",checkUserToken,allowedTo(['admin']),quotationsController.deleteQutoationFromAdmin)

