import {
  getRequest,
  putRequest,
  postRequest,
  patchRequest,
} from "./authServices";

export const fetchOneImporter = async (id, params) => {
  return await getRequest(`/importers/${id}?${params}`);
};

export const addImporterMedia = async (header, data) => {
  return await putRequest(`/importers/media`, header, data);
};

export const addImporter = async (header, data) => {
  return await postRequest(`/importers/add`, header, data);
};

export const updateImporterFromUser = async (header, data) => {
  return await putRequest(`/importers/update/fromUser`, header, data);
};

export const updateImporterLegalDocs = async (header, data) => {
  return await patchRequest(`/importers/update/legalDoc`, header, data);
};
