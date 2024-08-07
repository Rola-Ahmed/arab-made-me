import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOneSpmf } from "Services/customProduct";
import { updateSpmf } from "Services/FactoryRequests/spmf";
import { getQuotes } from "Services/FactoryRequests/quotations";

export function useSpmf() {
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
      let result = await getOneSpmf(customProductId, "include=importer");

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
          ...result.data.specialmanufacturingrequests,
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
          if (item.specialManufacturingRequestId == customProductId) {
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

    async function UpdateData(status) {
      // setApiLoadingData(true);

      let response = await updateSpmf(
        customProductId,
        { authorization: isLogin },
        { status: status }
      );
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
  }, [customProductId, isLogin,requestedData && requestedData.status === "open"]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
  };
}
