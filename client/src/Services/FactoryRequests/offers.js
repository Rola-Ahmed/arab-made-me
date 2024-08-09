import {
    getRequestDataHeader,
    deleteRequest,
  } from "../authServices";
  
  export const getOffers = async (param, header) => {
    return await getRequestDataHeader(
      `/factories/factory/offers?${param}`,
      header,
      {}
    );
  };
  
  export const deleteOfferUser = async (id, header) => {
    return await deleteRequest(`/sourcingOffers/delete/fromUser/${id}`, header, {});
  };
  