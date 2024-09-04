
import { PrivateLabeling } from "../../database/models/private_labeling.model.js";
import { Product } from "../../database/models/product.model.js";
import { Review } from "../../database/models/review.model.js";
import { SpecialManufacturingRequest } from "../../database/models/special_manufacturing.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const addReview =asyncHandler(
    async(req,res,nxt)=>{
        const review=await Review.create({...req.body,importerId:req.importer.id})
        if(!review) return res.json({message:"review not created"})

        const{productId,rate}=req.body
        const product= await Product.findByPk(productId)
        const productRate=product.averageRate
        await product.update({averageRate:(productRate+rate)/2})

        return res.json({message:"done",review})
    }
)




export const getReview=crudOps.getOne(Review)

export const getReviews=crudOps.getAll(Review)

export const deleteReview=crudOps.deleteFromReq('reviews')

export const deleteReviewWithId=crudOps.deleteModel(Review)

export const updateReview=crudOps.updateModel(Review)


