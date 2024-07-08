import { postRequest } from "./authServices";

// get spesific product Value
export const addUser = async (data) => {
  return await postRequest(`/users/signup`, {}, data);
};

// get spesific product Value
