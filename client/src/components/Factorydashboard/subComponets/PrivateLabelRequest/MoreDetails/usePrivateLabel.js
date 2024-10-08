import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOnePrivateLabel } from "Services/privateLabel";
import { updatePrivateLabel } from "Services/FactoryRequests/privateLabel";
import { getQuotes } from "Services/FactoryRequests/quotations";
import { userDetails } from "Context/userType";

export function usePrivateLabel() {
  const { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const privateLabelId = searchParams.get("privateLabelId");
  const { currentUserData } = useContext(userDetails);

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
    findQuotation: true,
  });

  const [requestedData, setRequestedData] = useState({ quoteId: null });

  useEffect(() => {
    async function fetchReqData() {
      // get private label data
      let result = await getOnePrivateLabel(
        privateLabelId,
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
          if (item.privateLabelingId == privateLabelId) {
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
      let response = await updatePrivateLabel(
        privateLabelId,
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

    if (requestedData && requestedData.status == "open") {
      UpdateData("seen");
    }
  }, [
    privateLabelId,
    isLogin,
    requestedData && requestedData.status == "open",
  ]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
    continueProfilePath: currentUserData?.continueProfilePath,
  };
}
