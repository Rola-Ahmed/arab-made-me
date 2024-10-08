import { useEffect, useState } from "react";
import { getSpmfs } from "Services/FactoryRequests/spmf";

const useSpmfs = (isLogin, filter) => {
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
    const params = `size=${pagination.displayProductSize}&page=${pagination.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}&include=importer`;
    const result = await getSpmfs(params, { authorization: isLogin });
    if (result?.success) {
      setReqData(result?.data?.spmfs);

      setPagination((prevValue) => ({
        ...prevValue,
        totalPage: result?.data?.pagination?.totalPages,
      }));
    } else {
      setErrorsMsg(result?.error);
    }

    setApiLoadingData(result?.loadingStatus);
  };

  useEffect(() => {
    fetchReqData();
  }, [pagination.currentPage, filter, isLogin]);

  return { reqData, pagination, apiLoadingData, errorsMsg, setPagination };
};

export default useSpmfs;
