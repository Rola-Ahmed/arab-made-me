import ErrorToast from "components/ErrorToast";
import SuccessToast from "components/SuccessToast";
import { useEffect, useState } from "react";
import {
  getRFQs,
} from "Services/ImporterRequests/rfq";
import{deleteRfqFromUser} from 'Services/rfq'

const useAllRfq = (isLogin, filter) => {
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
    const result = await getRFQs(params, { authorization: isLogin });
    if (result?.success) {
      const totalReq = result.data?.rfqs?.length || 1;
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
    const params = `size=${pagination.displayProductSize}&page=${pagination.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}&include=factory&include=product`;
    const result = await getRFQs(params, { authorization: isLogin });
    if (result?.success) {
      setReqData(result?.data?.rfqs);
      setTimeout(() => {
        setReqData(result?.data?.rfqs);
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

    // pagination?.currentPage,
    // pagination?.totalPage,
    // dataFilterFromChild,
    // isLogin,
  }, [pagination.currentPage, pagination?.totalPage, filter, isLogin]);

  const deleteData = async (itemId) => {
    let result = await deleteRfqFromUser(itemId, {
      authorization: isLogin,
    });

    if (result?.success) {
      SuccessToast("Data Deleted Successfully");
      setReqData((prevValue) => prevValue.filter((item) => item.id !== itemId));
    } else {
      ErrorToast("Something went wrong");
    }
  };

  return {
    reqData,
    pagination,
    apiLoadingData,
    errorsMsg,
    setPagination,
    deleteData,
  };
};

export default useAllRfq;
