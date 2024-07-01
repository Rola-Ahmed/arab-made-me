import { Factory } from "../../database/models/factory.model.js";
import { Importer } from "../../database/models/importer.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkUserIsImporter = asyncHandler(
    async (req, res, nxt) => {
        const user = req.user
        const isImporter = await Importer.findOne({ where: { userId: user.id } })
        if (!isImporter) return res.status(401).json({ message: "this user is not importer" })
        req.importer = isImporter
        nxt()
    }
)


export const checkImporterVerified=asyncHandler(
    async(req,res,nxt)=>{
        const importer=req.importer
        if(importer.verified=='0' || !importer.emailActivated) return res.status(403).json({message:"importer is not verified or repEmail is not activated"})
        nxt()
    }
)

