import { postRequest, putRequest ,getRequestDataHeader} from "./authServices";

// get spesific product Value
export const addCustomProduct = async (header, data) => {
  return await postRequest(`/spmfs/add`, header, data);
};

// get spesific product Value
export const addCustomProductlMedia = async (id, header, data) => {
  return await putRequest(`/spmfs/uploadMedia/${id}`, header, data);
};



export const getOneSpmf = async (id, param) => {
  return await getRequestDataHeader(`/spmfs/${id}?${param}`, {},{});
};