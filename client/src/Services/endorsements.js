import {  postRequest } from "./authServices";


// factories
export const addEndorsement = async (header, data) => {
  return await postRequest(`/endorsements/add`, header, data);

}
