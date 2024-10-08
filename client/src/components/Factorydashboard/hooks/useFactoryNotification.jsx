import { useCallback, useEffect, useState } from "react";
import { getUnreadNotifications } from "Services/FactoryRequests/notifications";

export default function useFactoryNotification(isLogin) {
  // Fetch notifications
  const [notification, setNotification] = useState({});

  const fetchNotificationCounts = useCallback(async () => {
    const result = await getUnreadNotifications({}, { authorization: isLogin });

    const notificationCounts = {};

    // Loop over the result data to map the notification counts
    result?.data?.notifications.forEach((item) => {
      switch (item.notificationtype) {
        case "privateLabel":
          notificationCounts.PrivateLabelingsNotif = parseInt(
            item.openstatuscount,
            10
          );
          break;
        case "RFQs":
          notificationCounts.rfqsNotif = parseInt(item.openstatuscount, 10);
          break;
        case "smfr":
          notificationCounts.spmfsNotif = parseInt(item.openstatuscount, 10);
          break;
        case "visit":
          notificationCounts.visitsNotif = parseInt(item.openstatuscount, 10);
          break;
        case "po":
          notificationCounts.posNotif = parseInt(item.openstatuscount, 10);
          break;
        case "whiteLabel":
          notificationCounts.whiteLabelNotif = parseInt(
            item.openstatuscount,
            10
          );
          break;
        default:
          break;
      }
    });

    setNotification(notificationCounts);
  }, [isLogin]);

  useEffect(() => {
    if (isLogin) {
      fetchNotificationCounts();
    }
  }, [isLogin, fetchNotificationCounts]);

  return { notification, isLogin };
}
