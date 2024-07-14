import { getRequest } from "./authServices";

// get spesific product Value
export const FetchSectors = async () => {
  return await getRequest(`/sectors?size=10`);
};


export const fetchSectorProducts = async (productId) => {
  return await getRequest(`/sectors/products/${productId}`);
};