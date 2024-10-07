import { getRequestDataHeader, postRequest, putRequest,deleteRequest } from "./authServices";

export const getSourcingReuqests = async (param) => {
  return await getRequestDataHeader(`sourcingRequests?${param}`, {}, {});
};

export const getOneSourcingReq = async (id, param) => {
  return await getRequestDataHeader(`sourcingRequests/${id}?${param}`, {}, {});
};

export const addSourcingRequest = async (header, data) => {
  return await postRequest(`/sourcingRequests/add`, header, data);
};

export const addSourcingRequestrMedia = async (id, header, data) => {
  return await putRequest(`/sourcingRequests/uploadMedia/${id}`, header, data);
};

export const updateSourcingRequest = async (id, header, data) => {
  return await putRequest(`sourcingRequests/${id}`, header, data);
};


export const deleteSourceRequestUser = async (id, header) => {
  return await deleteRequest(`/sourcingRequests/${id}`, header, {});
};