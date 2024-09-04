
import { asyncHandler } from "../../../utils/error_handling.js";
import {SourcingOffer} from "../../../database/models/sourcing_hub/offer.js"
export const checkSourcingOfferForFactory=asyncHandler(
    async(req,res,nxt)=>{
        const{id}=req.params
        const sourcingOffer=await SourcingOffer.findOne({where:{id,factoryId:req.factory.id}})
        if(!sourcingOffer) return res.json({message:"sourcing offer not found or it's not for this factory"})
        
        req.sourcingOffer=sourcingOffer
        nxt()
    }
)