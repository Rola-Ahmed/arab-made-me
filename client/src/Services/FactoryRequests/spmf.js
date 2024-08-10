import { getRequestDataHeader ,putRequest} from "../authServices";

export const getSpmfs = async (param, header) => {
  return await getRequestDataHeader(
    `/factories/factory/spmfs?${param}`,
    header,
    {}
  );
};



export const updateSpmf= async (id, header, data) => {
  return await putRequest(`/spmfs/factory/${id}`, header, data);
};
