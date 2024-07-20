import { getRequestDataHeader, putRequest } from "../authServices";

export const getPrivateLables = async (param, header) => {
  return await getRequestDataHeader(
    `/factories/factory/privateLabelings?${param}`,
    header,
    {}
  );
};

export const updatePrivateLabel= async (id, header, data) => {
  return await putRequest(`/privateLabelings/factory/${id}`, header, data);
};


// export const getOnePrivateLable = async (param, header, data) => {
//   return await getRequestDataHeader(`/rfqs?${param}`, header, data);
// };

// export const updateRFQ = async (id, header, data) => {
//   return await putRequest(`/rfqs/factory/${id}`, header, data);
// };
