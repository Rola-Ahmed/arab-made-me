import { getRequestDataHeader ,putRequest} from "../authServices";

export const getVisitReqs = async (param, header) => {
  return await getRequestDataHeader(
    `/factories/factory/visits?${param}`,
    header,
    {}
  );
};




export const updateSpmf= async (id, header, data) => {
  return await putRequest(`/spmfs/factory/${id}`, header, data);
};
