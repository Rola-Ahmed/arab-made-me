import { useState, useEffect } from "react";
import { getSourcingReuqests } from "Services/sourcingReuqest";

export function useSourcingRequests(size) {
  const [allSourcingRequest, setAllSourcingRequest] = useState([]);
  const [apiStatus, setApiStatus] = useState({
    laoding: true,
    errorMsg: null,
  });

  useEffect(() => {
    async function fetchSourcingReqData() {
      setApiStatus((prevValue) => ({ ...prevValue, laoding: true }));
      let result = await getSourcingReuqests(`size=${size}&include=importer`);
      if (result?.success) {
        setAllSourcingRequest(result.data?.sourcingrequests);
      }
      setApiStatus({
        laoding: result?.loadingStatus,
        errorMsg: result?.error,
      });
  
    }

    fetchSourcingReqData();
  }, [size]);

  return { allSourcingRequest, apiStatus };
}
