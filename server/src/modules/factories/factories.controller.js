import { User } from "../../database/models/user.model.js";
import { sendMail } from "../../utils/email.js";
import { asyncHandler } from "../../utils/error_handling.js";
import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Factory } from "../../database/models/factory.model.js";
import { sequelize } from "../../database/connection.js";
import { Importer } from "../../database/models/importer.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import { Product } from "../../database/models/product.model.js";
import { Op } from "sequelize";
import PurchasingOrder from "../../database/models/purchasin_order.model.js";
import QuotationRequest from "../../database/models/qoutation_request.model.js";
import Quotation from "../../database/models/quotation.model.js";
import { SourcingOffer } from "../../database/models/sourcing_hub/offer.js";
import { PrivateLabeling } from "../../database/models/private_labeling.model.js";
import { SpecialManufacturingRequest } from "../../database/models/special_manufacturing.model.js";
import { Visit } from "../../database/models/visit.model.js";
import { searchFiltering } from "../../utils/search/api_features.js";
import { checkLoginTimes } from "../login_times/login_times.js";
import { FactoryDataTypes } from "./factories.dataTypes.js";

export const addFactory = asyncHandler(async (req, res, nxt) => {
  const { country } = req.body;

  const factoryExisit = await Factory.findOne({
    where: { userId: req.user.id },
  });
  if (factoryExisit) return res.json({ message: "this user has a factory" });

  const importer = await Importer.findOne({ where: { userId: req.user.id } });
  if (importer)
    return res.status(401).json({ message: "this user is an importer" });

  console.log("here before");
  const factory = await Factory.create({
    ...req.body,
    userId: req.user.id,
    emailActivated: true,
  });

  await req.user.update({ role: "factory", country, factoryId: factory.id });

  // const token = jwt.sign({
  //     id: factory.id,
  //     email: factory.repEmail
  // }, process.env.SECRET_KEY, { expiresIn: "10 m" })
  // const newToken = jwt.sign({
  //     id: factory.id,
  //     email: factory.repEmail
  // }, process.env.SECRET_KEY, { expiresIn: "20 m" })
  // await sendMail({
  //     to: factory.repEmail,
  //     subject: "Activation Email From Arab-Made",
  //     html: `
  //         <a href="${req.protocol}://${req.headers.host}/factory/emailActivation?action=${token}">Confirm Accaount</a>
  //         <br>
  //         <br>
  //         `,
  //     // <a href="${req.protocol}://${req.headers.host}/api/v1/factories/newConfirmEmail/${newToken}">resend confirmation mail</a>
  // })//api/v1/factories/confirmEmail

  return res.status(201).json({ message: "done", factory });
});

export const verfiyFactory = asyncHandler(async (req, res, nxt) => {
  const factory = await Factory.findByPk(req.params.id);
  if (!factory) return res.json({ message: "factory not found" });
  if (
    !factory.legalDocs ||
    !factory.commercialRegisterationNumber ||
    !factory.taxRegisterationNumber ||
    !factory.qualityCertificates ||
    !factory.emailActivated
  )
    return res.json({
      message: "complete data first and activate representative email",
    });

  await factory.update({ verified: "1" });
  return res.json({ message: "done", factory });
});

export const getFactories = crudOps.getAll(Factory);

function splitByCapitalLetters(inputString) {
  // Replace capital letters with a separator and the letter itself
  const result = inputString.replace(/([A-Z])/g, " $1").trim();
  return result;
}

export const updateFactory = asyncHandler(async (req, res, nxt) => {
  console.log("req, res-------------------------------");
  console.log(
    "req, res-------------------------------",
    req.body,
    "--------",
    req.factory
  );

  const {
    taxRegisterationNumber,
    commercialRegisterationNumber,
    IndustrialLicenseNumber,
    IndustrialRegistrationNumber,
    BusinessRegistrationNumber,
  } = req.body;

  const checks = [
    { field: "taxRegisterationNumber", value: taxRegisterationNumber },
    {
      field: "commercialRegisterationNumber",
      value: commercialRegisterationNumber,
    },
    { field: "IndustrialLicenseNumber", value: IndustrialLicenseNumber },
    {
      field: "IndustrialRegistrationNumber",
      value: IndustrialRegistrationNumber,
    },
    { field: "BusinessRegistrationNumber", value: BusinessRegistrationNumber },
  ];

  // let unuqiueVlaitation = [];

  // for (const check of checks) {
  //   const existingRecord = await Factory.findOne({
  //     where: {
  //       [check.field]: check.value ,
  //     },
  //   });

  //   if (existingRecord) {
  //     console.log(`The ${check.field} (${check.value}) is already in use.`);
  //     unuqiueVlaitation.push(splitByCapitalLetters(check.field));
  //     // return
  //   }
  // }

  // if (unuqiueVlaitation.length!=0) return res.json({ message: `The ${unuqiueVlaitation.join(", ")} already exisit and it must be unique values ` });

  await req.factory.update(req.body);
  console.log(
    "req, res-------------------------------",
    req.body,
    "--------",
    req.factory
  );

  if (req.body.repEmail && (await checkLoginTimes(req.user.id))) {
    const token = jwt.sign(
      {
        id: req.factory.id,
        email: req.factory.repEmail,
      },
      process.env.SECRET_KEY,
      { expiresIn: "10 m" }
    );
    // const newToken = jwt.sign({
    //     id: req.factory.id,
    //     email: req.factory.repEmail
    // }, process.env.SECRET_KEY, { expiresIn: "20 m" })
    await sendMail({
      to: req.factory.repEmail,
      subject: "Activation Email From Arab-Made",
      html: `
                    <a href="${req.protocol}://${req.hostname}/factory/emailActivation?action=${token}">Confirm Accaount</a>
                    <br>
                    <br>
                    `,
      // <a href="${req.protocol}://${req.headers.host}/api/v1/factories/newConfirmEmail/${newToken}">resend confirmation mail</a>
    });
  }

  return res.json({ message: "done", factory: req.factory });
});

export const deleteFactoryFromProfile = crudOps.deleteFromReq("factory", {
  images: FactoryDataTypes.images.dataType,
  legalDocs: FactoryDataTypes.legalDocs.dataType,
  qualityCertificates: FactoryDataTypes.qualityCertificates.dataType,
  coverImage: FactoryDataTypes.coverImage.dataType,
  coverVideo: FactoryDataTypes.coverVideo.dataType,
});

export const deleteFactoryFromAdmin = crudOps.deleteModel(Factory, {
  images: FactoryDataTypes.images.dataType,
  legalDocs: FactoryDataTypes.legalDocs.dataType,
  qualityCertificates: FactoryDataTypes.qualityCertificates.dataType,
  coverImage: FactoryDataTypes.coverImage.dataType,
  coverVideo: FactoryDataTypes.coverVideo.dataType,
});

export const getFactoryData = crudOps.getOne(Factory);

export const addMedia = crudOps.uploadMedia("factory", {
  images: FactoryDataTypes.images.dataType,
  legalDocs: FactoryDataTypes.legalDocs.dataType,
  qualityCertificates: FactoryDataTypes.qualityCertificates.dataType,
  coverImage: FactoryDataTypes.coverImage.dataType,
  coverVideo: FactoryDataTypes.coverVideo.dataType,
});

export const updateOneImage = crudOps.updateOneInMedia(
  Factory,
  "factory",
  "images",
  FactoryDataTypes.images.max
);
export const updateOneLegalDoc = crudOps.updateOneInMedia(
  Factory,
  "factory",
  "legalDocs",
  FactoryDataTypes.legalDocs.max
);

export const updateOneQualityCertificate = crudOps.updateOneInMedia(
  Factory,
  "factory",
  "qualityCertificates",
  FactoryDataTypes.qualityCertificates.max
);

export const updateFromAdmin = crudOps.updateModel(Factory);

//uploads/factories/2/qualityCertificates-1699021329969-PBBJKZ8zNzEmxmzzDXeKT
//uploads/factories/2/images-1699021329850-wBltzRiQnWiLLDGDk7liU

export const productsOfFactory = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;
  const searchFilters = searchFiltering(req.query);

  searchFilters.whereConditions.push({ factoryId: id });
  const products = await Product.findAll({
    where: searchFilters.whereConditions,
    offset: searchFilters.offset,
    limit: searchFilters.limit,
    order:
      searchFilters.order.length > 0
        ? searchFilters.order
        : [["createdAt", "DESC"]],
    include: "factory",
  });

  return res.status(200).json({ message: "done", products });
});

export const confirmEmail = crudOps.confirmEmail(Factory, "factory");

export const resendConfirmationMail = crudOps.resendConfirmationMail(
  Factory,
  "factory",
  "factory/emailActivation?action=",
  "repEmail"
);

export const getPos = crudOps.getAllForFactory(PurchasingOrder, "pos");

export const getRFQs = crudOps.getAllForFactory(QuotationRequest, "rfqs");

export const getQuotations = crudOps.getAllForFactory(Quotation, "quotations");

export const getOffers = crudOps.getAllForFactory(SourcingOffer, "offers");

export const getPrivateLabelings = crudOps.getAllForFactory(
  PrivateLabeling,
  "privateLabelings"
);

export const getSPMF = crudOps.getAllForFactory(
  SpecialManufacturingRequest,
  "spmfs"
);

export const getVisits = crudOps.getAllForFactory(Visit, "visits");

export const getFactoriesWithProducts = asyncHandler(async (req, res, next) => {
  let filter;
  if (req.query.filter) {
    filter = {
      [Op.or]: [
        sequelize.where(
          sequelize.fn("LOWER", sequelize.col("products.name")),
          "LIKE",
          sequelize.fn("LOWER", `%${req.query.filter}%`)
        ),
        sequelize.where(
          sequelize.fn("LOWER", sequelize.col("products.description")),
          "LIKE",
          sequelize.fn("LOWER", `%${req.query.filter}%`)
        ),
      ],
    };
    req.query.filter = null;
  }

  const searchFilters = searchFiltering(req.query);


  if (filter) {
    searchFilters.whereConditions.push(filter);
  }

  // Fetch factories along with their associated products
  const factories = await Factory.findAll({
    where: searchFilters.whereConditions,
    offset: searchFilters.offset,
    limit: searchFilters.limit,
    order:
      searchFilters.order.length > 0
        ? searchFilters.order
        : [["createdAt", "DESC"]],
    include: [
      {
        model: Product,
        as: "products",
        attributes: ["id", "name", "description", "price"], // Product attributes to include
      },
      
    ],
  });

  return res.status(200).json({ message: "done", factories });
});
