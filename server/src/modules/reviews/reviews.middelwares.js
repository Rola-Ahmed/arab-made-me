import { Product } from "../../database/models/product.model.js";
import PurchasingOrder from "../../database/models/purchasin_order.model.js";
import { Review } from "../../database/models/review.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkReviewForImporter = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.params
        const review = await Review.findOne({
            where: {
                id,
                importerId: req.importer.id
            }
        })

        if (!review) return res.json({ message: "review not found or it's not for that user" })

        req.review = review
        nxt()
    }
)

export const checkImporterBoughtProductInPo = asyncHandler(
    async (req, res, nxt) => {
        const { productId } = req.body
        const po = await PurchasingOrder.findOne({
            where: { productId, importerId: req.importer.id }
        })
        if (!po) return res.json({ message: "this user didn't buy this product" })

        const review = await Review.findOne({ where: { importerId: req.importer.id, productId } })
        if (review) return res.json({ message: "this user reviewd before" })

        nxt()
    }
)