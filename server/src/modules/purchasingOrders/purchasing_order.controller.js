import { Factory } from "../../database/models/factory.model.js";
import { Importer } from "../../database/models/importer.model.js";
import { Product } from "../../database/models/product.model.js";
import PurchasingOrder from "../../database/models/purchasin_order.model.js";
import QuotationRequest from "../../database/models/qoutation_request.model.js";
import Quotation from "../../database/models/quotation.model.js";
import QuotationAnswer from "../../database/models/quotation.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";
import {sendNotificationMail} from "../../utils/email.js"
export const addPurchasingOrder = asyncHandler(
    async (req, res, nxt) => {
        const {factoryId}=req.body
        

        const purchasingOrder=await PurchasingOrder.create({...req.body,importerId:req.importer.id})
        if(!purchasingOrder) return res.json({message:"po not created"})

        await sendNotificationMail("factory",factoryId,"Purchasing Order")
        return res.json({message:"done",purchasingOrder})
    }
)

export const uploadMedia=crudOps.uploadMedia('purchasingOrder',{'docs':'array'})


export const getPurchasingOrder=crudOps.getOne(PurchasingOrder)

export const geturchasingOrders=crudOps.getAll(PurchasingOrder)

export const deletePurchasingOrderFromAdmin=crudOps.deleteModel(PurchasingOrder,{'docs':'array'})

export const deletePurchasingOrder=crudOps.deleteFromReq('purchasingOrder',{'docs':'array'})

export const updatePurchasingOrder=crudOps.updateModel(PurchasingOrder)

export const updateOneFile=crudOps.updateOneInMedia(PurchasingOrder,'purchasingOrder','docs',3)