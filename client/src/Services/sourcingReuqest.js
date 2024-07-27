import { getRequestDataHeader } from "./authServices";

export const getSourcingReuqests = async (param) => {
  return await getRequestDataHeader(`sourcingRequests?${param}`, {}, {});
};

export const getOneSourcingReq = async (id, param) => {
  return await getRequestDataHeader(`sourcingRequests/${id}?${param}`, {}, {});
};
