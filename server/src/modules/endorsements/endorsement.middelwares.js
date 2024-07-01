

import { Endorsement } from "../../database/models/endorsment.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkEndorsementForImporter = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.params
        const endorsement = await Endorsement.findOne({
            where: {
                id,
                importerId: req.importer.id
            }
        })

        if (!endorsement) return res.json({ message: "endorsement not found or it's not assoicated for that importer" })

        req.endorsement = endorsement
        nxt()
    }
)

