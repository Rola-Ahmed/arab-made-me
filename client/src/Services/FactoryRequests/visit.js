import { getRequestDataHeader, putRequest } from "../authServices";

export const getVisitReqs = async (param, header) => {
  return await getRequestDataHeader(
    `/factories/factory/visits?${param}`,
    header,
    {}
  );
};

export const updateVisit = async (id, header, data) => {
  return await putRequest(`/visits/factory/${id}`, header, data);
};
