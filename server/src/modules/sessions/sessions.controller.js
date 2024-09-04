import { Session } from "../../database/models/sessions.model.js";
import { crudOps } from "../../utils/crud_ops.js";

export const addSession = crudOps.addModel(Session)

export const getSessions = crudOps.getAll(Session)

export const getSession = crudOps.getOne(Session)

export const updateSession = crudOps.updateModel(Session)

export const deleteSession = crudOps.deleteModel(Session)

