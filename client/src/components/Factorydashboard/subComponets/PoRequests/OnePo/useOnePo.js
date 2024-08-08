import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOnePO } from "Services/PO";
import { getQuotes } from "Services/FactoryRequests/quotations";

export function useOnePo() {
  const { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const poId = searchParams.get("poId");

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
    findQuotation: true,
  });

  const [requestedData, setRequestedData] = useState({ quoteId: null });

  useEffect(() => {
    async function fetchReqData() {
     
      // get private label data
      let result = await getOnePO(
        poId,
        "include=product&include=sourcingOffer&include=importer"
      );

      // check if private label has quotations
      const QouteIdConfigResp = await getQuotes(
        {},
        {
          authorization: isLogin,
        }
      );

      if (result?.success) {
        setRequestedData((prevData) => ({
          ...prevData,
          ...result?.data?.purchasingorders,
        }));
      }
    
        setApiLoadingData((prevVal) => ({
          ...prevVal,
          reqData: result?.loadingStatus,
          errorWhileLoading: result?.error,
        }));

      if (QouteIdConfigResp?.success) {
        // Extract the quotations array from the response
        const { quotations } = QouteIdConfigResp.data;

        quotations.forEach((item) => {
          if (item.privateLabelingId == poId) {
            // Use item.id to match with privateLabelId
            setRequestedData((prevData) => ({
              ...prevData,
              quoteId: item.id, // Use item.id directly
            }));
            setApiLoadingData((prevVal) => ({
              ...prevVal,
              findQuotation: false,
            }));
          }
        });
      }
    }

    fetchReqData();
  }, [poId, isLogin]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
  };
}
