import { getRequest, putRequest, postRequest } from "./authServices";

export const fetchOneImporter = async (id, params) => {
  return await getRequest(`/importers/${id}?${params}`);
};

export const addImporterMedia = async (header, data) => {
  return await putRequest(`/importers/media`, header, data);
};

export const addImporter = async (header, data) => {
  return await postRequest(`/importers/add`, header, data);
};
