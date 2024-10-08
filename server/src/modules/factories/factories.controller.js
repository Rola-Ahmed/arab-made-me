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
import { WhiteLabeling } from "../../database/models/white_labeling.model.js";
import { SpecialManufacturingRequest } from "../../database/models/special_manufacturing.model.js";
import { Visit } from "../../database/models/visit.model.js";
import { searchFiltering } from "../../utils/search/api_features.js";
import { checkLoginTimes } from "../login_times/login_times.js";
import { FactoryDataTypes } from "./factories.dataTypes.js";
import { QueryTypes } from "sequelize"; // Make sure to import QueryTypes if it's not already

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
  const {
    taxRegisterationNumber,
    commercialRegisterationNumber,
    IndustrialLicenseNumber,
    IndustrialRegistrationNumber,
    BusinessRegistrationNumber,
  } = req.body;

  // const checks = [
  //   { field: "taxRegisterationNumber", value: taxRegisterationNumber },
  //   {
  //     field: "commercialRegisterationNumber",
  //     value: commercialRegisterationNumber,
  //   },
  //   { field: "IndustrialLicenseNumber", value: IndustrialLicenseNumber },
  //   {
  //     field: "IndustrialRegistrationNumber",
  //     value: IndustrialRegistrationNumber,
  //   },
  //   { field: "BusinessRegistrationNumber", value: BusinessRegistrationNumber },
  // ];

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
  // console.log(
  //   "req, res-------------------------------",
  //   req.body,
  //   "--------",
  //   req.factory
  // );

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

export const productsOfFactory = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;
  const searchFilters = searchFiltering(req.query);

  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.size, 10) || 10; // Default limit to 10
  const offset = (page - 1) * limit; // Calculate offset based on page

  searchFilters.whereConditions.push({ factoryId: id });
  const products = await Product.findAll({
    where: searchFilters.whereConditions,
    offset,
    limit,
    order:
      searchFilters.order.length > 0
        ? searchFilters.order
        : [["createdAt", "DESC"]],
    // include: "factory",
    include: [
      {
        model: Factory, // Assuming 'Factory' is the related model
        attributes: ["id", "city", "country", "coverImage", "sectorId"], // Specific columns from 'factory'
      },
    ],
  });

  const totalProducts = await Product.count({
    where: searchFilters.whereConditions,
  });

  return res.status(200).json({
    message: "done",
    products,
    pagination: {
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    },
  });
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
export const getWhiteLabelings = crudOps.getAllForFactory(
  WhiteLabeling,
  "whiteLabelings"
);

export const getSPMF = crudOps.getAllForFactory(
  SpecialManufacturingRequest,
  "spmfs"
);

export const getVisits = crudOps.getAllForFactory(Visit, "visits");

export const getFactoriesWithProducts = asyncHandler(async (req, res, next) => {
  const searchFilters = searchFiltering(req.query);

  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.size, 10) || 10; // Default limit to 10

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
        limit: 20,
        separate: true, // Fetch products in a separate query to support limit
        attributes: ["id", "name", "coverImage"], // Product attributes to include
      },
    ],
  });

  const totalFactories = await Factory.count({
    where: searchFilters.whereConditions,
  });

  return res.status(200).json({
    message: "done",
    factories,
    pagination: {
      totalFactories,
      totalPages: Math.ceil(totalFactories / limit),
      currentPage: page,
    },
  });
});

export const getTotalNotificationsOrigi = asyncHandler(
  async (req, res, nxt) => {
    const { id } = req.params;

    // Query to fetch only Whitelabels and Privatelabels associated with the factoryId
    const data = await Factory.findOne({
      where: { id: id }, // Use factoryId to find the correct factory
      attributes: [], // Exclude the Factory data itself (no attributes selected)
      include: [
        {
          model: WhiteLabeling, // Include associated Whitelabels
          attributes: ["id", "createdAt"], // Only fetch Whitelabel fields
        },
        {
          model: PrivateLabeling, // Include associated Privatelabels
          attributes: ["id", "createdAt"], // Only fetch Privatelabel fields
        },
      ],
    });

    if (!data) {
      return res.status(404).json({ message: "Factory not found" });
    }

    return res.status(200).json({
      message: "done",
      data,
    });
  }
);

export const getTotalNotifications22 = asyncHandler(async (req, res, nxt) => {
  // const { id } = req.params;
  const id = req.user.factoryId;
  console.log("idddd", id);

  // Use Sequelize's `query` method to run a raw SQL query
  const data = await sequelize.query(
    `
SELECT id, "createdAt" AS createdAt, "productName" AS productName , 'whiteLabel' AS notificationType, status::text AS status
  FROM "whiteLabelings"
  WHERE "factoryId" = :id

  UNION ALL

  SELECT id, "createdAt" AS createdAt, "productName" AS productName,'privateLabel' AS notificationType, status::text AS status
  FROM "privateLabelings"
  WHERE "factoryId" = :id

  UNION ALL

  SELECT id, "createdAt" AS createdAt, "productName" AS productName,'offers' AS notificationType, status::text AS status
  FROM "sourcingOffers"
  WHERE "factoryId" = :id


   UNION ALL

  SELECT id, "createdAt" AS createdAt, "productName" AS productName,'offers' AS notificationType, status::text AS status
  FROM "sourcingOffers"
  WHERE "factoryId" = :id


    UNION ALL

  SELECT id, "createdAt" AS createdAt, "productName" AS productName,'RFQs' AS notificationType, status::text AS status
  FROM "quotationRequests"
  WHERE "factoryId" = :id


   UNION ALL

  SELECT id, "createdAt" AS createdAt, "productName" AS productName,'smfr' AS notificationType, status::text AS status
  FROM "specialManufacturingRequests"
  WHERE "factoryId" = :id


   UNION ALL

  SELECT id, "createdAt" AS createdAt, "productName" AS productName,'po' AS notificationType, status::text AS status
  FROM "purchasingOrders"
  WHERE "factoryId" = :id


    UNION ALL

  SELECT id, "createdAt" AS createdAt, "productName" AS productName,'po' AS notificationType, status::text AS status
  FROM "purchasingOrders"
  WHERE "factoryId" = :id


   UNION ALL

  SELECT id, "createdAt" AS createdAt, "purpose" AS productName,'visit' AS notificationType, status::text AS status
  FROM "visits"
  WHERE "factoryId" = :id


  ORDER BY createdAt ASC
  `,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  // if (!data.length) {
  //   return res.status(404).json({ message: "Factory not found" });
  // }

  return res.status(200).json({
    message: "done",
    data,
  });
});

export const getTotalNotifications = asyncHandler(async (req, res, nxt) => {
  // const { id } = req.params;
  const id = req.user.factoryId;
  console.log("idddd", id);

  // Use Sequelize's `query` method to run a raw SQL query
  const data = await sequelize.query(
    `
    SELECT 
      wl.id, 
      wl."createdAt" AS createdAt, 
      wl."productName" AS productName, 
      'whiteLabel' AS notificationType, 
      wl.status::text AS status, 
      i."repName" AS importerName, 
      i."image" AS importerImage
    FROM "whiteLabelings" wl
    JOIN "importers" i ON wl."importerId" = i."id"
    WHERE wl."factoryId" = :id
  
    UNION ALL
  
    SELECT 
      pl.id, 
      pl."createdAt" AS createdAt, 
      pl."productName" AS productName, 
      'privateLabel' AS notificationType, 
      pl.status::text AS status, 
      i."repName" AS importerName, 
      i."image" AS importerImage
    FROM "privateLabelings" pl
    JOIN "importers" i ON pl."importerId" = i."id"
    WHERE pl."factoryId" = :id
  
  
  
    UNION ALL
  
    SELECT 
      qr.id, 
      qr."createdAt" AS createdAt, 
      qr."productName" AS productName, 
      'RFQs' AS notificationType, 
      qr.status::text AS status, 
      i."repName" AS importerName, 
      i."image" AS importerImage
    FROM "quotationRequests" qr
    JOIN "importers" i ON qr."importerId" = i."id"
    WHERE qr."factoryId" = :id
  
    UNION ALL
  
    SELECT 
      smr.id, 
      smr."createdAt" AS createdAt, 
      smr."productName" AS productName, 
      'smfr' AS notificationType, 
      smr.status::text AS status, 
      i."repName" AS importerName, 
      i."image" AS importerImage
    FROM "specialManufacturingRequests" smr
    JOIN "importers" i ON smr."importerId" = i."id"
    WHERE smr."factoryId" = :id
  
    UNION ALL
  
    SELECT 
      po.id, 
      po."createdAt" AS createdAt, 
      po."productName" AS productName, 
      'po' AS notificationType, 
      po.status::text AS status, 
      i."repName" AS importerName, 
      i."image" AS importerImage
    FROM "purchasingOrders" po
    JOIN "importers" i ON po."importerId" = i."id"
    WHERE po."factoryId" = :id
  
    UNION ALL
  
    SELECT 
      v.id, 
      v."createdAt" AS createdAt, 
      v."purpose" AS productName, 
      'visit' AS notificationType, 
      v.status::text AS status, 
      i."repName" AS importerName, 
      i."image" AS importerImage
    FROM "visits" v
    JOIN "importers" i ON v."importerId" = i."id"
    WHERE v."factoryId" = :id
  
    ORDER BY createdAt ASC
    `,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  // if (!data.length) {
  //   return res.status(404).json({ message: "Factory not found" });
  // }

  return res.status(200).json({
    message: "done",
    data,
  });
});

export const getUnReadNotifications = asyncHandler(async (req, res, nxt) => {
  // const { id } = req.params;
  const id = req.user.factoryId;
  console.log("idddd", id);

  // Use Sequelize's `query` method to run a raw SQL query
  const data = await sequelize.query(
    `
    SELECT 
      notificationType, 
      COUNT(CASE WHEN status = 'open' THEN 1 END) AS openStatusCount
    FROM (
      SELECT 
        'whiteLabel' AS notificationType, 
        wl.status::text AS status
      FROM "whiteLabelings" wl
      WHERE wl."factoryId" = :id
    
      UNION ALL
    
      SELECT 
        'privateLabel' AS notificationType, 
        pl.status::text AS status
      FROM "privateLabelings" pl
      WHERE pl."factoryId" = :id
    
      UNION ALL
    
      SELECT 
        'RFQs' AS notificationType, 
        qr.status::text AS status
      FROM "quotationRequests" qr
      WHERE qr."factoryId" = :id
    
      UNION ALL
    
      SELECT 
        'smfr' AS notificationType, 
        smr.status::text AS status
      FROM "specialManufacturingRequests" smr
      WHERE smr."factoryId" = :id
    
      UNION ALL
    
      SELECT 
        'po' AS notificationType, 
        po.status::text AS status
      FROM "purchasingOrders" po
      WHERE po."factoryId" = :id
    
      UNION ALL
    
      SELECT 
        'visit' AS notificationType, 
        v.status::text AS status
      FROM "visits" v
      WHERE v."factoryId" = :id
    ) AS notifications
    GROUP BY notificationType
    ORDER BY notificationType ASC
    `,
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  // if (!data.length) {
  //   return res.status(404).json({ message: "Factory not found" });
  // }

  return res.status(200).json({
    message: "done",
   notifications: data,
  });
});
