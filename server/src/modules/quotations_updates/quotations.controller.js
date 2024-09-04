import { Factory } from "../../database/models/factory.model.js";
import { Importer } from "../../database/models/importer.model.js";
import { Product } from "../../database/models/product.model.js";
import QuotationRequest from "../../database/models/qoutation_request.model.js";
import Quotation from "../../database/models/quotation.model.js";
import QuotationAnswer from "../../database/models/quotation.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";
import {sendNotificationMail} from "../../utils/email.js"
import QuotationUpdates from "../../database/models/quotation_updates.model.js";
export const addQuotation = asyncHandler(
    async (req, res, nxt) => {
       
        const quotation = await QuotationUpdates.create({ ...req.body, factoryId: req.factory.id })

        if(!quotation) return res.json({message:"quotaion not created"})

        await sendNotificationMail("importer",req.quotation.importerId,"Quotation")
        return res.json({ message: "done", quotation })
    }
)

export const uploadMedia = crudOps.uploadMedia('quotation',{'docs':'array'})


export const getQuotation = crudOps.getOne(QuotationUpdates)

export const getQuotations = crudOps.getAll(QuotationUpdates)

export const deleteQutoationFromAdmin = crudOps.deleteModel(QuotationUpdates,{'docs':'array'})

export const deleteQutoation = crudOps.deleteFromReq('quotation',{'docs':'array'})

export const updateQuotation = crudOps.updateModel(QuotationUpdates)

export const updateOneFile = crudOps.updateOneInMedia(QuotationUpdates,'quotation','docs',3)


export const getQuotationsUpdatesofQuote=asyncHandler(
    async(req,res,nxt)=>{
        const quotes=QuotationUpdates.findAll({where:{
            quotationId:req.params.id
        }})
        return res.json({message:"done",quotes})
    }
)