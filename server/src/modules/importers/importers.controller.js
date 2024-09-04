import { User } from "../../database/models/user.model.js";
import { sendMail } from "../../utils/email.js";
import { asyncHandler } from "../../utils/error_handling.js";
import jwt, { decode } from "jsonwebtoken"
import bcrypt from "bcrypt"
import { sequelize } from "../../database/connection.js";
import { Importer } from "../../database/models/importer.model.js";
import { Factory } from "../../database/models/factory.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import PurchasingOrder from "../../database/models/purchasin_order.model.js";
import QuotationRequest from "../../database/models/qoutation_request.model.js";
import Quotation from "../../database/models/quotation.model.js";
import { SourcingOffer } from "../../database/models/sourcing_hub/offer.js";
import { PrivateLabeling } from "../../database/models/private_labeling.model.js";
import { SpecialManufacturingRequest } from "../../database/models/special_manufacturing.model.js";
import { Visit } from "../../database/models/visit.model.js";
import { SourcingRequest } from "../../database/models/sourcing_hub/request.model.js";

export const addImporter = asyncHandler(
    async (req, res, nxt) => {
        const { country, city } = req.body
        const importerExisit = await Importer.findOne({ where: { userId: req.user.id } })
        if (importerExisit) return res.json({ message: "this user is an importer" })

        const factory = await Factory.findOne({where:{userId:req.user.id}})
        if(factory) return res.status(400).json({message:"this user has a factory"})

        const importer = await Importer.create({ ...req.body, userId: req.user.id,emailActivated:true })

        
            await req.user.update({ role: 'importer', country, city ,importerId: importer.id})


        // const token = jwt.sign({
        //     id: importer.id,
        //     email: importer.repEmail
        // }, process.env.SECRET_KEY, { expiresIn: "10 m" })
        // const newToken = jwt.sign({
        //     id: importer.id,
        //     email: importer.repEmail
        // }, process.env.SECRET_KEY, { expiresIn: "20 m" })
        // await sendMail({
        //     to: importer.repEmail,
        //     subject: "Activation Email From Arab-Made",
        //     html: `
        //         <a href="${req.protocol}://${req.headers.hostname}importer/emailActivation?action=${token}">Confirm Accaount</a>
        //         <br>
        //         <br>
        //         `,
        //         // <a href="${req.protocol}://${req.headers.host}/api/v1/importers/newConfirmEmail/${newToken}">resend confirmation mail</a>
        // })
        return res.status(201).json({ message: "done", importer })
    }
)


export const verfiyImporter = asyncHandler(
    async (req, res, nxt) => {
        const importer = await Importer.findByPk(req.params.id)
        if (!importer) return res.json({ message: "importer not found" })
        if (
            !importer.legalDocs || !importer.commercialRegisterationNumber|| !importer.emailActivated
        )
            return res.json({ message: "complete data first" })

        await importer.update({ verified: '1' })
        return res.json({ message: "done", importer })
    }
)


export const getImporters = crudOps.getAll(Importer)

export const updateImporter =asyncHandler(
    async(req,res,nxt)=>{
        await req.importer.update(req.body)
        if(req.body.repEmail){
            const token = jwt.sign({
                id: req.importer.id,
                email: req.importer.repEmail
            }, process.env.SECRET_KEY, { expiresIn: "10 m" })
            const newToken = jwt.sign({
                id: req.importer.id,
                email: req.importer.repEmail
            }, process.env.SECRET_KEY, { expiresIn: "20 m" })
            await sendMail({
                to: req.importer.repEmail,
                subject: "Activation Email From Arab-Made",
                html: `
                <a href="${req.protocol}://${req.hostname}/importer/emailActivation?action=${token}">Confirm Accaount</a>
                    <br>
                    <br>
                    `,
                    // <a href="${req.protocol}://${req.headers.host}/api/v1/importers/newConfirmEmail/${newToken}">resend confirmation mail</a>
            })
        }

        return res.json({message:"done",importer:req.importer})
    }
)


export const deleteImporterFromProfile = crudOps.deleteFromReq('importer',{'legalDocs':'array','image':'file'})
export const deleteImporterFromAdmin = crudOps.deleteModel(Importer,{'legalDocs':'array','image':'file'})

export const getImporterData = crudOps.getOne(Importer)

export const updateFromAdmin = crudOps.updateModel(Importer)

export const confirmEmail = crudOps.confirmEmail(Importer,'importer')

export const resendConfirmationMail = crudOps.resendConfirmationMail(Importer,'importer','importer/emailActivation?action=','repEmail')

export const addMedia = crudOps.uploadMedia('importer',{'legalDocs':'array','image':'file'})

export const updateOneLegalDoc = crudOps.updateOneInMedia(Importer,'importer','legalDocs',5)


export const getPos=crudOps.getAllForImporter(PurchasingOrder,'pos')

export const getRFQs=crudOps.getAllForImporter(QuotationRequest,'rfqs')

export const getQuotations=crudOps.getAllForImporter(Quotation,'quotations')

export const getSourcingRequest=crudOps.getAllForImporter(SourcingRequest,'sourcingRequests')

export const getPrivateLabelings=crudOps.getAllForImporter(PrivateLabeling,'privateLabelings')

export const getSPMF=crudOps.getAllForImporter(SpecialManufacturingRequest,'spmfs')

export const getVisits=crudOps.getAllForImporter(Visit,'visits')

