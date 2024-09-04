import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOneWhiteLabel } from "Services/whiteLabel";
import { updateWhiteLabel } from "Services/FactoryRequests/whiteLabel";
import { getQuotes } from "Services/FactoryRequests/quotations";
import { userDetails } from "Context/userType";

export function useWhiteLabel() {
  const { isLogin } = useContext(UserToken);
  const { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const whiteLabelId = searchParams.get("whiteLabelId");

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
      let result = await getOneWhiteLabel(
        whiteLabelId,
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
          ...result.data.whitelabelings,
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
          if (item.whiteLabelingId == whiteLabelId) {
            // Use item.id to match with whiteLabelingId
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
      setApiLoadingData(true);

      let response = await updateWhiteLabel(
        whiteLabelId,
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
  }, [whiteLabelId, isLogin]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
    continueProfilePath: currentUserData?.continueProfilePath,
  };
}
