import { PrivateLabeling } from "../../database/models/private_labeling.model.js";
import { Product } from "../../database/models/product.model.js";
import { WhiteLabeling } from "../../database/models/white_labeling.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkWhiteLabelingForImporter=asyncHandler(
    async(req,res,nxt)=>{
        const{id}=req.params
        const whiteLabeling=await WhiteLabeling.findOne({where:{
            id,
            importerId:req.importer.id
        }})

        if(!whiteLabeling) return res.json({message:"white labeling not found"})

        req.whiteLabeling=whiteLabeling
        nxt()
    }
)

export const checkProductForFactoryInWhiteLabeling=asyncHandler(
    async(req,res,nxt)=>{
        const {productId,productName}=req.body
        if(productId){
            const product = await Product.findOne({where:{id:productId,factoryId:req.whiteLabeling.factoryId}})
            if(!product) return res.json({message:"product is not assoicated for that factory or it's not found"})
        }
    nxt()
    }
)


export const checkWhiteLabelingForFactory=asyncHandler(
    async(req,res,nxt)=>{
        const{id}=req.params
        const whiteLabeling=await WhiteLabeling.findOne({where:{
            id,
            factoryId:req.factory.id
        }})

        if(!whiteLabeling) return res.json({message:"private labeling not found or not for that factory"})

        req.whiteLabeling=whiteLabeling
        nxt()
    }
)