import { Factory } from "../../database/models/factory.model.js";
import { Importer } from "../../database/models/importer.model.js";
import { Product } from "../../database/models/product.model.js";
import QuotationRequest from "../../database/models/qoutation_request.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import { sendMail, sendNotificationMail } from "../../utils/email.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const addQuotationRequest = asyncHandler(
    async (req, res, nxt) => {
        const{factoryId , productId, productName }=req.body
            if(!(await Product.findOne({where:{
                id:productId,
                factoryId:factoryId,
                name:productName
            }}))) return res.json({message:"product not found or it's not assigned for that factory"})

        const quotationRequest=await QuotationRequest.create({...req.body,importerId:req.importer.id})

        await sendNotificationMail("factory",factoryId,"RFQ")

        return res.json({message:"done",quotationRequest})
    }
)


export const uploadMedia=crudOps.uploadMedia('quotationRequest',{'docs':'array'})

export const getQuotationRequest=crudOps.getOne(QuotationRequest)

export const getQuotationRequests=crudOps.getAll(QuotationRequest)

export const deleteQutoationRequest=crudOps.deleteFromReq('quotationRequest',{'docs':'array'})

export const deleteQutoationRequestFromAdmin=crudOps.deleteModel(QuotationRequest,{'docs':'array'})

export const updateQuotationRequest=crudOps.updateModel(QuotationRequest)

export const updateOneFile=crudOps.updateOneInMedia(QuotationRequest,'quotationRequest','docs',3)
