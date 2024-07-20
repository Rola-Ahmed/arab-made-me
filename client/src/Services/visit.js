import { postRequest,getRequestDataHeader } from "./authServices";

// get spesific product Value
export const addvisitRequest = async (header, data) => {
  return await postRequest(`/visits/add`, header, data);
};


export const getOneVisit = async (id, param) => {
  return await getRequestDataHeader(`/visits/${id}?${param}`, {},{});
};