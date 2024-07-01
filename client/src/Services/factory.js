import { getRequest } from "./authServices";

// Service for fetching all products of a specific factory
//------------------------------------- factory products------------------------------------------
export const fetchFactoryProducts = async (factoryId) => {
  return await getRequest(`/factories/products/${factoryId}`);
};

export const fetchFactoryProductsSize = async (factoryId, size) => {
  return await getRequest(`/factories/products/${factoryId}?size=${size}`);
};

//------------------------------------- factory data------------------------------------------

export const fetchFactories = async (size) => {
  return await getRequest(`/factories?size=${size}`);
};
