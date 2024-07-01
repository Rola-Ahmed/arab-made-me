import { Router } from "express";
import * as teamController from "./team.controller.js"
import { checkUserToken } from "../../middelwares/chcek_user_token.js";
import { allowedTo } from "../../middelwares/authorization.js";
import { checkFactoryVerified, checkUserHasFactory } from "../factories/factories.middelwares.js";
import { checkTeamMemberForFactory } from "./team.middelwares.js";
import { multerUploader } from "../../utils/multer.js";

export const teamRouter=Router()

teamRouter.post("/add",checkUserToken,checkUserHasFactory,checkFactoryVerified,teamController.addTeamMember)

teamRouter.get("/",teamController.getTeamMembers)
teamRouter.get("/:id",teamController.getTeamMember)

teamRouter.get("/factory/:id",teamController.getTeamMembersOfFactory)

teamRouter.put("/update/fromAdmin/:id",checkUserToken,allowedTo(['admin']),teamController.updateTeamMember)

teamRouter.delete("/fromAdmin/:id",checkUserToken,allowedTo(['admin']),teamController.deleteTeamMember)

teamRouter.patch("/uploadMedia/:id",checkUserToken,checkUserHasFactory,checkTeamMemberForFactory,
multerUploader(`teams`,{ image:'image'}).fields([{name:'image',maxCount:1}]),
teamController.uploadMedia)

teamRouter.put("/update/:id",checkUserToken,checkUserHasFactory,checkTeamMemberForFactory,teamController.updateTeamMember)

teamRouter.delete("/:id",checkUserToken,checkUserHasFactory,checkTeamMemberForFactory,teamController.deleteTeamMember)