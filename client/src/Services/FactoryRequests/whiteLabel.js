import { putRequest, getRequestDataHeader } from "../authServices";

export const updateWhiteLabel = async (id, header, data) => {
  return await putRequest(`/whiteLabelings/factory/${id}`, header, data);
};

export const getWhiteLables = async (param, header) => {
  return await getRequestDataHeader(
    `/factories/factory/whiteLabelings?${param}`,
    header,
    {}
  );
};
