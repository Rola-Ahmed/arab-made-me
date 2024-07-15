import { getRequestDataHeader, putRequest } from "../authServices";

export const getRFQs = async (param, header) => {
  return await getRequestDataHeader(
    `/factories/factory/rfqs?${param}`,
    header,
    {}
  );
};

export const getOneRFQ = async (param, header, data) => {
  return await getRequestDataHeader(`/rfqs?${param}`, header, data);
};

export const updateRFQ = async (id, header, data) => {
  return await putRequest(`/rfqs/factory/${id}`, header, data);
};
