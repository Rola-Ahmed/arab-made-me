
import { Visit } from "../../database/models/visit.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkVisitForImporter = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.params
        const visit = await Visit.findOne({
            where: {
                id,
                importerId: req.importer.id
            }
        })

        if (!visit) return res.json({ message: "visit not found or it's not assoicated for that importer" })

        req.visit = visit
        nxt()
    }
)

export const checkVisitForFactory = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.params
        const visit = await Visit.findOne({
            where: {
                id,
                factoryId: req.factory.id
            }
        })

        if (!visit) return res.json({ message: "visit not found or it's not assoicated for that factroy" })

        req.visit = visit
        nxt()
    }
)
