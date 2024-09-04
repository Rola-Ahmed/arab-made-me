import { Factory } from "../../database/models/factory.model.js";
import { Importer } from "../../database/models/importer.model.js";
import { Product } from "../../database/models/product.model.js";
import QuotationRequest from "../../database/models/qoutation_request.model.js";
import Quotation from "../../database/models/quotation.model.js";
import QuotationAnswer from "../../database/models/quotation.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";
import {sendNotificationMail} from "../../utils/email.js"
export const addQuotation = asyncHandler(
    async (req, res, nxt) => {
        console.log("here");
        const quotation = await Quotation.create({ ...req.body, factoryId: req.factory.id })

        if(!quotation) return res.json({message:"quotaion not created"})

        await sendNotificationMail("importer",req.body.importerId,"Quotation")
        return res.json({ message: "done", quotation })
    }
)

export const uploadMedia = crudOps.uploadMedia('quotation',{'docs':'array'})


export const getQuotation = crudOps.getOne(Quotation)

export const getQuotations = crudOps.getAll(Quotation)

export const deleteQutoationFromAdmin = crudOps.deleteModel(Quotation,{'docs':'array'})

export const deleteQutoation = crudOps.deleteFromReq('quotation',{'docs':'array'})

export const updateQuotation = crudOps.updateModel(Quotation)

export const updateOneFile = crudOps.updateOneInMedia(Quotation,'quotation','docs',3)


export const getQuotationByFormId=asyncHandler(
    async(req,res,nxt)=>{
        if(req.body.productId){
            const quotaion = await Quotation.findAll({where:{productId:req.body.productId}})
            return res.json({message:"done",quotaion})
        }
        if(req.body.quotationRequestId){
            const quotaion = await Quotation.findAll({where:{quotaionRequestId:req.body.rfqId}})
            return res.json({message:"done",quotaion})
        }
        if(req.body.sourcingOfferId){
            const quotaion = await Quotation.findAll({where:{sourcingOfferId:req.body.sourcingOfferId}})
            return res.json({message:"done",quotaion})
        }
        if(req.body.privateLabelingId){
            const quotaion = await Quotation.findAll({where:{privateLabelingId:req.body.privateLabelingId}})
            return res.json({message:"done",quotaion})
        }
        if(req.body.whiteLabelingId){
            const quotaion = await Quotation.findAll({where:{whiteLabelingId:req.body.whiteLabelingId}})
            return res.json({message:"done",quotaion})
        }
        return res.status(400).json({message:"wrong id"})
    }
)