import { useEffect, useState, useContext } from "react";

import axios from "axios";
import { baseUrl } from "config.js";
import { UserToken } from "Context/userToken";
import QuotationsNotificationList from "components/Factorydashboard/subComponets/Quotations/AllQuotes/QuotationsNotificationList";

export default function VisitReqNotification() {
  const { isLogin } = useContext(UserToken);
  const dataSize = 8;

  let [notificationData, setNotificationData] = useState([]);
  let [apiLoadingData, setApiLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  async function fetchNotifcationData() {
    setApiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/factory/quotations?size=8&page=${page}&include=importer`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);
      if (response?.data?.message == "done") {
        setNotificationData((prevData) => [
          ...prevData,
          ...response.data.quotations,
        ]);

        setApiLoadingData(false);
      }
    } catch (error) {
      // setApiLoadingData(false);
    }
  }

  async function fetchTotalPageData() {
    setApiLoadingData(true);

    try {
      const getTotalPgResponse = await axios.get(
        `${baseUrl}/factories/factory/quotations`,
        {
          headers: {
            authorization: isLogin,
          },
        }
      );

      if (getTotalPgResponse.data.message === "done") {
        setTotalPage(
          Math.ceil(
            (getTotalPgResponse.data.quotations?.length || 0) / dataSize
          )
        );
      }
    } catch (error) {}
  }
  // Callback function to receive data from the child component
  const handleDisplayPrevData = (data) => {
    setPage(data);
  };

  useEffect(() => {
    fetchNotifcationData();
  }, [page]);

  useEffect(() => {
    fetchTotalPageData();
  }, []);

  return (
    <div>
      <QuotationsNotificationList
        notifcationData={notificationData}
        isLoading={apiLoadingData}
        handleDisplayPrevData={handleDisplayPrevData}
        page={page}
        totalPage={totalPage}
      />
    </div>
  );
}
