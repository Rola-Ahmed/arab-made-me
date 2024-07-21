import { postRequest, putRequest,getRequestDataHeader } from "./authServices";

// get spesific product Value
export const addUser = async (data) => {
  return await postRequest(`/users/signup`, {}, data);
};

// get spesific product Value
export const updateFromUser = async (header, data) => {
  return await putRequest(`users/update/fromUser`, header, data);
};

export const getUser = async (id, header) => {
  return await getRequestDataHeader(`/users/${id}`, header, {});
};
