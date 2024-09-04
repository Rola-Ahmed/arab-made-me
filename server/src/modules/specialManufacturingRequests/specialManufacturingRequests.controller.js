
import { SpecialManufacturingRequest } from "../../database/models/special_manufacturing.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";
import {sendNotificationMail} from "../../utils/email.js"
export const addSpecialManufacturingRequest =asyncHandler(
    async(req,res,nxt)=>{
        const specialManufacturing=await SpecialManufacturingRequest.create({...req.body,importerId:req.importer.id})
        if(!specialManufacturing) return res.json({message:"spmf not created"})

        await sendNotificationMail("factory",req.body.factoryId,"Special Manufacturing")
        return res.json({message:"done",specialManufacturing})
    }
)




export const uploadMedia=crudOps.uploadMedia('specialManufacturingRequest',{'docs':'array'})

export const getSpecialManufacturingRequest=crudOps.getOne(SpecialManufacturingRequest)

export const getSpecialManufacturingRequests=crudOps.getAll(SpecialManufacturingRequest)

export const deleteSpecialManufacturingRequest=crudOps.deleteFromReq('specialManufacturingRequest',{'docs':'array'})

export const deleteSpecialManufacturingRequestFromAdmin=crudOps.deleteModel(SpecialManufacturingRequest,{'docs':'array'})

export const updateSpecialManufacturingRequest=crudOps.updateModel(SpecialManufacturingRequest)

export const updateOneFile=crudOps.updateOneInMedia(SpecialManufacturingRequest,'specialManufacturingRequest','docs',3)
