import { ContactUs } from "../../database/models/contact_us.model.js";
import { crudOps } from "../../utils/crud_ops.js";


export const addContactUs = crudOps.addModel(ContactUs)

export const getContactUss = crudOps.getAll(ContactUs)

export const getContactUs= crudOps.getOne(ContactUs)

export const updateContactUs = crudOps.updateModel(ContactUs)

export const deleteContactUs = crudOps.deleteModel(ContactUs)

