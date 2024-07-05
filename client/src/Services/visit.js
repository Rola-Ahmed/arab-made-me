import { postRequest } from "./authServices";

// get spesific product Value
export const addvisitRequest = async (header, data) => {
  return await postRequest(`/visits/add`, header, data);
};
