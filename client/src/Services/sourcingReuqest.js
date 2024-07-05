import { getRequestDataHeader } from "./authServices";

export const getSourcingReuqest = async (id, header) => {
  return await getRequestDataHeader(`sourcingRequests/${id}`, {}, {});
};
