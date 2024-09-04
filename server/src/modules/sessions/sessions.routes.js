import { Router } from "express";
import * as sessionsController from "./sessions.controller.js"
import { checkUserToken } from "../../middelwares/chcek_user_token.js";
import { allowedTo } from "../../middelwares/authorization.js";
export const sessionsRouter = Router()

sessionsRouter.post("/", sessionsController.addSession)

sessionsRouter.get("/", sessionsController.getSessions)


sessionsRouter.put("/:id", sessionsController.updateSession)

sessionsRouter.delete("/:id", sessionsController.deleteSession)