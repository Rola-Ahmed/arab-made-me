import { getRequestDataHeader } from "./authServices";

export const getSourcingOffers = async (param) => {
  return await getRequestDataHeader(`sourcingOffers?${param}`, {}, {});
};

export const getOneSourcingOffer = async (id, param) => {
  return await getRequestDataHeader(`sourcingOffers/${id}?${param}`, {}, {});
};
