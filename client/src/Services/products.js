import {
  getRequest,
  getRequestDataHeader,
  patchRequest,
  postRequest,
  putRequest,
} from "./authServices";

// get spesific product Value
// get one product

// remove later & extchange it with /getOneProduct
export const fetchProductData = async (productId) => {
  return await getRequest(`/products/${productId}?include=factory`);
};

export const getAllProducts = async (param) => {
  return await getRequestDataHeader(`/products?${param}`, {}, {});
};

export const getOneProduct = async (id, param) => {
  return await getRequestDataHeader(`/products/${id}?${param}`, {}, {});
};

export const addProduct = async (header, data) => {
  return await postRequest(`/products/add`, header, data);
};

export const updateProduct = async (id, header, data) => {
  return await putRequest(`products/update/fromUser/${id}`, header, data);
};

export const addProductMedia = async (id, header, data) => {
  return await putRequest(`/products/uploadMedia/${id}`, header, data);
};

// images attribute
export const updateProductBanner = async (id, header, data) => {
  return await patchRequest(`/products/update/image/${id}`, header, data);
};

export const deleteCoverVideo = async (id, header, data) => {
  return await patchRequest(`products/update/coverVideo/${id}`, header, data);
};
