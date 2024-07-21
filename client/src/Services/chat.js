import { postRequest, putRequest, getRequestDataHeader } from "./authServices";

// get spesific product Value
export const addChat = async (header, data) => {
  return await postRequest(`/chats/add`, header, data);
};

export const getChats = async (param, header) => {
  return await getRequestDataHeader(`/chats?${param}`, header, {});
};


export const getChatsForUser = async (param, header) => {
  return await getRequestDataHeader(`/chats/user/chats?${param}`, header, {});
};
