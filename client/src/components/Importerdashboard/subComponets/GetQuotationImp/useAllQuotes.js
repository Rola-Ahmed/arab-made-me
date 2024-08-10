import { useEffect, useState, useContext } from "react";
import { getQuotes } from "Services/ImporterRequests/quotations";
import { UserToken } from "Context/userToken";
const useAllQuotes = (filter) => {
  let { isLogin } = useContext(UserToken);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    displayProductSize: 8,
    totalPage: 1,
  });
  const [reqData, setReqData] = useState([])

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
  });

  const fetchReqLeng = async () => {
    const params = `formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`;
    const result = await getQuotes(params, { authorization: isLogin });
    if (result?.success) {
      const totalReq = result.data?.quotations?.length || 1;
      setPagination((prevValue) => ({
        ...prevValue,
        totalPage: Math.ceil(totalReq / prevValue.displayProductSize),
      }));
    }
  };

  const fetchReqData = async () => {
    // why added SetTimeOut? inorder for the user to see that the data has changes when using filtter or seach
    // bec sometime it returns the same data
    setApiLoadingData((prevValue) => ({
      ...prevValue,
      reqData: true,
    errorWhileLoading: null,
    }));
    setReqData([]);
    const params = `size=${pagination.displayProductSize}&page=${pagination.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}&include=factory`;
    const result = await getQuotes(params, { authorization: isLogin });

    if (result?.success) {

      setTimeout(() => {
        setReqData(result?.data?.quotations);
      }, 50);
    } 

      setApiLoadingData((prevVal) => ({
        ...prevVal,
        reqData: result?.loadingStatus,
          errorWhileLoading: result?.error,
      }));
  };

  useEffect(() => {
    fetchReqLeng();
  }, [filter, isLogin]);

  useEffect(() => {
    fetchReqData();

    
  }, [pagination.currentPage, pagination?.totalPage, filter, isLogin]);


  return {
    reqData,
    pagination,
    apiLoadingData,
    setPagination,
  };
};

export default useAllQuotes;
