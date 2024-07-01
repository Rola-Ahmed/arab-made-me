import { useEffect, useState, useContext } from "react";

import axios from "axios";
import { baseUrl } from "config.js";
import { UserToken } from "Context/userToken";
import VisitReqNotificationList from "components/AdminDashboard/Notification/VisitReqNotificationList";

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
        url: `${baseUrl}/visits?size=8&page=${page}&include=importer`,
      };

      const response = await axios.request(config);
      if (response?.data?.message == "done") {
        setNotificationData((prevData) => [
          ...prevData,
          ...response.data.visits,
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
      const getTotalPgResponse = await axios.get(`${baseUrl}/visits`);

      if (getTotalPgResponse.data.message === "done") {
        setTotalPage(
          Math.ceil((getTotalPgResponse.data.visits?.length || 0) / dataSize)
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
      <VisitReqNotificationList
        notifcationData={notificationData}
        isLoading={apiLoadingData}
        handleDisplayPrevData={handleDisplayPrevData}
        page={page}
        totalPage={totalPage}
      />
    </div>
  );
}
