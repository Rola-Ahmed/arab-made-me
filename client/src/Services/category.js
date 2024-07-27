import { getRequest } from "./authServices";

// get spesific product Value
export const getCategory = async () => {
  return await getRequest(`/categories?include=sector`);
};


