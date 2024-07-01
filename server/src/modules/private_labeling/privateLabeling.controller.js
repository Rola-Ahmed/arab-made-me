
import { PrivateLabeling } from "../../database/models/private_labeling.model.js";
import { SpecialManufacturingRequest } from "../../database/models/special_manufacturing.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";
import {sendNotificationMail} from "../../utils/email.js"
export const addPrivateLabeling =asyncHandler(
    async(req,res,nxt)=>{
        const privateLabeling=await PrivateLabeling.create({...req.body,importerId:req.importer.id})
        if(!privateLabeling) return res.json({message:"private labeling not created"})

        await sendNotificationMail("factory",req.body.factoryId,"Private Label")
        return res.json({message:"done",privateLabeling})
    }
)



export const uploadMedia=crudOps.uploadMedia('privateLabeling',{'docs':'array'})

export const getPrivateLabeling=crudOps.getOne(PrivateLabeling)

export const getPrivateLabelings=crudOps.getAll(PrivateLabeling)

export const deletePrivateLabeling=crudOps.deleteFromReq('privateLabeling',{'docs':'array'})

export const deletePrivateLabelingFromAdmin=crudOps.deleteModel(PrivateLabeling,{'docs':'array'})

export const updatePrivateLabeling=crudOps.updateModel(PrivateLabeling)

export const updateOneFile=crudOps.updateOneInMedia(PrivateLabeling,'privateLabeling','docs',3)
