import { useEffect, useState, useContext } from "react";
import { UserToken } from "Context/userToken";
import { getPrivateLables } from "Services/FactoryRequests/privateLabel";

const usePrivateLabelNotific = () => {
  const { isLogin } = useContext(UserToken);
  const dataSize = 8;

  let [notificationData, setNotificationData] = useState([]);
  let [apiLoadingData, setApiLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  async function fetchNotifcationData() {
    setApiLoadingData(true);

    const result = await getPrivateLables(
      `size=${dataSize}&page=${page}&include=importer&include=product&sort=date-DESC`,
      { authorization: isLogin }
    );

    console.log("Results", result);
    if (result?.success) {
      setNotificationData((prevData) => [
        ...prevData,
        ...result.data.privateLabelings,
      ]);
      setApiLoadingData(false);
    }
  }

  async function fetchTotalPageData() {
    setApiLoadingData(true);

    const getTotalPgResponse = await getPrivateLables(
      {},
      { authorization: isLogin }
    );
    console.log("Results getTotalPgResponse", getTotalPgResponse);


    if (getTotalPgResponse?.success) {
      setTotalPage(
        Math.ceil(
          (getTotalPgResponse.data.privateLabelings?.length || 0) / dataSize
        )
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
  console.log("notificationData",notificationData)

  return {
    notificationData,
    apiLoadingData,
    handleDisplayPrevData,
    page,
    totalPage,
  };
};
export default usePrivateLabelNotific;
