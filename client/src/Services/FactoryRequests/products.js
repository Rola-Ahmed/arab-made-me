import {
    getRequestDataHeader,
    deleteRequest,
  } from "../authServices";
  
  export const getProducts = async (id,param) => {
    return await getRequestDataHeader(
      `/factories/products/${id}?${param}`,
      {},
      {}
    );
  };
  
  export const deleteProductUser = async (id, header) => {
    return await deleteRequest(`/products/delete/fromUser/${id}`, header, {});
  };
  