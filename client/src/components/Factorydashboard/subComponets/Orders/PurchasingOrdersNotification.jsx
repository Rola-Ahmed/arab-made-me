import { useEffect, useState, useContext } from "react";

import axios from "axios";
import { baseUrl } from "config.js";
import { UserToken } from "Context/userToken";
import PurchasingOrdersNotificationList from "components/Factorydashboard/subComponets/Orders/PurchasingOrdersNotificationList";

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
        url: `${baseUrl}/factories/factory/pos?size=${dataSize}&page=${page}&include=importer`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);
      if (response?.data?.message == "done") {
        setNotificationData((prevData) => [...prevData, ...response.data.pos]);

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
        `${baseUrl}/factories/factory/pos`,
        {
          headers: {
            authorization: isLogin,
          },
        }
      );

      if (getTotalPgResponse.data.message === "done") {
        setTotalPage(
          Math.ceil((getTotalPgResponse.data.pos?.length || 0) / dataSize)
        );
      }
    } catch (error) {}
  }

  // Callback function to receive data from the child component
  // when user scroll to the end of the notification div
  // call this inorder to add new prev data
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
      <PurchasingOrdersNotificationList
        notifcationData={notificationData}
        isLoading={apiLoadingData}
        handleDisplayPrevData={handleDisplayPrevData}
        page={page}
        totalPage={totalPage}
      />
    </div>
  );
}
