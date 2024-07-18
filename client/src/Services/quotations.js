import { postRequest, putRequest, getRequestDataHeader } from "./authServices";

// get spesific product Value
export const addqouteForRfq = async (header, data) => {
  return await postRequest(`/quotations/add/rfq`, header, data);
};

export const addqouteForSourcingReq = async (header, data) => {
  return await postRequest(`/quotations/add/sourcingRequest`, header, data);
};

export const addqouteForPrivateLabel = async (header, data) => {
  return await postRequest(`/quotations/add/privateLabel`, header, data);
};

export const addqouteForWhiteLabel = async (header, data) => {
  return await postRequest(`/quotations/add/whiteLabel`, header, data);
};

export const addqouteForSpmf = async (header, data) => {
  return await postRequest(`/quotations/add/spmf`, header, data);
};
