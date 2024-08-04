import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getOneSourcingReq } from "Services/sourcingReuqest";

export function useFetchData() {
  const [searchParams] = useSearchParams();
  const sourcingReqId = searchParams.get("sourcingReqId");

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
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
      let result = await getOneSourcingReq(sourcingReqId);

      // check if private label has quotations

      if (result?.success) {
        setRequestedData(result?.data?.sourcingrequests);
        setApiLoadingData((prevVal) => ({
          ...prevVal,
          reqData: false,
        }));
      } else {
        setApiLoadingData((prevVal) => ({
          ...prevVal,
          reqData: result?.loadingStatus,
          errorWhileLoading: result?.error,
        }));
      }
    }

    fetchReqData();
  }, [sourcingReqId]);
  console.log("result", requestedData);

  return {
    requestedData,
    apiLoadingData,
  };
}
