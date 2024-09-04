import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOneRFQ } from "Services/rfq";
import { updateRFQ } from "Services/FactoryRequests/rfq";
import { getQuotes } from "Services/FactoryRequests/quotations";
import { userDetails } from "Context/userType";

export function useOneRfq() {
  const { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const rfqReqId = searchParams.get("rfqReqId");
  const { currentUserData } = useContext(userDetails);
  const [requestedData, setRequestedData] = useState({ quoteId: null });
  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
    findQuotation: true,
  });

  useEffect(() => {
    async function fetchReqData() {
      // get private label data
      let result = await getOneRFQ(
        rfqReqId,
        "include=importer&include=product"
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
          ...result.data.privatelabelings,
        }));
      }
      //  else {
      setApiLoadingData((prevVal) => ({
        ...prevVal,
        reqData: result?.loadingStatus,
        errorWhileLoading: result?.error,
      }));
      // }

      if (QouteIdConfigResp?.success) {
        // Extract the quotations array from the response
        const { quotations } = QouteIdConfigResp.data;

        quotations.forEach((item) => {
          if (item.quotationRequestId == rfqReqId) {
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
      let response = await updateRFQ(
        rfqReqId,
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
  }, [rfqReqId, isLogin]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
    continueProfilePath: currentUserData?.continueProfilePath,
  };
}
