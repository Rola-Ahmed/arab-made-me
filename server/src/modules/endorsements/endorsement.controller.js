
import { Endorsement } from "../../database/models/endorsment.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import { sendNotificationMail } from "../../utils/email.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const addEndorsement =asyncHandler(
    async(req,res,nxt)=>{
        const endorsement=await Endorsement.create({...req.body,importerId:req.importer.id})
        if(!endorsement) return res.json({message:"Endorsement not created"})
        
        // await sendNotificationMail("factory",req.body.factoryId,"Endorsement Request")
        return res.json({message:"done",Endorsement})
    }
)


export const getEndorsementForFactory=asyncHandler(
    async(req,res,nxt)=>{
        const{id}=req.params
        return res.status(200).json({message:"done","endorsements":await Endorsement.findAll({
            where:{factoryId:id},
            include:'factory'
        })})
    }
)



export const getEndorsement=crudOps.getOne(Endorsement)

export const getEndorsements=crudOps.getAll(Endorsement)

export const deleteEndorsement=crudOps.deleteFromReq('endorsement')

export const deleteEndorsementFromAdmin=crudOps.deleteModel(Endorsement)



