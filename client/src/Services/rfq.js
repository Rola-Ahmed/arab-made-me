import { postRequest, putRequest } from "./authServices";

// get spesific product Value
export const addRfqLabel = async (header, data) => {
  return await postRequest(`/rfqs/add`, header, data);
};

// get spesific product Value
export const addRfqMedia = async (id, header, data) => {
  return await putRequest(`/rfqs/uploadMedia/${id}`, header, data);
};
