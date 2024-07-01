import { ShippingCompany } from "../../database/models/shipping_company.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkUserIsShippingCompany = asyncHandler(
    async (req, res, nxt) => {
        const user = req.user
        const isShippingCompany = await ShippingCompany.findOne({ where: { userId: user.id } })
        if (!isShippingCompany) return res.status(401).json({ message: "this user is not importer" })
        req.shippingCompany = isShippingCompany
        nxt()
    }
)


export const checkShippingCompanyVerified=asyncHandler(
    async(req,res,nxt)=>{
        const shippingCompany=req.shippingCompany
        if(shippingCompany.verified=='0' || !shippingCompany.emailActivated) return res.status(403).json({message:"shippingCompany is not verified or repEmail is not activated"})
        nxt()
    }
)

