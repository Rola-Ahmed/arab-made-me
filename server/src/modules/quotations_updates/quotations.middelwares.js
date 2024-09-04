import { PrivateLabeling } from "../../database/models/private_labeling.model.js";
import QuotationRequest from "../../database/models/qoutation_request.model.js";
import Quotation from "../../database/models/quotation.model.js";
import QuotationUpdates from "../../database/models/quotation_updates.model.js";
import { SourcingRequest } from "../../database/models/sourcing_hub/request.model.js";
import { SpecialManufacturingRequest } from "../../database/models/special_manufacturing.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkQuotationForFactory = asyncHandler(
    async (req, res, nxt) => {
        const factroy = req.factory["dataValues"]
        const {quotationId} = req.body
        const quotation = await Quotation.findOne({where:{id:quotationId,factoryId:factroy.id}})
        if (!quotation) return res.json({ message: "quotation not found" })

        req.quotation = quotation
        nxt()
    }
)

export const checkQuotationUpdatesForFactory = asyncHandler(
    async (req, res, nxt) => {
        const factroy = req.factory["dataValues"]
        console.log(factroy);
        const { id } = req.params
        console.log(req.params);
        console.log(id);
        console.log("here1");
        const quotation = await QuotationUpdates.findOne({where:{id:id,factoryId:factroy.id}})
        console.log("here2");
        if (!quotation) return res.json({ message: "quotation not found" })

        req.quotation = quotation
        nxt()
    }
)


export const checkQuotationDataRFQ=asyncHandler(
    async(req,res,nxt)=>{
        const{importerId,quotationRequestId,productId, productName}=req.body      

        if (quotationRequestId) {
            const s = await QuotationRequest.findOne({ where: { id: quotationRequestId,productName,productId, importerId,factoryId:req.factory.id } })
            if (!s) return res.json({ message: "quotation request not found or it's not for that importer or not made for that factory" })
        }
    
    nxt()
    }
)


export const checkQuotationDataSourcingRequest=asyncHandler(
    async(req,res,nxt)=>{
        const{importerId,sourcingRequestId,productName}=req.body

        if (sourcingRequestId) {
            const s = await SourcingRequest.findOne({ where: { id: sourcingRequestId, importerId,productName } })
            if (!s) return res.json({ message: "sourcing request not found or it's not assoicated for that importer" })
        }
        nxt()
    }
)


export const checkQuotationDataPrivateLabel=asyncHandler(
    async(req,res,nxt)=>{
        const{importerId,privateLabelingId,productName}=req.body

        if (privateLabelingId) {
            const q = await PrivateLabeling.findOne({ where: { id: privateLabelingId, importerId, factoryId:req.factory.id,productName } })
            if (!q) return res.json({ message: "private labeling not found or it's not associated for that importer or not made for that factory" })
        }
        nxt()
    }
)

export const checkQuotationDataSpmf=asyncHandler(
    async(req,res,nxt)=>{
        const{importerId,specialManufacturingRequestId}=req.body

       if (specialManufacturingRequestId) {
            const q = await SpecialManufacturingRequest.findOne({ where: { id: specialManufacturingRequestId, importerId, factoryId:req.factory.id } })
            if (!q) return res.json({ message: "special manufacturing not found or it's not associated for that importer or not made for that factory" })
        }
        nxt()
    }
)