import { getRequest, putRequest,postRequest } from "./authServices";

// Service for fetching all products of a specific factory
//------------------------------------- factory products------------------------------------------
export const fetchFactoryProducts = async (factoryId) => {
  return await getRequest(`/factories/products/${factoryId}?include=factory`);
};

export const fetchFactoryProductsSize = async (factoryId, size) => {
  return await getRequest(`/factories/products/${factoryId}?size=${size}`);
};

//------------------------------------- factory data------------------------------------------

export const fetchFactories = async (size) => {
  return await getRequest(`/factories?size=${size}`);
};

export const fetchOneFactory = async (id) => {
  return await getRequest(`/factories/${id}`);
};

export const addFactoryMedia = async (header, data) => {
  return await putRequest(`/factories/media`, header, data);
};



// factories
export const addFactory = async (header, data) => {
  return await postRequest(`/factories/add`, header, data);
};
export const updateFactoryFromUser = async (header, data) => {
  return await putRequest(`/factories/update/fromUser`, header, data);
};

