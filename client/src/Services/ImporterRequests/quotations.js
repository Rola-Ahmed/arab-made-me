import { getRequestDataHeader} from "../authServices";

export const getQuotes = async (param, header) => {
  return await getRequestDataHeader(`/importers/importer/quotations?${param}`, header, {});
};

