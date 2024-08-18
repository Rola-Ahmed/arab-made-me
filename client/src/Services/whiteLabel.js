import {
  postRequest,
  putRequest,
  getRequestDataHeader,
  deleteRequest,
} from "./authServices";

// get spesific product Value
export const addWhiteLabel = async (header, data) => {
  return await postRequest(`/whiteLabelings/add`, header, data);
};

// get spesific product Value
export const addWhiteLabelMedia = async (id, header, data) => {
  return await putRequest(`/whiteLabelings/uploadMedia/${id}`, header, data);
};

export const getOneWhiteLabel = async (id, param) => {
  return await getRequestDataHeader(`/whiteLabelings/${id}?${param}`, {}, {});
};

export const getWhiteLables = async (param) => {
  return await getRequestDataHeader(`/whiteLabelings?${param}`, {}, {});
};

export const deleteWhiteLabelFromUser = async (id, header) => {
  return await deleteRequest(`/whiteLabelings/${id}`, header, {});
};
