import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getOneSourcingReq } from "Services/sourcingReuqest";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
export function useFetchData() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  const [searchParams] = useSearchParams();
  const productName = searchParams.get("productName");
  let { id } = useParams();

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
  });

  const [requestedData, setRequestedData] = useState();

  useEffect(() => {
    async function fetchReqData() {
      // get private label data
      let result = await getOneSourcingReq(id);

      // check if private label has quotations

      if (result?.success) {
        setRequestedData(result?.data?.sourcingrequests);
      }
      setApiLoadingData((prevVal) => ({
        ...prevVal,
        reqData: result?.loadingStatus,
        errorWhileLoading: result?.error,
      }));
    }

    fetchReqData();
  }, [id]);

  return {
    requestedData,
    apiLoadingData,
    isLogin,
  };
}
