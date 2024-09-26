import { getRequestDataHeader, postRequest, putRequest } from "./authServices";

export const getSourcingOffers = async (param) => {
  return await getRequestDataHeader(`sourcingOffers?${param}`, {}, {});
};

export const getOneSourcingOffer = async (id, param) => {
  return await getRequestDataHeader(`sourcingOffers/${id}?${param}`, {}, {});
};

export const addSourcingOffer = async (header, data) => {
  return await postRequest(`/SourcingOffers/add`, header, data);
};

export const updateSourcingOffer = async (id, header, data) => {
  return await putRequest(`sourcingOffers/update/fromUser/${id}`, header, data);
};

export const addSourcingOfferMedia = async (id, header, data) => {
  return await putRequest(`/sourcingOffers/uploadMedia/${id}`, header, data);
};
