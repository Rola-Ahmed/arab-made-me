import { PrivateLabeling } from "../../database/models/private_labeling.model.js";
import { Product } from "../../database/models/product.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkPrivateLabelingForImporter=asyncHandler(
    async(req,res,nxt)=>{
        const{id}=req.params
        const privateLabeling=await PrivateLabeling.findOne({where:{
            id,
            importerId:req.importer.id
        }})

        if(!privateLabeling) return res.json({message:"private labeling not found"})

        req.privateLabeling=privateLabeling
        nxt()
    }
)

export const checkProductForFactoryInPrivateLabeling=asyncHandler(
    async(req,res,nxt)=>{
        const {productId,productName}=req.body
        if(productId){
            const product = await Product.findOne({where:{id:productId,factoryId:req.privateLabeling.factoryId}})
            if(!product) return res.json({message:"product is not assoicated for that factory or it's not found"})
        }
    nxt()
    }
)


export const checkPrivateLabelingForFactory=asyncHandler(
    async(req,res,nxt)=>{
        const{id}=req.params
        const privateLabeling=await PrivateLabeling.findOne({where:{
            id,
            factoryId:req.factory.id
        }})

        if(!privateLabeling) return res.json({message:"private labeling not found or not for that factory"})

        req.privateLabeling=privateLabeling
        nxt()
    }
)