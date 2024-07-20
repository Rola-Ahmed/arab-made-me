import { useEffect, useState, useContext } from "react";
import { getVisitReqs } from "Services/FactoryRequests/visit";
import { UserToken } from "Context/userToken";

const useVisit = (filter) => {
  let { isLogin } = useContext(UserToken);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    displayProductSize: 8,
    totalPage: 1,
  });

  const [apiLoadingData, setApiLoadingData] = useState(true);
  const [reqData, setReqData] = useState([]);
  const [errorsMsg, setErrorsMsg] = useState("");

  const fetchReqLeng = async () => {
    const params = `formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`;
    const result = await getVisitReqs(params, { authorization: isLogin });
    if (result?.success) {
      const totalReq = result.data?.visits?.length || 1;
      setPagination((prevValue) => ({
        ...prevValue,
        totalPage: Math.ceil(totalReq / prevValue.displayProductSize),
      }));
    }
  };

  const fetchReqData = async () => {
    // why added SetTimeOut? inorder for the user to see that the data has changes when using filtter or seach
    // bec sometime it returns the same data
    setApiLoadingData(true);
    setReqData([]);
    const params = `size=${pagination.displayProductSize}&page=${pagination.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}&include=importer`;
    const result = await getVisitReqs(params, { authorization: isLogin });
    if (result?.success) {
      setReqData(result?.data?.visits);
      setTimeout(() => {
        setReqData(result?.data?.visits);
      }, 50);
    } else {
      setErrorsMsg(result?.error);
    }
    setApiLoadingData(false);

    setTimeout(() => {
      setApiLoadingData(false);
    }, 50);
  };

  useEffect(() => {
    fetchReqLeng();
  }, [filter, isLogin]);

  useEffect(() => {
    fetchReqData();
  }, [pagination.currentPage, pagination?.totalPage, filter, isLogin]);

  return { reqData, pagination, apiLoadingData, errorsMsg, setPagination };
};

export default useVisit;
