import SourcingQuotation from "../../../database/models/sourcing_hub/quotation.model.js";
import { SourcingRequest } from "../../../database/models/sourcing_hub/request.model.js";
import { crudOps } from "../../../utils/crud_ops.js";
import { asyncHandler } from "../../../utils/error_handling.js";

export const addQuotation = asyncHandler(
    async (req, res, nxt) => {

        const{sourcingRequestId}=req.body
        const sourcingReq=await SourcingRequest.findOne({where:{id:sourcingRequestId}})
        if(!sourcingReq) return res.json({message:"sourcing request not found"})
     
        
        const sourcingQuotation=await SourcingQuotation.create({...req.body,factoryId:req.factory.id})
        return res.json({message:"done",sourcingQuotation})
    }
)

export const uploadMedia=crudOps.uploadMedia('sourcingQuotation')


export const getQuotation=crudOps.getOne(SourcingQuotation)

export const getQuotations=crudOps.getAll(SourcingQuotation)

export const deleteQutoationFromAdmin=crudOps.deleteModel(SourcingQuotation)

export const deleteQutoation=crudOps.deleteFromReq('sourcingQuotation')

export const updateQuotation=crudOps.updateModel(SourcingQuotation)

export const updateOneFile=asyncHandler(
    async(req,res,nxt)=>{
        const{id}=req.params
        const sourcingQuotation=req.sourcingQuotation
        const docsArr=sourcingQuotation["dataValues"].docs
        const{docs}=req.files
        const{docsIndex}=req.body
        console.log(docs);
        console.log(docsIndex);
        if (docsIndex>=3) {
            return res.json({message:"Maximum docs is 3"})
        }
       
        if(docs&&docsIndex){
            docsArr[docsIndex]=docs[0].finalPath
            let updatedDocs=[]
            docsArr.forEach(element => {
               updatedDocs.push({finalPath:element})
            });
            const rfq=await SourcingQuotation.update({docs:updatedDocs},{where:{id}})
            const q = await SourcingQuotation.findByPk(id)
           return res.json({message:"done",sourcingQuotation:q})
        }else if(docsIndex){
            let updatedDocs=[]
            let c=0;
            for (let indexx = 0; indexx < docsArr.length; indexx++) {
               if(indexx==docsIndex) continue
               updatedDocs[c]={finalPath:docsArr[indexx]}
               c++
                
            }
            
            await SourcingQuotation.update({docs:updatedDocs},{where:{id}})
           const q= await SourcingQuotation.findByPk(id)
           return res.json({message:"done",sourcingQuotation:q})
        }
        else{
            return res.json({message:"no doc selected"})
        }
        
    }
)