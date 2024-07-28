import {  putRequest } from "../authServices";

export const updateWhiteLabel = async (id, header, data) => {
  return await putRequest(`/whiteLabelings/factory/${id}`, header, data);
};
