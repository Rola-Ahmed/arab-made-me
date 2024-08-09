import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOnePO } from "Services/PO";
export function useOnePo() {
  const { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const poId = searchParams.get("poId");

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
  });

  const [requestedData, setRequestedData] = useState({ quoteId: null });

  useEffect(() => {
    async function fetchReqData() {

      // get private label data
      let result = await getOnePO(
        poId,
        "include=product&include=factory&include=sourcingOffer"
      );

     

      if (result?.success) {
        setRequestedData((prevData) => ({
          ...prevData,
          ...result.data.purchasingorders,
        }));
      }
      
        setApiLoadingData((prevVal) => ({
          ...prevVal,
          reqData: result?.loadingStatus,
          errorWhileLoading: result?.error,
        }));

    
    }

    fetchReqData();
  }, [poId, isLogin]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
  };
}
