import { Product } from "../../database/models/product.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkProductForFactory = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.params
        const product = await Product.findByPk(id)
        if (!product) return res.json({ "message": "product not found" })
        if (req.factory.id != product.factoryId) return res.json({ message: "this product is not associated with this factory" })
        req.product = product
        nxt()
    }
)

export const checkProductForFactoryFromBody = asyncHandler(
    async (req, res, nxt) => {
        const { productId } = req.body
        const product = await Product.findByPk(productId)
        if (!product) return res.json({ "message": "product not found" })
        if (req.factory.id != product.factoryId) return res.status(400).json({ message: "this product is not associated with this factory" })
        req.product = product
        nxt()
    }
)


export const checkProductForFactoryWithIds = asyncHandler(
    async (req, res, nxt) => {
        const { productId, factoryId } = req.body
        if (productId) {
            const product = await Product.findOne({ where: { id: productId, factoryId } })
            if (!product) return res.status(400).json({ message: "product not found or it's not assoicated for this factory" })
        }

        nxt()
    }
)