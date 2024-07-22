import {getRequest,getRequestDataHeader} from "./authServices";

// get spesific product Value
export const fetchProductData = async (productId) => {
  return await getRequest(`/products/${productId}?include=factory`);
};


export const getAllProducts = async (param) => {
  return await getRequestDataHeader(`/products/?${param}`, {},{});
};
