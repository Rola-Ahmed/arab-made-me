import { SourcingRequest } from "../../../database/models/sourcing_hub/request.model.js";
import { crudOps } from "../../../utils/crud_ops.js";
import { asyncHandler } from "../../../utils/error_handling.js";

export const addSourcingRequest = asyncHandler(
    async (req, res, nxt) => {
        const sourcingRequest=await SourcingRequest.create({...req.body,importerId:req.importer.id})
        return res.json({message:"done",sourcingRequest})
    }
)


export const uploadMedia=crudOps.uploadMedia('sourcingRequest',{'docs':'array'})

export const getSourcingRequest=crudOps.getOne(SourcingRequest)

export const getSourcingRequests=crudOps.getAll(SourcingRequest)

export const deleteSourcingRequest=crudOps.deleteFromReq('sourcingRequest',{'docs':'array'})

export const deleteSourcingRequestFromAdmin=crudOps.deleteModel(SourcingRequest,{'docs':'array'})

export const updateSourcingRequest=crudOps.updateModel(SourcingRequest)

export const updateOneFile=crudOps.updateOneInMedia(SourcingRequest,'sourcingRequest','docs',3)