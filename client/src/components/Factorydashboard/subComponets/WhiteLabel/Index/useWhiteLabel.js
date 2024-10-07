import { useEffect, useState } from "react";
import { getWhiteLables } from "Services/FactoryRequests/whiteLabel";

const useWhiteLabel = (isLogin, filter) => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    displayProductSize: 8,
    totalPage: 1,
  });

  const [apiLoadingData, setApiLoadingData] = useState(true);
  const [reqData, setReqData] = useState([]);
  const [errorsMsg, setErrorsMsg] = useState("");

  const fetchReqData = async () => {
    // why added SetTimeOut? inorder for the user to see that the data has changes when using filtter or seach
    // bec sometime it returns the same data
    setApiLoadingData(true);
    setReqData([]);
    const params = `size=${pagination.displayProductSize}&page=${pagination.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}&include=importer&include=product`;
    const result = await getWhiteLables(params, { authorization: isLogin });
    console.log("result white", result);
    if (result?.success) {
      setTimeout(() => {
        setReqData(result?.data?.whiteLabelings);
      }, 10);
      setPagination((prevValue) => ({
        ...prevValue,
        totalPage: result?.data?.pagination?.totalPage,
      }));
    }
    setTimeout(() => {
      setErrorsMsg(result?.error);
      setApiLoadingData(result?.loadingStatus);
    }, 10);
  };

  useEffect(() => {
    fetchReqData();
  }, [pagination.currentPage, filter, isLogin]);

  return { reqData, pagination, apiLoadingData, errorsMsg, setPagination };
};

export default useWhiteLabel;
