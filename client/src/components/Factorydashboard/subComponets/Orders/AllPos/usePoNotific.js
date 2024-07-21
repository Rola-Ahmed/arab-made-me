import { useEffect, useState, useContext } from "react";
import { UserToken } from "Context/userToken";
import { getPos } from "Services/FactoryRequests/pos";

const usePoNotific = () => {
  const { isLogin } = useContext(UserToken);
  const dataSize = 8;

  let [notificationData, setNotificationData] = useState([]);
  let [apiLoadingData, setApiLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  async function fetchNotifcationData() {
    setApiLoadingData(true);

    const result = await getPos(
      `size=${dataSize}&page=${page}&include=importer&sort=date-DESC`,
      { authorization: isLogin }
    );

    if (result?.success) {
      setNotificationData((prevData) => [...prevData, ...result.data.pos]);
      setApiLoadingData(false);
    }
  }

  async function fetchTotalPageData() {
    setApiLoadingData(true);

    const getTotalPgResponse = await getPos({}, { authorization: isLogin });

    if (getTotalPgResponse?.success) {
      setTotalPage(
        Math.ceil((getTotalPgResponse.data.pos?.length || 0) / dataSize)
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
export default usePoNotific;
