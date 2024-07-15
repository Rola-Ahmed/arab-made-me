import { getRequestDataHeader } from "../authServices";

export const getRFQs = async (param, header) => {
  return await getRequestDataHeader(`/factories/factory/rfqs?${param}`, header, {});
};
