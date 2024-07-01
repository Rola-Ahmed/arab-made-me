import { Factory } from "../../database/models/factory.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkUserHasFactory = asyncHandler(
    async (req, res, nxt) => {
        const user = req.user
        const hasFactory = await Factory.findOne({ where: { userId: user.id } })
        if (!hasFactory) return res.status(401).json({ message: "this user has not factory" })
        req.factory = hasFactory
        nxt()
    }
)

export const checkFactoryVerified=asyncHandler(
    async(req,res,nxt)=>{
        const factory=req.factory
        if(factory.verified=='0' || !factory.emailActivated) return res.status(403).json({message:"factory is not verified or repEmail is not activated"})
        nxt()
    }
)

