import {getRequest} from "./authServices";

// get spesific product Value
export const fetchProductData = async (productId) => {
  return await getRequest(`/products/${productId}?include=factory`);
};
