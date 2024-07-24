import { postRequest,getRequestDataHeader,deleteRequest } from "./authServices";

// get spesific product Value
export const addvisitRequest = async (header, data) => {
  return await postRequest(`/visits/add`, header, data);
};


export const getOneVisit = async (id, param) => {
  return await getRequestDataHeader(`/visits/${id}?${param}`, {},{});
};

export const deleteVisitFromUser = async (id, header) => {
  return await deleteRequest(`/visits/${id}`, header, {});
};
