
import { PrivateLabeling } from "../../database/models/private_labeling.model.js";
import { SpecialManufacturingRequest } from "../../database/models/special_manufacturing.model.js";
import { Visit } from "../../database/models/visit.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import { sendNotificationMail } from "../../utils/email.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const addVisit =asyncHandler(
    async(req,res,nxt)=>{
        const visit=await Visit.create({...req.body,importerId:req.importer.id})
        if(!visit) return res.json({message:"visit not created"})
        
        await sendNotificationMail("factory",req.body.factoryId,"Visit Request")
        return res.json({message:"done",visit})
    }
)




export const getVisit=crudOps.getOne(Visit)

export const getVisits=crudOps.getAll(Visit)

export const deleteVisit=crudOps.deleteFromReq('visit')

export const deleteVisitFromAdmin=crudOps.deleteModel(Visit)

export const updateVisit=crudOps.updateModel(Visit)

