import { asyncHandler } from "../utils/error_handling.js";

export const notForAdmin=asyncHandler(
    async(req,res,nxt)=>{
        if(req.user.role=='admin') return res.status(403).json({message:"admin can't be a factory or importer"})
        nxt()
    }
)