import Router from "express"
import * as controller from "./reviews.controller.js"
import * as validation from "./reviews.validation.js"
import { checkUserToken } from "../../middelwares/chcek_user_token.js"
import { checkUserIsImporter } from "../importers/importers.middelwares.js"
import { checkImporterBoughtProductInPo, checkReviewForImporter } from "./reviews.middelwares.js"
import { appValidator } from "../../middelwares/app.validation.js"

export const reviewsRouter=Router()

reviewsRouter.post("",checkUserToken,checkUserIsImporter,checkImporterBoughtProductInPo,
appValidator(validation.addReviewValidation),controller.addReview
)

reviewsRouter.put("/:id",checkUserToken,checkUserIsImporter,checkReviewForImporter,controller.updateReview)

reviewsRouter.delete("/:id",checkUserToken,checkUserIsImporter,checkReviewForImporter,controller.deleteReviewWithId)

reviewsRouter.get("/",controller.getReviews)

reviewsRouter.get("/:id",controller.getReview)

