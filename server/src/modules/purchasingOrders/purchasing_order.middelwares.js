import { Product } from "../../database/models/product.model.js";
import PurchasingOrder from "../../database/models/purchasin_order.model.js";
import Quotation from "../../database/models/quotation.model.js";
import { SourcingOffer } from "../../database/models/sourcing_hub/offer.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkPODataProduct = asyncHandler(
    async (req, res, nxt) => {
        const { productId, factoryId, productName } = req.body


        if (productId) {
            const product = await Product.findOne({ where: { id: productId, name: productName, factoryId } })
            if (!product) return res.json({ message: "product not found or it's not assoicated for that factory" })
        }




        nxt()
    }
)

export const checkPODataSourcingOffer = asyncHandler(
    async (req, res, nxt) => {
        const { sourcingOfferId, factoryId, productName } = req.body

        if (sourcingOfferId) {
            const s = await SourcingOffer.findOne({ where: { id: sourcingOfferId, productName, factoryId } })
            if (!s) return res.json({ message: "sourcing offer not found or it's not for that factory" })
        }
        nxt()
    }
)

export const checkPODataQutoation = asyncHandler(
    async (req, res, nxt) => {
        const { quotationId, factoryId, productName } = req.body

        if (quotationId) {
            const q = await Quotation.findOne({ where: { id: quotationId, productName, factoryId } })
            if (!q) return res.json({ message: "quotation not found or it's not associated for that factory" })
        }
        nxt()
    }
)

export const checkPurchasingOrderForImporter = asyncHandler(
    async (req, res, nxt) => {
        const importer = req.importer["dataValues"]
        console.log(importer.id);
        //console.log(importer);
        const { id } = req.params
        // console.log(req.params);
        console.log(id);
        console.log("here1");
        const purchasingOrder = await PurchasingOrder.findOne({ where: { id: id, importerId: importer.id } })
        console.log("here2");
        if (!purchasingOrder) return res.json({ message: "purchasingOrder not found or it's not for this importer" })

        req.purchasingOrder = purchasingOrder
        nxt()
    }
)


export const checkPurchasingOrderForFactroy = asyncHandler(
    async (req, res, nxt) => {
        //console.log(importer);
        const { id } = req.params
        // console.log(req.params);
        console.log(id);
        console.log("here1");
        const purchasingOrder = await PurchasingOrder.findOne({ where: { id: id, factoryId: req.factory.id } })
        console.log("here2");
        if (!purchasingOrder) return res.json({ message: "purchasingOrder not found or it's not for this factory" })

        req.purchasingOrder = purchasingOrder
        nxt()
    }
)