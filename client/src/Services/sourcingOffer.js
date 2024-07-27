import { getRequestDataHeader } from "./authServices";

export const getSourcingOffers = async (param) => {
  return await getRequestDataHeader(`sourcingOffers?${param}`, {}, {});
};

// export const getOneSourcingReq = async (id, param) => {
//   return await getRequestDataHeader(`sourcingRequests/${id}?${param}`, {}, {});
// };
