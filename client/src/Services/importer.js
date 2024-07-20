import { getRequest, putRequest,postRequest } from "./authServices";

export const fetchOneImporter= async (id,params) => {
    return await getRequest(`/importers/${id}?${params}`);
  };