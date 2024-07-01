import QuotationRequest from "../../database/models/qoutation_request.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkQuotationRequestForImporter = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.params
        const quotationRequest = await QuotationRequest.findOne({
            where: {
                id,
                importerId: req.importer.id
            }
        })

        if (!quotationRequest) return res.json({ message: "quotation request not found or it's not assoicated for that importer" })

        req.quotationRequest = quotationRequest
        nxt()
    }
)


export const checkQuotationRequestForImporterWithIds = asyncHandler(
    async (req, res, nxt) => {
        const { quotatioRequestId, importerId } = req.params
        const quotationRequest = await QuotationRequest.findOne({
            where: {
                id: quotatioRequestId,
                importerId
            }
        })

        if (!quotationRequest) return res.json({ message: "quotation request not found or it's not assoicated for that importer" })

        req.quotationRequest = quotationRequest
        nxt()
    }
)


export const checkQuotationRequestForFactroy = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.params
        const quotationRequest = await QuotationRequest.findOne({
            where: {
                id,
                factoryId: req.factory.id
            }
        })

        if (!quotationRequest) return res.json({ message: "quotation request not found or it's not assoicated for that factory" })

        req.quotationRequest = quotationRequest
        nxt()
    }
)