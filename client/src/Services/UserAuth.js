import { postRequest, putRequest,getRequestDataHeader,patchRequest } from "./authServices";

// get spesific product Value
export const addUser = async (data) => {
  return await postRequest(`/users/signup`, {}, data);
};


export const addSignIn = async (data) => {
  return await postRequest(`/users/signin`, {}, data);
};

// get spesific product Value
export const updateFromUser = async (header, data) => {
  return await putRequest(`users/update/fromUser`, header, data);
};

export const getUser = async (id, header) => {
  return await getRequestDataHeader(`/users/${id}`, header, {});
};


export const forgotPassword = async (data) => {
  return await postRequest(`/users/forgetPassword`, {}, data);
};


export const resetPassword = async (revoceryToken,data) => {
  return await patchRequest(`/users/resetPassword/${revoceryToken}`, {},data);
};


