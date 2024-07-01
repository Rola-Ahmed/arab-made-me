import QuotationRequest from "../../database/models/qoutation_request.model.js";
import { SpecialManufacturingRequest } from "../../database/models/special_manufacturing.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkSpecialManufacturingRequestForImporter = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.params
        const specialManufacturingRequest = await SpecialManufacturingRequest.findOne({
            where: {
                id,
                importerId: req.importer.id
            }
        })

        if (!specialManufacturingRequest) return res.json({ message: "special manufacturing request not found" })

        req.specialManufacturingRequest = specialManufacturingRequest
        nxt()
    }
)


export const checkSpecialManufacturingRequestForFactory = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.params
        const specialManufacturingRequest = await SpecialManufacturingRequest.findOne({
            where: {
                id,
                factoryId: req.factory.id
            }
        })

        if (!specialManufacturingRequest) return res.json({ message: "special manufacturing request not found" })

        req.specialManufacturingRequest = specialManufacturingRequest
        nxt()
    }
)