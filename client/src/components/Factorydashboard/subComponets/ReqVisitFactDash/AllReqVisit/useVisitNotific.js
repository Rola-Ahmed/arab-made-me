import { useEffect, useState, useContext } from "react";
import { UserToken } from "Context/userToken";
import { getVisitReqs } from "Services/FactoryRequests/visit";

const useVisitNotific = () => {
  const { isLogin } = useContext(UserToken);
  const dataSize = 8;

  let [notificationData, setNotificationData] = useState([]);
  let [apiLoadingData, setApiLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  async function fetchNotifcationData() {
    setApiLoadingData(true);

    const result = await getVisitReqs(
      `size=${dataSize}&page=${page}&include=importer`,
      { authorization: isLogin }
    );

    if (result?.success) {
      setNotificationData((prevData) => [...prevData, ...result.data.visits]);
      setApiLoadingData(false);
    }
  }

  async function fetchTotalPageData() {
    setApiLoadingData(true);

    const getTotalPgResponse = await getVisitReqs(
      {},
      { authorization: isLogin }
    );

    if (getTotalPgResponse?.success) {
      setTotalPage(
        Math.ceil((getTotalPgResponse.data.visits?.length || 0) / dataSize)
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

  return {
    notificationData,
    apiLoadingData,
    handleDisplayPrevData,
    page,
    totalPage,
  };
};
export default useVisitNotific;
