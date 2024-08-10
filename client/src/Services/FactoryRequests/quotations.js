import { getRequestDataHeader ,deleteRequest} from "../authServices";

export const getQuotes = async (param, header) => {
  return await getRequestDataHeader(`/factories/factory/quotations?${param}`, header, {});
};


  export const deleteQuote = async (id, header) => {
    return await deleteRequest(`/quotations/${id}`, header, {});
  };
  


  