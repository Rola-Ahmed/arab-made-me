import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOneWhiteLabel } from "Services/whiteLabel";

export function OneWhiteLabel() {
  const { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const whiteLabelId = searchParams.get("whiteLabelId");

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
      let result = await getOneWhiteLabel(
        whiteLabelId,
        "include=factory&include=product"
      );

      // check if private label has quotations

      if (result?.success) {
        setRequestedData((prevData) => ({
          ...prevData,
          ...result.data.whitelabelings ,
        }));
      }

      setApiLoadingData((prevVal) => ({
        ...prevVal,
        reqData: result?.loadingStatus,
        errorWhileLoading: result?.error,
      }));
    }

    fetchReqData();
  }, [whiteLabelId, isLogin]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
  };
}
