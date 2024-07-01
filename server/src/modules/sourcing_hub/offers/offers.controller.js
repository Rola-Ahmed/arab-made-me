import { Product } from "../../../database/models/product.model.js";
import { SourcingOffer } from "../../../database/models/sourcing_hub/offer.js";
import { crudOps } from "../../../utils/crud_ops.js";
import { asyncHandler } from "../../../utils/error_handling.js";

export const addSourcingOffer = asyncHandler(
    async (req, res, nxt) => {
        const factoryId = req.factory.id
        const{productId}=req.body
        if(productId){
            if(! await Product.findOne({where:{id:productId,factoryId}})) return res.json({message:"product not found or it's not assoicated for that factory"})
        }
        const sourcingOffer = await SourcingOffer.create({ ...req.body, factoryId })
        return res.json({ message: "done", sourcingOffer })
    }
)

export const getSourcingOffers = crudOps.getAll(SourcingOffer)

export const getSourcingOffer = crudOps.getOne(SourcingOffer)

export const uploadMedia=crudOps.uploadMedia('sourcingOffer',{'images':'array'})

export const updateSourcingOffer = crudOps.updateModel(SourcingOffer)

export const updateOneImage=crudOps.updateOneInMedia(SourcingOffer,'sourcingOffer','images',3)

export const deleteSourcingOffer = crudOps.deleteFromReq('sourcingOffer',{'images':'array'})
export const updateFromAdmin = crudOps.updateModel(SourcingOffer)
