import {
  getRequestDataHeader,
  deleteRequest,
} from "../authServices";

export const getPrivateLables = async (param, header) => {
  return await getRequestDataHeader(
    `/importers/importer/privateLabelings?${param}`,
    header,
    {}
  );
};

export const deletePrivateLable = async (id, header) => {
  return await deleteRequest(`/privateLabelings/${id}`, header, {});
};
