import { postRequest, putRequest } from "./authServices";

// get spesific product Value
export const addPrivateLabel = async (header, data) => {
  return await postRequest(`/privateLabelings/add`, header, data);
};

// get spesific product Value
export const addPrivateLabelMedia = async (id, header, data) => {
  return await putRequest(`/privateLabelings/uploadMedia/${id}`, header, data);
};
