import { useEffect, useState, } from "react";
import { getWhiteLables } from "Services/whiteLabel";

const useWhiteLabelNotific = () => {
  const dataSize = 8;

  let [notificationData, setNotificationData] = useState([]);
  let [apiLoadingData, setApiLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  async function fetchNotifcationData() {
    setApiLoadingData(true);

    const result = await getWhiteLables(
      `size=${dataSize}&page=${page}&include=importer&include=product&sort=date-DESC`
    );

    if (result?.success) {
      setNotificationData((prevData) => [
        ...prevData,
        ...result?.data?.whitelabelings,
      ]);
      setApiLoadingData(false);
    }
  }

  async function fetchTotalPageData() {
    setApiLoadingData(true);

    const getTotalPgResponse = await getWhiteLables({});

    if (getTotalPgResponse?.success) {
      setTotalPage(
        Math.ceil(
          (getTotalPgResponse?.data?.whitelabelings?.length || 0) / dataSize
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

  return {
    notificationData,
    apiLoadingData,
    handleDisplayPrevData,
    page,
    totalPage,
  };
};
export default useWhiteLabelNotific;
