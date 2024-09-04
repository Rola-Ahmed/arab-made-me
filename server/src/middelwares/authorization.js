import { asyncHandler } from "../utils/error_handling.js";

export const allowedTo=(roles)=>{
    return asyncHandler(
    async(req,res,nxt)=>{
        if(!roles.includes(req.user.role))
        return nxt(new Error("unauthorized",{status:403}))
    nxt()
    }
)}
