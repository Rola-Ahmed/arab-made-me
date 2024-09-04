import { Router } from "express";
import * as shippingController from "./shipping.controller.js"
import * as shippingValidationSchemas from "./shipping.validation.js"
import {checkUserToken} from "../../middelwares/chcek_user_token.js"
import { appValidator } from "../../middelwares/app.validation.js";
import { allowedTo } from "../../middelwares/authorization.js";
import { checkShippingCompanyVerified, checkUserIsShippingCompany } from "./shipping.middelwares.js";
import { multerUploader } from "../../utils/multer.js";
import { checkMediaLength } from "../../middelwares/media_length.js";
import { notForAdmin } from "../../middelwares/not_for_admin.js";
import { sendingEmailLimit } from "../../middelwares/sendin_email_limit.js";
export const shippingRouter=Router()

shippingRouter.post("/add",checkUserToken,notForAdmin,appValidator(shippingValidationSchemas.addShippingCompanySchema),shippingController.addShippingCompany)

shippingRouter.get("/confirmEmail/:token",shippingController.confirmEmail)
shippingRouter.get("/resendConfirmationMail/:id",sendingEmailLimit,shippingController.resendConfirmationMail)

shippingRouter.get("/",shippingController.getShippingCompanies)


//shippingRouter.put("/verify",checkUserToken,checkUserIsShippingCompany,appValidator(shippingValidationSchemas.verfiyFactorySchema),shippingController.verfiyFactory)



shippingRouter.get("/:id",shippingController.getShippingCompanyData)



shippingRouter.put("/update/fromUser",checkUserToken,checkUserIsShippingCompany
,appValidator(shippingValidationSchemas.updateShippingCompanyValidation),
shippingController.updateShippingCompany)

shippingRouter.put("/update/fromAdmin/:id",checkUserToken,allowedTo(['admin']),
appValidator(shippingValidationSchemas.updateShippingCompanyValidationAdmin),
shippingController.updateFromAdmin)


shippingRouter.put("/verify/:id",checkUserToken,allowedTo(['admin']),shippingController.verfiyShippingCompany)

shippingRouter.delete("/delete/fromAdmin/:id",checkUserToken,allowedTo(['admin']),shippingController.deleteShippingCompanyFromAdmin)

shippingRouter.delete("/delete/fromUser",checkUserToken,checkUserIsShippingCompany,shippingController.deleteShippingCompanyFromProfile)


const fields=[
    {name:'images',maxCount:8},
    {name:'coverImage',maxCount:1},
    {name:'legalDocs',maxCount:5}
]
const types={
    image:'image',
    legalDocs:'file'
}
shippingRouter.put(
    "/media",checkUserToken,checkUserIsShippingCompany,
    multerUploader(`shippingCompanies`,types).fields(fields),shippingController.addMedia
)

const fields2=[
    {name:'legalDocs',maxCount:1}
]
const types2={
    legalDocs:'file'
}
shippingRouter.patch(
    "/update/legalDoc",checkUserToken,checkUserIsShippingCompany,
    multerUploader(`shippingCompanies`,types2).fields(fields2),shippingController.updateOneLegalDoc
)

const fields3=[
    {name:'images',maxCount:1}
]
const types3={
    legalDocs:'image'
}

shippingRouter.patch(
    "/update/image",checkUserToken,checkUserIsShippingCompany,
    multerUploader(`shippingCompanies`,types3).fields(fields3),shippingController.updateOneImage
)


// shippingRouter.get("/ShippingCompany/pos",checkUserToken,checkUserIsShippingCompany,checkShippingCompanyVerified,
// shippingController.getPos
// )

// shippingRouter.get("/ShippingCompany/rfqs",checkUserToken,checkUserIsShippingCompany,checkShippingCompanyVerified,
// shippingController.getRFQs
// )

// shippingRouter.get("/ShippingCompany/quotations",checkUserToken,checkUserIsShippingCompany,checkShippingCompanyVerified,
// shippingController.getQuotations
// )







