// factories/factory/notifications/unread

import { getRequestDataHeader } from "Services/authServices";

export const getUnreadNotifications = async (param, header) => {
  return await getRequestDataHeader(
    `/factories/factory/notifications/unread?${param}`,
    header,
    {}
  );
};

export const getAllNotifications = async (param, header) => {
  return await getRequestDataHeader(
    `/factories/factory/notifications?${param}`,
    header,
    {}
  );
};
