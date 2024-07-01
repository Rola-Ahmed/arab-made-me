import { useEffect, useState, useContext } from "react";

import axios from "axios";
import { baseUrl } from "config.js";
import { UserToken } from "Context/userToken";
import PrivateLabeNotificationList from "components/AdminDashboard/Notification/PrivateLabelNotificationList";

export default function PrivateLabelNotification() {
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
        url: `${baseUrl}/privateLabelings?size=${dataSize}&page=${page}&include=importer&include=factory`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);
      if (response?.data?.message == "done") {
        setNotificationData((prevData) => [
          ...prevData,
          ...response.data.privatelabelings,
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
        `${baseUrl}/privateLabelings`,
        {
          headers: {
            authorization: isLogin,
          },
        }
      );

      if (getTotalPgResponse.data.message === "done") {
        setTotalPage(
          Math.ceil(
            (getTotalPgResponse.data.privatelabelings?.length || 0) / dataSize
          )
        );
      }
    } catch (error) {
      // setApiLoadingData(false);
    }
  }

  // Callback function to receive data from the child component
  const handleDisplayPrevData = (data) => {
    setPage(data);
  };

  // fetch data
  useEffect(() => {
    fetchNotifcationData();
  }, [page]);

  useEffect(() => {
    fetchTotalPageData();
  }, []);

  return (
    <div>
      <PrivateLabeNotificationList
        notifcationData={notificationData}
        isLoading={apiLoadingData}
        handleDisplayPrevData={handleDisplayPrevData}
        page={page}
        totalPage={totalPage}
      />
    </div>
  );
}
