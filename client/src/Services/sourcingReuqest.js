import { getRequestDataHeader, postRequest, putRequest } from "./authServices";

export const getSourcingReuqests = async (param) => {
  return await getRequestDataHeader(`sourcingRequests?${param}`, {}, {});
};

export const getOneSourcingReq = async (id, param) => {
  return await getRequestDataHeader(`sourcingRequests/${id}?${param}`, {}, {});
};

export const addSourcingOffer = async (header, data) => {
  return await postRequest(`/sourcingRequests/add`, header, data);
};

export const addaddSourcingOfferMedia = async (id, header, data) => {
  return await putRequest(`/sourcingRequests/uploadMedia/${id}`, header, data);
};
