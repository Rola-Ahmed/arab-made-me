import { getRequestDataHeader ,putRequest} from "../authServices";

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


export const updateSpmf= async (id, header, data) => {
  return await putRequest(`/spmfs/factory/${id}`, header, data);
};
