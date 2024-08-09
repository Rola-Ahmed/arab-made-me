import {
    getRequestDataHeader,
    deleteRequest,
  } from "../authServices";
  
  export const getProducts = async (param, header) => {
    return await getRequestDataHeader(
      `/factories/products?${param}`,
      header,
      {}
    );
  };
  
  export const deleteProductUser = async (id, header) => {
    return await deleteRequest(`/products/delete/fromUser/${id}`, header, {});
  };
  