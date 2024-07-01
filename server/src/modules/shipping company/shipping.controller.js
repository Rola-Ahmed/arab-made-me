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
import { ShippingCompany } from "../../database/models/shipping_company.model.js";

export const addShippingCompany = asyncHandler(
    async (req, res, nxt) => {
        const { country, city } = req.body
        

        const isShippingCompany = await ShippingCompany.findOne({where:{userId:req.user.id}})
        if(isShippingCompany) return res.status(400).json({message:"this user has a shiiping company"})

        const shippingCompany = await ShippingCompany.create({ ...req.body, userId: req.user.id,emailActivated:true })

        
            await req.user.update({ role: 'shippingCompany', country, city ,shippingCompanyId: shippingCompany.id})


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
        return res.status(201).json({ message: "done", shippingCompany })
    }
)


export const verfiyShippingCompany = asyncHandler(
    async (req, res, nxt) => {
        const shippingCompany = await ShippingCompany.findByPk(req.params.id)
        if (!shippingCompany) return res.json({ message: "ShippingCompany not found" })
        if (
            !shippingCompany.legalDocs || !shippingCompany.commercialRegisterationNumber|| !shippingCompany.emailActivated
        )
            return res.json({ message: "complete data first" })

        await shippingCompany.update({ verified: '1' })
        return res.json({ message: "done", shippingCompany })
    }
)


export const getShippingCompanies = crudOps.getAll(ShippingCompany)

export const updateShippingCompany =asyncHandler(
    async(req,res,nxt)=>{
        await req.shippingCompany.update(req.body)
        // if(req.body.repEmail){
        //     const token = jwt.sign({
        //         id: req.shippingCompany.id,
        //         email: req.shippingCompany.repEmail
        //     }, process.env.SECRET_KEY, { expiresIn: "10 m" })
        //     const newToken = jwt.sign({
        //         id: req.shippingCompany.id,
        //         email: req.shippingCompany.repEmail
        //     }, process.env.SECRET_KEY, { expiresIn: "20 m" })
        //     await sendMail({
        //         to: req.shippingCompany.repEmail,
        //         subject: "Activation Email From Arab-Made",
        //         html: `
        //         <a href="${req.protocol}://${req.hostname}/shippingCompany/emailActivation?action=${token}">Confirm Accaount</a>
        //             <br>
        //             <br>
        //             `,
        //             // <a href="${req.protocol}://${req.headers.host}/api/v1/ShippingCompanys/newConfirmEmail/${newToken}">resend confirmation mail</a>
        //     })
        // }

        return res.json({message:"done",shippingCompany:req.shippingCompany})
    }
)


export const deleteShippingCompanyFromProfile = crudOps.deleteFromReq('shippingCompany',{'legalDocs':'array','image':'file'})
export const deleteShippingCompanyFromAdmin = crudOps.deleteModel(ShippingCompany,{'legalDocs':'array','image':'file'})

export const getShippingCompanyData = crudOps.getOne(ShippingCompany)

export const updateFromAdmin = crudOps.updateModel(ShippingCompany)

export const confirmEmail = crudOps.confirmEmail(ShippingCompany,'shippingCompany')

export const resendConfirmationMail = crudOps.resendConfirmationMail(ShippingCompany,'shippingCompany','shippingCompany/emailActivation?action=','repEmail')

export const addMedia = crudOps.uploadMedia('shippingCompany',{'legalDocs':'array','image':'file'})

export const updateOneLegalDoc = crudOps.updateOneInMedia(ShippingCompany,'shippingCompany','legalDocs',5)

export const updateOneImage = crudOps.updateOneInMedia(ShippingCompany,'shippingCompany','images',5)


// export const getPos=crudOps.getAllForShippingCompany(PurchasingOrder,'pos')

// export const getRFQs=crudOps.getAllForShippingCompany(QuotationRequest,'rfqs')

// export const getQuotations=crudOps.getAllForShippingCompany(Quotation,'quotations')

// export const getSourcingRequest=crudOps.getAllForShippingCompany(SourcingRequest,'sourcingRequests')

// export const getPrivateLabelings=crudOps.getAllForShippingCompany(PrivateLabeling,'privateLabelings')

// export const getSPMF=crudOps.getAllForShippingCompany(SpecialManufacturingRequest,'spmfs')

// export const getVisits=crudOps.getAllForShippingCompany(Visit,'visits')

