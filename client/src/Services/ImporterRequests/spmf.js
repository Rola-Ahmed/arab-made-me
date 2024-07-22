import { getRequestDataHeader ,deleteRequest} from "../authServices";

export const getSpmfs = async (param, header) => {
  return await getRequestDataHeader(
    `/importers/importer/spmfs?${param}`,
    header,
    {}
  );
};


export const deleteSpmfs = async (id, header) => {
  return await deleteRequest(`/spmfs/${id}`, header, {});
};

