import { getRequestDataHeader } from "../authServices";

export const getSpmfs = async (param, header) => {
  return await getRequestDataHeader(
    `/factories/factory/spmfs?${param}`,
    header,
    {}
  );
};

// export const getOneRFQ = async (param, header, data) => {
//   return await getRequestDataHeader(`/rfqs?${param}`, header, data);
// };
