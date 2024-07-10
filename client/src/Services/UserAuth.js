import { postRequest, putRequest } from "./authServices";

// get spesific product Value
export const addUser = async (data) => {
  return await postRequest(`/users/signup`, {}, data);
};


// get spesific product Value
export const updateFromUser = async ( header, data) => {
  return await putRequest(`users/update/fromUser`, header, data);
};

// get spesific product Value
