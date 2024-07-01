import { Router } from "express";
import * as sourcingRequestController from "./requests.controller.js"
import * as validationSchemas from "./requests.validation.js"
import {appValidator} from "../../../middelwares/app.validation.js"
import {checkUserToken} from "../../../middelwares/chcek_user_token.js"
import {allowedTo} from "../../../middelwares/authorization.js"
import {checkSourcingRequestForImporter} from "./requests.middelwares.js"
import {checkUserIsImporter,checkImporterVerified} from "../../importers/importers.middelwares.js"
import { multerUploader } from "../../../utils/multer.js";
export const sourcingRequestRouter=Router()

const fields=[
    {name:'docs',maxCount:3},
]
const types={
    docs:'file',
}

sourcingRequestRouter.post(
    "/add",checkUserToken,checkUserIsImporter,checkImporterVerified,
    appValidator(validationSchemas.addSourcingRequestValidation),
    sourcingRequestController.addSourcingRequest
    )

 sourcingRequestRouter.put("/uploadMedia/:id",checkUserToken,checkUserIsImporter,checkSourcingRequestForImporter,
 multerUploader('sourcingReqs',types).fields(fields),
 sourcingRequestController.uploadMedia
 )   

    sourcingRequestRouter.get("",sourcingRequestController.getSourcingRequests)

sourcingRequestRouter.get("/:id",sourcingRequestController.getSourcingRequest)

sourcingRequestRouter.delete("/:id",checkUserToken,checkUserIsImporter,checkSourcingRequestForImporter,sourcingRequestController.deleteSourcingRequest)

sourcingRequestRouter.delete("/formAdmin/:id",checkUserToken,allowedTo(['admin']),sourcingRequestController.deleteSourcingRequestFromAdmin)

sourcingRequestRouter.put("/:id",checkUserToken,checkUserIsImporter,checkSourcingRequestForImporter,
appValidator(validationSchemas.updateSourcingRequestValidation),
sourcingRequestController.updateSourcingRequest)

sourcingRequestRouter.patch("/updateMedia/:id",checkUserToken,checkUserIsImporter,checkSourcingRequestForImporter,multerUploader('sourcingReqs',types).fields([
    {name:'docs',maxCount:1}]),sourcingRequestController.updateOneFile
)
