import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOnePrivateLabel } from "Services/privateLabel";

export function usePrivateLabel() {
  const { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const privateLabelId = searchParams.get("privateLabelId");

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
    findQuotation: true,
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
      let result = await getOnePrivateLabel(
        privateLabelId,
        "include=factory&include=product"
      );

      console.log("result",result)
      // check if private label has quotations

      if (result?.success) {
        setRequestedData((prevData) => ({
          ...prevData,
          ...result.data.privatelabelings,
        }));
        setApiLoadingData((prevVal) => ({
          ...prevVal,
          reqData: false,
        }));
      } else {
        setApiLoadingData((prevVal) => ({
          ...prevVal,
          reqData: true,
          errorWhileLoading: result?.error,
        }));
      }
    }

    fetchReqData();
  }, [privateLabelId, isLogin]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
  };
}
