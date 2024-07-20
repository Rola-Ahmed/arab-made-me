import { postRequest, putRequest, getRequestDataHeader } from "./authServices";

// get spesific product Value
export const addPrivateLabel = async (header, data) => {
  return await postRequest(`/privateLabelings/add`, header, data);
};

// get spesific product Value
export const addPrivateLabelMedia = async (id, header, data) => {
  return await putRequest(`/privateLabelings/uploadMedia/${id}`, header, data);
};

export const getOnePrivateLabel = async (id, param) => {
  return await getRequestDataHeader(`/privateLabelings/${id}?${param}`, {}, {});
};
