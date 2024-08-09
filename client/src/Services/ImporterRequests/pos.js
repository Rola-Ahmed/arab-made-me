import {
  getRequestDataHeader,
  deleteRequest,
} from "../authServices";

export const getPos = async (param, header) => {
  return await getRequestDataHeader(
    `/importers/importer/pos?${param}`,
    header,
    {}
  );
};

export const deletePoUser = async (id, header) => {
  return await deleteRequest(`/pos/${id}`, header, {});
};
