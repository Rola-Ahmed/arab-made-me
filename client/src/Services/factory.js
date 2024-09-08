import {
  getRequest,
  putRequest,
  postRequest,
  patchRequest,
} from "./authServices";

// Service for fetching all products of a specific factory
//------------------------------------- factory products------------------------------------------

// remove this later
export const fetchFactoryProducts = async (factoryId) => {
  return await getRequest(`/factories/products/${factoryId}?include=factory`);
};

// remove this later
export const fetchFactoryProductsSize = async (factoryId, size) => {
  return await getRequest(`/factories/products/${factoryId}?size=${size}`);
};

// and will keep this one
export const fetchFactoryProducts2 = async (factoryId, params) => {
  return await getRequest(`/factories/products/${factoryId}?${params}`);
};

//------------------------------------- factory data------------------------------------------

export const fetchFactorieswithParam = async (param) => {
  return await getRequest(`/factories?${param}`);
};

export const fetchOneFactory = async (id) => {
  return await getRequest(`/factories/${id}`);
};

export const addFactoryMedia = async (header, data) => {
  return await putRequest(`/factories/media`, header, data);
};

export const updateFactoryLegalDocs = async (header, data) => {
  return await patchRequest(`/factories/update/legalDoc`, header, data);
};

export const updateFactoryBanner = async (header, data) => {
  return await patchRequest(`/factories/update/image`, header, data);
};
export const updateFactoryCertificate = async (header, data) => {
  return await patchRequest(`/factories/update/qualityCertificate`, header, data);
};

// factories
export const addFactory = async (header, data) => {
  return await postRequest(`/factories/add`, header, data);
};
export const updateFactoryFromUser = async (header, data) => {
  return await putRequest(`/factories/update/fromUser`, header, data);
};

export const getFactoryTeam = async (factoryId, params) => {
  return await getRequest(`/teams/factory/${factoryId}?${params}`);
};

export const getEndorse = async (factoryId, params) => {
  return await getRequest(`/endorsements/factory/${factoryId}?${params}`);
};
