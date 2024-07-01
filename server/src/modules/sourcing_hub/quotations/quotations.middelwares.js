import SourcingQuotation from "../../../database/models/sourcing_hub/quotation.model.js";

import { asyncHandler } from "../../../utils/error_handling.js";

export const checkSourcingQuotationForFactory = asyncHandler(
    async (req, res, nxt) => {
        const factroy = req.factory["dataValues"]
        const { id } = req.params
        const quotation = await SourcingQuotation.findOne({where:{id:id,factoryId:factroy.id}})
        if (!quotation) return res.json({ message: "sourcing quotation not found or it's not for this factory" })

        req.sourcingQuotation = quotation
        nxt()
    }
)