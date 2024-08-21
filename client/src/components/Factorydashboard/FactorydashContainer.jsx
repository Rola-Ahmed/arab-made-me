import { useCallback, useContext, useEffect, useState } from "react";
import { UserToken } from "Context/userToken";
// import Factorydash from "components/Factorydashboard/Factorydash";
import { getPrivateLables } from "Services/FactoryRequests/privateLabel";
import { getRFQs } from "Services/FactoryRequests/rfq";
import { getSpmfs } from "Services/FactoryRequests/spmf";
import { getVisitReqs } from "Services/FactoryRequests/visit";
import { getPos } from "Services/FactoryRequests/pos";
import { getOffers } from "Services/FactoryRequests/offers";
import { getQuotes } from "Services/FactoryRequests/quotations";

export default function useFactorydash() {
  const { isLogin } = useContext(UserToken);

  // Fetch notifications
  const [notification, setNotification] = useState([]);

  const fetchNotificationCounts = useCallback(async () => {
    const requests = [
      getPrivateLables,
      getRFQs,
      getSpmfs,
      getVisitReqs,
      getPos,
      getOffers,
      getQuotes,
    ];

    const headers = { authorization: isLogin };
    const results = await Promise.all(
      requests.map((request) => request({}, headers))
    );

    const notificationCounts = {
      PrivateLabelingsNotif: results[0]?.data?.privateLabelings?.filter(
        (item) => item.status === "open"
      ).length,
      rfqsNotif: results[1]?.data?.rfqs?.filter(
        (item) => item.status === "open"
      ).length,
      spmfsNotif: results[2]?.data?.spmfs?.filter(
        (item) => item.status === "open"
      ).length,
      visitsNotif: results[3]?.data?.visits?.filter(
        (item) => item.status === "open"
      ).length,
      posNotif: results[4]?.data?.pos?.filter((item) => item.status === "open")
        .length,
      offersNotif: results[5]?.data?.offers?.filter(
        (item) => item.status === "open"
      ).length,
      quotationsNotif: results[6]?.data?.quotations?.filter(
        (item) => item.status === "open"
      ).length,
    };

    setNotification(notificationCounts);
  }, [isLogin]);

  useEffect(() => {
    if (isLogin) {
      fetchNotificationCounts();
    }
  }, [isLogin, fetchNotificationCounts]);

  return { notification, isLogin };
}
