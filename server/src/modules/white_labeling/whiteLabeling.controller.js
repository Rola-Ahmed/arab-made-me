
import { PrivateLabeling } from "../../database/models/private_labeling.model.js";
import { SpecialManufacturingRequest } from "../../database/models/special_manufacturing.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";
import { sendNotificationMail } from "../../utils/email.js"
import { WhiteLabeling } from "../../database/models/white_labeling.model.js";

export const addWhiteLabeling = asyncHandler(
    async (req, res, nxt) => {
        const whiteLabeling = await WhiteLabeling.create({ ...req.body, importerId: req.importer.id })
        if (!whiteLabeling) return res.json({ message: "private labeling not created" })

        await sendNotificationMail("factory", req.body.factoryId, "Private Label")
        return res.json({ message: "done", whiteLabeling })
    }
)



export const uploadMedia = crudOps.uploadMedia('whiteLabeling', { 'docs': 'array' })

export const getWhiteLabeling = crudOps.getOne(WhiteLabeling)

export const getWhiteLabelings = crudOps.getAll(WhiteLabeling)

export const deleteWhiteLabeling = crudOps.deleteFromReq('whiteLabeling', { 'docs': 'array' })

export const deleteWhiteLabelingFromAdmin = crudOps.deleteModel(WhiteLabeling, { 'docs': 'array' })

export const updateWhiteLabeling = crudOps.updateModel(WhiteLabeling)

export const updateOneFile = crudOps.updateOneInMedia(WhiteLabeling, 'whiteLabeling', 'docs', 3)
