import { useState, useEffect } from "react";
import { getSourcingOffers } from "Services/sourcingOffer";

export function useSourcingOffers(size) {
  const [allSourcingOffer, setAllSourcingOffer] = useState([]);
  const [apiStatus, setApiStatus] = useState({
    laoding: true,
    errorMsg: null,
  });

  useEffect(() => {
    async function fetchSourcingReqData() {
      setApiStatus((prevValue) => ({ ...prevValue, laoding: true }));
      let result = await getSourcingOffers(`size=${size}`);
      if (result?.success) {
        setAllSourcingOffer(result.data?.sourcingoffers);
      }
      setApiStatus({
        laoding: result?.loadingStatus,
        errorMsg: result?.error,
      });
    }

    fetchSourcingReqData();
  }, [size]);

  return { allSourcingOffer, apiStatus };
}
