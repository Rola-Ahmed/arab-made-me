import { Router } from "express";
import * as productsController from "./products.controller.js";
import * as validationSchemas from "./products.validation.js";
import { appValidator } from "../../middelwares/app.validation.js";
import { checkUserToken } from "../../middelwares/chcek_user_token.js";
import {
  checkFactoryVerified,
  checkUserHasFactory,
} from "../factories/factories.middelwares.js";
import { allowedTo } from "../../middelwares/authorization.js";
import { checkProductForFactory } from "./products.middelwares.js";
import { multerUploader } from "../../utils/multer.js";
export const productsRouter = Router();

const fields = [
  { name: "images", maxCount: 8 },
  { name: "coverImage", maxCount: 1 },
  { name: "coverVideo", maxCount: 1 },
];
const types = {
  images: "image",
  coverImage: "image",
  coverVideo: "video",
};

productsRouter.post(
  "/add",
  checkUserToken,
  checkUserHasFactory,
  checkFactoryVerified,
  appValidator(validationSchemas.addProductValidation),
  productsController.addProduct
);

productsRouter.put(
  "/uploadMedia/:id",
  checkUserToken,
  checkUserHasFactory,
  checkProductForFactory,
  multerUploader("products", types).fields(fields),
  productsController.uploadMedia
);

productsRouter.get("/", productsController.getProducts);

productsRouter.get("/:id", productsController.getProduct);

productsRouter.put(
  "/update/fromUser/:id",
  checkUserToken,
  checkUserHasFactory,
  checkProductForFactory,
  appValidator(validationSchemas.updateProductValidation),
  productsController.updateProduct
);

productsRouter.put(
  "/update/fromAdmin/:id",
  checkUserToken,
  allowedTo(["admin"]),
  appValidator(validationSchemas.updateProductValidation),
  productsController.updateFromAdmin
);

const fields2 = [
  { name: "images", maxCount: 1 },
  { name: "coverVideo", maxCount: 1 },
];
const types2 = {
  images: "image",
  coverVideo: "video",
};
const fields3 = [
  // {name:'images',maxCount:1},
  { name: "coverVideo", maxCount: 1 },
];
const types3 = {
  images: "image",
  coverVideo: "video",
};

productsRouter.patch(
  "/update/image/:id",
  checkUserToken,
  checkUserHasFactory,
  checkProductForFactory,
  multerUploader("products", types2).fields(fields2),
  productsController.updateOneImage
);
productsRouter.patch(
  "/update/coverVideo/:id",
  checkUserToken,
  checkUserHasFactory,
  checkProductForFactory,
//   multerUploader("products", types2).fields(fields2),
  productsController.deleteOneMedia
);
// productsRouter.patch("/update/coverVideo/:id",checkUserToken,checkUserHasFactory,checkProductForFactory,productsController.deleteOneMedia)

productsRouter.delete(
  "/delete/fromUser/:id",
  checkUserToken,
  checkUserHasFactory,
  checkProductForFactory,
  productsController.deleteProduct
);

productsRouter.delete(
  "/delete/fromAdmin/:id",
  checkUserToken,
  allowedTo(["admin"]),
  productsController.deleteProduct
);
