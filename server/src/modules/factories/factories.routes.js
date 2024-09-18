import { Router } from "express";
import * as factoriesController from "./factories.controller.js";
import * as factoriesValidationSchemas from "./factories.validation.js";
import { checkUserToken } from "../../middelwares/chcek_user_token.js";
import { appValidator } from "../../middelwares/app.validation.js";
import { allowedTo } from "../../middelwares/authorization.js";
import {
  checkFactoryVerified,
  checkUserHasFactory,
} from "./factories.middelwares.js";
import { multerUploader } from "../../utils/multer.js";
import { checkMediaLength } from "../../middelwares/media_length.js";
import { notForAdmin } from "../../middelwares/not_for_admin.js";
import { sendingEmailLimit } from "../../middelwares/sendin_email_limit.js";
import { FactoryDataTypes } from "./factories.dataTypes.js";

export const factoriesRouter = Router();

factoriesRouter.post(
  "/add",
  checkUserToken,
  notForAdmin,
  appValidator(factoriesValidationSchemas.addFactorySchema),
  factoriesController.addFactory
);

factoriesRouter.get("/confirmEmail/:token", factoriesController.confirmEmail);
factoriesRouter.get(
  "/resendConfirmationMail/:id",
  sendingEmailLimit,
  factoriesController.resendConfirmationMail
);

factoriesRouter.get("/", factoriesController.getFactories);

factoriesRouter.get("/products/:id", factoriesController.productsOfFactory);
factoriesRouter.get(
  "/factorieswithProducts",
  factoriesController.getFactoriesWithProducts
);

factoriesRouter.put(
  "/verify/:id",
  checkUserToken,
  allowedTo(["admin"]),
  factoriesController.verfiyFactory
);

factoriesRouter.get("/:id", factoriesController.getFactoryData);

factoriesRouter.put(
  "/update/fromUser",
  checkUserToken,
  checkUserHasFactory,
  appValidator(factoriesValidationSchemas.updateFactorySchema),
  factoriesController.updateFactory
);

//appValidator(factoriesValidationSchemas.updateFactorySchema)
factoriesRouter.put(
  "/update/fromAdmin/:id",
  checkUserToken,
  allowedTo(["admin"]),
  factoriesController.updateFromAdmin
);

factoriesRouter.delete(
  "/delete/fromAdmin/:id",
  checkUserToken,
  allowedTo(["admin"]),
  factoriesController.deleteFactoryFromAdmin
);

factoriesRouter.delete(
  "/delete/fromUser",
  checkUserToken,
  checkUserHasFactory,
  factoriesController.deleteFactoryFromProfile
);

const fields = [
  { name: "images", maxCount: FactoryDataTypes.images.max },
  { name: "coverImage", maxCount: FactoryDataTypes.coverImage.max },
  { name: "coverVideo", maxCount: FactoryDataTypes.coverVideo.max },
  {
    name: "qualityCertificates",
    maxCount: FactoryDataTypes.qualityCertificates.max,
  },
  { name: "legalDocs", maxCount: FactoryDataTypes.legalDocs.max },
];
const types = {
  images: FactoryDataTypes.images.fileType,
  coverImage: FactoryDataTypes.coverImage.fileType,
  coverVideo: FactoryDataTypes.coverVideo.fileType,
  qualityCertificates: FactoryDataTypes.qualityCertificates.fileType,
  legalDocs: FactoryDataTypes.legalDocs.fileType,
};
factoriesRouter.put(
  "/media",
  checkUserToken,
  checkUserHasFactory,
  multerUploader(`factories`, types).fields(fields),
  factoriesController.addMedia
);

const fields2 = [{ name: "legalDocs", maxCount: 1 }];

factoriesRouter.patch(
  "/update/legalDoc",
  checkUserToken,
  checkUserHasFactory,
  multerUploader(`factories`, FactoryDataTypes.legalDocs.fileType).fields(
    fields2
  ),
  factoriesController.updateOneLegalDoc
);

factoriesRouter.patch(
  "/update/image",
  checkUserToken,
  checkUserHasFactory,
  multerUploader("factories", {
    images: FactoryDataTypes.images.fileType,
  }).fields([{ name: "images", maxCount: 1 }]),
  factoriesController.updateOneImage
);

factoriesRouter.patch(
  "/update/qualityCertificate",
  checkUserToken,
  checkUserHasFactory,
  multerUploader("factories", {
    qualityCertificates: FactoryDataTypes.qualityCertificates.fileType,
  }).fields([{ name: "qualityCertificates", maxCount: 1 }]),
  factoriesController.updateOneQualityCertificate
);

factoriesRouter.get(
  "/factory/pos",
  checkUserToken,
  checkUserHasFactory,
  checkFactoryVerified,
  factoriesController.getPos
);

factoriesRouter.get(
  "/factory/rfqs",
  checkUserToken,
  checkUserHasFactory,
  checkFactoryVerified,
  factoriesController.getRFQs
);

factoriesRouter.get(
  "/factory/quotations",
  checkUserToken,
  checkUserHasFactory,
  checkFactoryVerified,
  factoriesController.getQuotations
);

factoriesRouter.get(
  "/factory/privateLabelings",
  checkUserToken,
  checkUserHasFactory,
  checkFactoryVerified,
  factoriesController.getPrivateLabelings
);

factoriesRouter.get(
  "/factory/spmfs",
  checkUserToken,
  checkUserHasFactory,
  checkFactoryVerified,
  factoriesController.getSPMF
);

factoriesRouter.get(
  "/factory/offers",
  checkUserToken,
  checkUserHasFactory,
  checkFactoryVerified,
  factoriesController.getOffers
);

factoriesRouter.get(
  "/factory/visits",
  checkUserToken,
  checkUserHasFactory,
  checkFactoryVerified,
  factoriesController.getVisits
);
