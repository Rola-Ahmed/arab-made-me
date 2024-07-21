import { postRequest, putRequest, getRequestDataHeader } from "./authServices";

// get spesific product Value
export const addPoFromQuotation = async (header, data) => {
  return await postRequest(`/pos/add/quotation`, header, data);
};

export const addPoFromSourcingOffer = async (header, data) => {
  return await postRequest(`/pos/add/sourcingOffer`, header, data);
};

export const addPoFromProduct = async (header, data) => {
  return await postRequest(`/pos/add/product`, header, data);
};

// get spesific product Value
export const addPOMedia = async (id, header, data) => {
  return await putRequest(`/pos/uploadMedia/${id}`, header, data);
};

// export const getOnePO = async (id) => {
//   return await getRequestDataHeader(
//     `/pos/${id}?include=product&include=factory&include=sourcingOffer`,
//     {},
//     {}
//   );
// };

export const getOnePO = async (id, param) => {
  return await getRequestDataHeader(`/pos/${id}?${param}`, {},{});
};