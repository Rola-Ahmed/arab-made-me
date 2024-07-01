import { postRequest, putRequest } from "./authServices";

// get spesific product Value
export const addWhiteLabel = async (header, data) => {
  return await postRequest(`/whiteLabelings/add`, header, data);
};

// get spesific product Value
export const addWhiteLabelMedia = async (id, header, data) => {
  return await putRequest(`/whiteLabelings/uploadMedia/${id}`, header, data);
};
