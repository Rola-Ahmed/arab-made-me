import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOneSpmf } from "Services/customProduct";

export function useOneSpmf() {
  const { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const customProductId = searchParams.get("customProductId");

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
    findQuotation: true,
  });

  const [requestedData, setRequestedData] = useState({ quoteId: null });

  useEffect(() => {
    async function fetchReqData() {
      setApiLoadingData((prevVal) => ({
        ...prevVal,
        reqData: true,
        findQuotation: true,
      }));

      // get private label data
      let result = await getOneSpmf(customProductId, "include=factory");

      // check if private label has quotations

      if (result?.success) {
        setRequestedData((prevData) => ({
          ...prevData,
          ...result.data.specialmanufacturingrequests,
        }));
        setApiLoadingData((prevVal) => ({
          ...prevVal,
          reqData: false,
        }));
      } else {
        setApiLoadingData((prevVal) => ({
          ...prevVal,
          reqData: true,
          errorWhileLoading: result?.error,
        }));
      }
    }

    fetchReqData();
  }, [customProductId, isLogin, ,]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
  };
}
