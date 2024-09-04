import { SourcingRequest } from "../../../database/models/sourcing_hub/request.model.js";
import { asyncHandler } from "../../../utils/error_handling.js";

export const checkSourcingRequestForImporter=asyncHandler(
    async(req,res,nxt)=>{
        const{id}=req.params
        const sourcingRequest=await SourcingRequest.findOne({where:{
            id,
            importerId:req.importer.id
        }})

        if(!sourcingRequest) return res.json({message:"sourcing request not found or it's not for this importer"})

        req.sourcingRequest=sourcingRequest
        nxt()
    }
)