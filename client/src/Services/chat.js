import { postRequest, putRequest } from "./authServices";

// get spesific product Value
export const addChat = async (header, data) => {
  return await postRequest(`/chats/add`, header, data);
};

