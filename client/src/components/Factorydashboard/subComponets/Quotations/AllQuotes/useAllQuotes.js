import { useEffect, useState, useContext } from "react";
import { getQuotes, deleteQuote } from "Services/FactoryRequests/quotations";
import ErrorToast from "components/ErrorToast";
import SuccessToast from "components/SuccessToast";
import { UserToken } from "Context/userToken";

const useAllQuotes = (filter) => {
  let { isLogin } = useContext(UserToken);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    displayProductSize: 8,
    totalPage: 1,
  });

  const [apiLoadingData, setApiLoadingData] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [reqData, setReqData] = useState([]);
  const [errorsMsg, setErrorsMsg] = useState("");

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
    setApiLoadingData(true);
    setReqData([]);
    const params = `size=${pagination.displayProductSize}&page=${pagination.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}&include=importer`;
    const result = await getQuotes(params, { authorization: isLogin });
    if (result?.success) {
      setReqData(result?.data?.quotations);
      setTimeout(() => {
        setReqData(result?.data?.quotations);
      }, 50);
    } else {
      setErrorsMsg(result?.error);
    }

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

  const deleteData = async (itemId) => {
    setDeleteLoading(true);
    let result = await deleteQuote(itemId, {
      authorization: isLogin,
    });

    if (result?.success) {
      SuccessToast("Data Deleted Successfully");
      setReqData((prevValue) => prevValue.filter((item) => item.id !== itemId));
    } else {
      ErrorToast("Something went wrong");
    }
    setDeleteLoading(false);
  };

  return {
    reqData,
    pagination,
    apiLoadingData,
    errorsMsg,
    setPagination,
    deleteData,
    isLogin,
    deleteLoading
  };
};

export default useAllQuotes;
