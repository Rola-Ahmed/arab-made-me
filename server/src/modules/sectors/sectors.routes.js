import { Router } from "express";
import * as sectorsController from "./sectors.controller.js"
import * as sectorsValidation from "./sectors.validation.js"
import { appValidator } from "../../middelwares/app.validation.js";
import { checkUserToken } from "../../middelwares/chcek_user_token.js";
import { allowedTo } from "../../middelwares/authorization.js";
import { multerUploader } from "../../utils/multer.js";
export const sectorsRoute=Router()


const fields=[
    {name:'image',maxCount:1},
]
const types={
    image:'image',
}

sectorsRoute.post("/add",
checkUserToken,allowedTo(['admin']),
appValidator(sectorsValidation.addSectorValidationSchema),
//multerUploader('sectors',types).fields(fields),
sectorsController.addSector
)

sectorsRoute.put("/image/:id",checkUserToken,allowedTo(['admin']),multerUploader('sectors',types).fields(fields),sectorsController.uploadMedia)

sectorsRoute.get("/",sectorsController.getSectors)
sectorsRoute.get("/getAllWithProductLength",sectorsController.getAllWithProductLength)

sectorsRoute.get("/:id",sectorsController.getSector)

sectorsRoute.get("/products/:id",sectorsController.productsOfSector)

sectorsRoute.get("/multiple/products",sectorsController.productsOfSectors)

sectorsRoute.put("/update/:id",checkUserToken,allowedTo(['admin']),sectorsController.updateSector)

sectorsRoute.delete("/delete/:id",checkUserToken,allowedTo(['admin']),sectorsController.deleteSector)