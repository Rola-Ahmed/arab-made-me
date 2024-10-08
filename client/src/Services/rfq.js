import { postRequest, putRequest, getRequestDataHeader,deleteRequest } from "./authServices";

// get spesific product Value
export const addRfqLabel = async (header, data) => {
  return await postRequest(`/rfqs/add`, header, data);
};

// get spesific product Value
export const addRfqMedia = async (id, header, data) => {
  return await putRequest(`/rfqs/uploadMedia/${id}`, header, data);
};

export const getOneRFQ = async (id, param) => {
  return await getRequestDataHeader(`/rfqs/${id}?${param}`, {},{});
};

export const deleteRfqFromUser = async (id, header) => {
  return await deleteRequest(`/rfqs/${id}`, header, {});
};
