import { getRequestDataHeader } from "../authServices";

export const getQuotes = async (param, header) => {
  return await getRequestDataHeader(`/factories/factory/quotations?${param}`, header, {});
};

export const getOneRFQ = async (param, header,data) => {
    return await getRequestDataHeader(`/rfqs?${param}`, header, data);
  };
  


  