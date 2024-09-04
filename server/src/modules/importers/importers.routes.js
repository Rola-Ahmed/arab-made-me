import { Router } from "express";
import * as importersController from "./importers.controller.js"
import * as importersValidationSchemas from "./importers.validation.js"
import {checkUserToken} from "../../middelwares/chcek_user_token.js"
import { appValidator } from "../../middelwares/app.validation.js";
import { allowedTo } from "../../middelwares/authorization.js";
import { checkImporterVerified, checkUserIsImporter } from "./importers.middelwares.js";
import { multerUploader } from "../../utils/multer.js";
import { checkMediaLength } from "../../middelwares/media_length.js";
import { notForAdmin } from "../../middelwares/not_for_admin.js";
import { sendingEmailLimit } from "../../middelwares/sendin_email_limit.js";
export const importersRouter=Router()

importersRouter.post("/add",checkUserToken,notForAdmin,appValidator(importersValidationSchemas.addImporterSchema),importersController.addImporter)

importersRouter.get("/confirmEmail/:token",importersController.confirmEmail)
importersRouter.get("/resendConfirmationMail/:id",sendingEmailLimit,importersController.resendConfirmationMail)

importersRouter.get("/",importersController.getImporters)


//importersRouter.put("/verify",checkUserToken,checkUserIsImporter,appValidator(importersValidationSchemas.verfiyFactorySchema),importersController.verfiyFactory)



importersRouter.get("/:id",importersController.getImporterData)



importersRouter.put("/update/fromUser",checkUserToken,checkUserIsImporter
,appValidator(importersValidationSchemas.updateImporterValidation),
importersController.updateImporter)

importersRouter.put("/update/fromAdmin/:id",checkUserToken,allowedTo(['admin']),
appValidator(importersValidationSchemas.updateImporterValidationAdmin),
importersController.updateFromAdmin)


importersRouter.put("/verify/:id",checkUserToken,allowedTo(['admin']),importersController.verfiyImporter)

importersRouter.delete("/delete/fromAdmin/:id",checkUserToken,allowedTo(['admin']),importersController.deleteImporterFromAdmin)

importersRouter.delete("/delete/fromUser",checkUserToken,checkUserIsImporter,importersController.deleteImporterFromProfile)


const fields=[
    {name:'image',maxCount:1},
    {name:'legalDocs',maxCount:5}
]
const types={
    image:'image',
    legalDocs:'file'
}
importersRouter.put(
    "/media",checkUserToken,checkUserIsImporter,
    multerUploader(`importers`,types).fields(fields),importersController.addMedia
)

const fields2=[
    {name:'legalDocs',maxCount:1}
]
const types2={
    legalDocs:'file'
}
importersRouter.patch(
    "/update/legalDoc",checkUserToken,checkUserIsImporter,
    multerUploader(`importers`,types2).fields(fields2),importersController.updateOneLegalDoc
)


importersRouter.get("/importer/pos",checkUserToken,checkUserIsImporter,checkImporterVerified,
importersController.getPos
)

importersRouter.get("/importer/rfqs",checkUserToken,checkUserIsImporter,checkImporterVerified,
importersController.getRFQs
)

importersRouter.get("/importer/quotations",checkUserToken,checkUserIsImporter,checkImporterVerified,
importersController.getQuotations
)

importersRouter.get("/importer/privateLabelings",checkUserToken,checkUserIsImporter,checkImporterVerified,
importersController.getPrivateLabelings
)


importersRouter.get("/importer/spmfs",checkUserToken,checkUserIsImporter,checkImporterVerified,
importersController.getSPMF
)

importersRouter.get("/importer/sourcingRequests",checkUserToken,checkUserIsImporter,checkImporterVerified,
importersController.getSourcingRequest
)

importersRouter.get("/importer/visits",checkUserToken,checkUserIsImporter,checkImporterVerified,
importersController.getVisits
)

