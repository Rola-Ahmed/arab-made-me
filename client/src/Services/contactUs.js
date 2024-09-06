import { postRequest } from "./authServices";

// get spesific product Value
export const contactUs = async (data) => {
  return await postRequest(`/contactUs/add`, {}, data);
};
