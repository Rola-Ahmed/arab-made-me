import { TeamMember } from "../../database/models/team_member.model.js";
import { asyncHandler } from "../../utils/error_handling.js";

export const checkTeamMemberForFactory = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.params
        const teamMember = await TeamMember.findOne({ where: { id, factoryId: req.factory.id } })
        if (!teamMember) return res.status(400).json({ message: "memebr not found or not assoicated with this factory" })
        req.teamMember = teamMember
        nxt()
    }
)