import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOneQuote } from "Services/quotations";

import { getOnePrivateLabel } from "Services/privateLabel";
import { getOneRFQ } from "Services/rfq";
import { getOneWhiteLabel } from "Services/whiteLabel";
import { getOneSpmf } from "Services/customProduct";

export function useOneQuote() {
  const { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const quotationsId = searchParams.get("quotationsId");

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
    findQuotation: true,
  });

  const [requestedData, setRequestedData] = useState({});
  const [qouteOn, setQouteOn] = useState({});

  useEffect(() => {
    async function fetchReqData() {
      setApiLoadingData((prevVal) => ({
        ...prevVal,
        reqData: true,
        findQuotation: true,
      }));

      const QouteIdConfigResp = await getOneQuote(
        quotationsId,
        "include=importer"
      );

      if (QouteIdConfigResp?.success) {
        // Extract the quotations array from the response
        const { quotations } = QouteIdConfigResp.data;

        // if (item.privateLabelingId == privateLabelId) {
        // Use item.id to match with privateLabelId

        let qouteOnId = "";
        let qouteOnType = "";
        // let productId = "";
       
        if (quotations?.quotationRequestId) {
          qouteOnId = quotations.quotationRequestId;
          qouteOnType = "rfq";
          // productId = quotations.productId;
        }
        if (quotations?.sourcingRequestId) {
          qouteOnId = quotations.sourcingRequestId;
          qouteOnType = "offer";
          // productId = quotations.productId;
        }
        if (quotations?.specialManufacturingRequestId) {
          qouteOnId = quotations.specialManufacturingRequestId;
          qouteOnType = "spmf";
        }
        if (quotations?.privateLabelingId) {
          qouteOnId = quotations.privateLabelingId;
          qouteOnType = "privateLabeling";
          // productId = quotations.productId;
        }

        if (quotations?.whiteLabelingId) {
          qouteOnId = quotations.whiteLabelingId;
          qouteOnType = "whiteLabeling";
          // productId = quotations.productId;
        }
        setRequestedData((prevData) => ({
          ...prevData,
          ...quotations,
          qouteOnId: qouteOnId,
          qouteOnType: qouteOnType,
          // productId: productId,
        }));

       

        // QOUTION ON ON OF THESE
        // "quotationRequestId": null,
        // "sourcingRequestId": null,
        // "specialManufacturingRequestId": 19,
        // "privateLabelingId": null,
        // "whiteLabelingId": null,
        // "quotationRequest": null
      }
    }

    fetchReqData();
  }, [quotationsId, isLogin]);

  // -------------------------------------------------
  useEffect(() => {
    async function fetchReqData() {
      let result = "";
      if (requestedData?.qouteOnType == "offer") {
        // result = await getOneQuote(requestedData.qouteOnId, "include=product");
      }
      if (requestedData?.qouteOnType == "rfq") {
        result = await getOneRFQ(requestedData.qouteOnId, "include=product");

        console.log("resultssss", result);
      }

      if (requestedData?.qouteOnType == "spmf") {
        result = await getOneSpmf(requestedData.qouteOnId, {});

        console.log("resultssss", result);
      }
      if (requestedData?.qouteOnType == "whiteLabeling") {
        result = await getOneWhiteLabel(
          requestedData.qouteOnId,
          "include=product"
        );

        console.log("resultssss", result);
      }
      if (requestedData?.qouteOnType == "privateLabeling") {
        result = await getOnePrivateLabel(
          requestedData.qouteOnId,
          "include=product"
        );

        console.log("resultssss", result);
      }

      if (result?.success) {
        if (requestedData?.qouteOnType == "offer") {
          // setQouteOn(result.data.specialmanufacturingrequests);
        }
        if (requestedData?.qouteOnType == "rfq") {
          setQouteOn(result.data.quotationrequests);
        }

        if (requestedData?.qouteOnType == "spmf") {
          setQouteOn(result.data.specialmanufacturingrequests);
        }
        if (requestedData?.qouteOnType == "whiteLabeling") {
          setQouteOn(result.data.whitelabelings);
        }
        if (requestedData?.qouteOnType == "privateLabeling") {
          setQouteOn(result.data.privatelabelings);
        }
      }
    }

    fetchReqData();
  }, [requestedData]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
    qouteOn,
  };
}
