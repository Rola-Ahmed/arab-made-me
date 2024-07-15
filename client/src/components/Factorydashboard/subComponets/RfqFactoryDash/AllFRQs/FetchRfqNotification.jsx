import { useEffect, useState, useContext } from "react";
import { UserToken } from "Context/userToken";
import RfqNotificationList from "components/Factorydashboard/subComponets/RfqFactoryDash/AllFRQs/RfqNotificationList";
import { getRFQs } from "Services/FactoryRequests/rfq";

export default function FetchRfqNotification() {
  const { isLogin } = useContext(UserToken);
  const dataSize = 8;

  let [notificationData, setNotificationData] = useState([]);
  let [apiLoadingData, setApiLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  async function fetchNotifcationData() {
    setApiLoadingData(true);

    const result = await getRFQs(
      `size=8&page=${page}&include=importer&include=product`,
      { authorization: isLogin }
    );

    if (result?.success) {
      setNotificationData((prevData) => [...prevData, ...result.data.rfqs]);
      setApiLoadingData(false);
    }
  }

  async function fetchTotalPageData() {
    setApiLoadingData(true);

    const getTotalPgResponse = await getRFQs({}, { authorization: isLogin });

    if (getTotalPgResponse?.success) {
      setTotalPage(
        Math.ceil((getTotalPgResponse.data.rfqs?.length || 0) / dataSize)
      );
    }
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
      <RfqNotificationList
        notifcationData={notificationData}
        isLoading={apiLoadingData}
        handleDisplayPrevData={handleDisplayPrevData}
        page={page}
        totalPage={totalPage}
      />
    </div>
  );
}
