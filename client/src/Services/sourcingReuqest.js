import { getRequestDataHeader } from "./authServices";

export const getSourcingReuqests = async (param) => {
  return await getRequestDataHeader(`sourcingRequests?${param}`, {}, {});
};
