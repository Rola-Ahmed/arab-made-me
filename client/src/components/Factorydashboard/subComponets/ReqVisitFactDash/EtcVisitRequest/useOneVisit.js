import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOneVisit } from "Services/visit";

import { updateVisit } from "Services/FactoryRequests/visit";

export function useOneVisit() {
  const { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const visitReqId = searchParams.get("visitReqId");

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
      let result = await getOneVisit(visitReqId, "include=importer");

      console.log("result------------------", result);
      // check if private label has quotations

      if (result?.success) {
        setRequestedData((prevData) => ({
          ...prevData,
          ...result.data.visits,
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

    async function UpdateData(status) {
      // setApiLoadingData(true);

      let response = await updateVisit(
        visitReqId,
        { authorization: isLogin },
        { status: status }
      );
      console.log("response", response);
      if (response?.success) {
        setRequestedData((prevVal) => ({
          ...prevVal,
          status: status,
        }));
      }
    }

    fetchReqData();

    if (requestedData && requestedData.status === "open") {
      UpdateData("seen");
    }
  }, [
    visitReqId,
    isLogin,
    requestedData && requestedData.status === "open",
  ]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
  };
}
