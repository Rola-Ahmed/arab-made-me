import { Router } from "express";
import * as controller from "./offers.controller.js"
import * as validationSchemas from "./offers.validation.js"
import {appValidator} from "../../../middelwares/app.validation.js"
import { checkUserToken } from "../../../middelwares/chcek_user_token.js";
import { checkFactoryVerified, checkUserHasFactory } from "../../factories/factories.middelwares.js";
import { allowedTo } from "../../../middelwares/authorization.js";
import {  checkSourcingOfferForFactory } from "./offers.middelwares.js";
import { multerUploader } from "../../../utils/multer.js";
import { checkProductForFactory, checkProductForFactoryFromBody } from "../../products/products.middelwares.js";
export const sourcingOfferRouter = Router()

const fields=[
    {name:'images',maxCount:8},
   // {name:'coverImage',maxCount:1},
]
const types={
    images:'image',
    //coverImage:'image',
}

sourcingOfferRouter.post("/add", checkUserToken, checkUserHasFactory,checkFactoryVerified,appValidator(validationSchemas.addSourcingOfferSchema), controller.addSourcingOffer)

sourcingOfferRouter.put("/uploadMedia/:id",checkUserToken,checkUserHasFactory,checkSourcingOfferForFactory,multerUploader('sourcingOffers',types).fields(fields),controller.uploadMedia)

sourcingOfferRouter.get("/", controller.getSourcingOffers)

sourcingOfferRouter.get("/:id", controller.getSourcingOffer)

sourcingOfferRouter.put("/update/fromUser/:id",checkUserToken,checkUserHasFactory,checkSourcingOfferForFactory,checkProductForFactoryFromBody,appValidator(validationSchemas.updateSourcingOfferSchema),controller.updateSourcingOffer)

sourcingOfferRouter.put("/update/fromAdmin/:id",checkUserToken,allowedTo(['admin']),appValidator(validationSchemas.updateProductValidation),controller.updateFromAdmin)


const fields2=[
    {name:'images',maxCount:1},
]
const types2={
    images:'image',
}


sourcingOfferRouter.patch("/update/image/:id",checkUserToken,checkUserHasFactory,checkSourcingOfferForFactory,multerUploader('sourcingOffers',types2).fields(fields2),controller.updateOneImage)



sourcingOfferRouter.delete("/delete/fromUser/:id",checkUserToken,checkUserHasFactory,checkSourcingOfferForFactory,controller.deleteSourcingOffer)

sourcingOfferRouter.delete("/delete/fromAdmin/:id",checkUserToken,allowedTo(['admin']),controller.deleteSourcingOfferFromAdmin)

