import { getRequestDataHeader } from "../authServices";

export const getRFQs = async (param, header) => {
  return await getRequestDataHeader(
    `/importers/importer/rfqs?${param}`,
    header,
    {}
  );
};

