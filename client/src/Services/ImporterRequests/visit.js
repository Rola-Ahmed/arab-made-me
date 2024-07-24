import { getRequestDataHeader } from "../authServices";

export const getVisitReqs = async (param, header) => {
  return await getRequestDataHeader(
    `/importers/importer/visits?${param}`,
    header,
    {}
  );
};


