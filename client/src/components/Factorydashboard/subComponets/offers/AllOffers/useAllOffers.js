import ErrorToast from "components/ErrorToast";
import SuccessToast from "components/SuccessToast";
import { useEffect, useState, useContext } from "react";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { getOffers, deleteOfferUser } from "Services/FactoryRequests/offers";

const useAllOffers = (filter) => {
  let { isLogin } = useContext(UserToken);
  const { currentUserData } = useContext(userDetails);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    displayProductSize: 8,
    totalPage: 1,
  });

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
  });
  const [reqData, setReqData] = useState([]);

  const fetchReqLeng = async () => {
    const params = `formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`;
    const result = await getOffers(params, { authorization: isLogin });
    if (result?.success) {
      const totalReq = result.data?.offers?.length || 1;
      setPagination((prevValue) => ({
        ...prevValue,
        totalPage: Math.ceil(totalReq / prevValue.displayProductSize),
      }));
    }
  };

  const fetchReqData = async () => {
    // why added SetTimeOut? inorder for the user to see that the data has changes when using filtter or seach
    // bec sometime it returns the same data
    setApiLoadingData((prevVal) => ({
      ...prevVal,
      reqData: true,
      errorWhileLoading: null,
    }));

    setReqData([]);
    const params = `size=${pagination.displayProductSize}&page=${pagination.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`;
    const result = await getOffers(params, { authorization: isLogin });
    if (result?.success) {
      setTimeout(() => {
        setReqData(result?.data?.offers);
      }, 50);
    }

    setTimeout(() => {
      setApiLoadingData((prevVal) => ({
        ...prevVal,
        reqData: result?.loadingStatus,
        errorWhileLoading: result?.error,
      }));
    }, 50);
  };

  useEffect(() => {
    fetchReqLeng();
  }, [filter, isLogin]);

  useEffect(() => {
    fetchReqData();
  }, [pagination.currentPage, pagination?.totalPage, filter, isLogin]);

  const deleteData = async (itemId) => {
    let result = await deleteOfferUser(itemId, {
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
    setPagination,
    deleteData,
    continueProfilePath: currentUserData?.continueProfilePath,
  };
};

export default useAllOffers;
