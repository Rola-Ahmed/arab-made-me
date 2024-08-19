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

export const getOneQuote = async (id, param) => {
  return await getRequestDataHeader(`/quotations/${id}?${param}`, {}, {});
};

export const updateQoute = async (id, header, data) => {
  return await putRequest(`/quotations/${id}`, header, data);
};

export const AddQuoteUpdates = async (header, data) => {
  return await postRequest(`quotationUpdates/add`, header, data);
};
