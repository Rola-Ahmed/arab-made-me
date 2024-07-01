import { Subscription } from "../../database/models/subscription.model.js";
import { crudOps } from "../../utils/crud_ops.js";


export const addSubscription = crudOps.addModel(Subscription)

export const getSubscriptions = crudOps.getAll(Subscription)

export const getSubscription= crudOps.getOne(Subscription)

export const updateSubscription = crudOps.updateModel(Subscription)

export const deleteSubscription = crudOps.deleteModel(Subscription)

