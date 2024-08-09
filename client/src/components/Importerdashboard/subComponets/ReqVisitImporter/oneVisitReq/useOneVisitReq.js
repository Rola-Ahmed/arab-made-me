import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOneRFQ } from "Services/rfq";

export function useOneRfq() {
  const { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const rfqReqId = searchParams.get("rfqReqId");

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
    findQuotation: true,
  });

  const [requestedData, setRequestedData] = useState();

  useEffect(() => {
    async function fetchReqData() {
      setApiLoadingData((prevVal) => ({
        ...prevVal,
        reqData: true,
        findQuotation: true,
      }));

      // get private label data
      let result = await getOneRFQ(rfqReqId, "include=factory&include=product");
      // check if private label has quotations
      if (result?.success) {
        setRequestedData((prevData) => ({
          ...prevData,
          ...result.data.quotationrequests,
        }));
      }
      setApiLoadingData((prevVal) => ({
        ...prevVal,
        reqData: result?.loadingStatus,
        errorWhileLoading: result?.error,
      }));
    }

    fetchReqData();
  }, [rfqReqId, isLogin]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
  };
}
