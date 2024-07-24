import { postRequest, putRequest, getRequestDataHeader } from "./authServices";

// get spesific product Value
export const addChat = async (header, data) => {
  return await postRequest(`/chats/add`, header, data);
};

// get chat between 2 users
export const getChatBetweenTwo = async (id, param, header) => {
  return await getRequestDataHeader(`/chats/${id}?${param}`, header, {});
};

// chat list
export const getChatsForUser = async (param, header) => {
  return await getRequestDataHeader(`/chats/user/chats?${param}`, header, {});
};
