import {
    getRequestDataHeader,
  } from "../authServices";
  
  export const getSourceRequest = async (param, header) => {
    return await getRequestDataHeader(
      `/importers/importer/sourcingRequests?${param}`,
      header,
      {}
    );
  };
  

  