import { Router } from "express";
import * as categoriesController from "./categories.controller.js"
import { checkUserToken } from "../../middelwares/chcek_user_token.js";
import { allowedTo } from "../../middelwares/authorization.js";
export const categoriesRouter=Router()

categoriesRouter.post("/add",checkUserToken,allowedTo(['admin']),categoriesController.addCategory)

categoriesRouter.get("/",categoriesController.getCategories)

categoriesRouter.get("/products/:id",categoriesController.productsOfCategory)

categoriesRouter.put("/update/:id",checkUserToken,allowedTo(['admin']),categoriesController.updateCategory)

categoriesRouter.delete("/:id",checkUserToken,allowedTo(['admin']),categoriesController.deleteCategory)