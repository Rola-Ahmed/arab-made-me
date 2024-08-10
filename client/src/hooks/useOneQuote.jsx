import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOneQuote } from "Services/quotations";

import { getOnePrivateLabel } from "Services/privateLabel";
import { getOneRFQ } from "Services/rfq";
import { getOneWhiteLabel } from "Services/whiteLabel";
import { getOneSpmf } from "Services/customProduct";
import { getOneSourcingReq } from "Services/sourcingReuqest";

export function useOneQuote() {
  const { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const quotationsId = searchParams.get("quotationsId");

  const [apiLoadingData, setApiLoadingData] = useState({
    loading: true,
    errorWhileLoading: null,
    findQuotation: true,
  });

  const [requestedData, setRequestedData] = useState({});
  const [qouteOn, setQouteOn] = useState({});

  useEffect(() => {
    async function fetchReqData() {
      const QouteIdConfigResp = await getOneQuote(
        quotationsId,
        "include=importer&include=factory"
      );

      if (QouteIdConfigResp?.success) {
        // Extract the quotations array from the response
        const { quotations } = QouteIdConfigResp.data;

        // if (item.privateLabelingId == privateLabelId) {
        // Use item.id to match with privateLabelId

        let qouteOnId = "";
        let qouteOnType = "";
        let title = "";

        // let productId = "";

        if (quotations?.quotationRequestId) {
          qouteOnId = quotations.quotationRequestId;
          qouteOnType = "rfq";
          title = " RFQ";
          // productId = quotations.productId;
        }
        if (quotations?.sourcingRequestId) {
          qouteOnId = quotations.sourcingRequestId;
          qouteOnType = "request";
          title = " Sourcing Request";

          // productId = quotations.productId;
        }
        if (quotations?.specialManufacturingRequestId) {
          qouteOnId = quotations.specialManufacturingRequestId;
          qouteOnType = "spmf";
          title = " Custom Product Request";
        }
        if (quotations?.privateLabelingId) {
          qouteOnId = quotations.privateLabelingId;
          qouteOnType = "privateLabeling";
          title = " Private Labeling";

          // productId = quotations.productId;
        }

        if (quotations?.whiteLabelingId) {
          qouteOnId = quotations.whiteLabelingId;
          qouteOnType = "whiteLabeling";
          title = "White Labeling";

          // productId = quotations.productId;
        }
        setRequestedData((prevData) => ({
          ...prevData,
          ...quotations,
          qouteOnId: qouteOnId,
          qouteOnType: qouteOnType,
          title: title,
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
      setApiLoadingData((prevVal) => ({
        ...prevVal,

        loading: QouteIdConfigResp?.loadingStatus,
        errorWhileLoading: QouteIdConfigResp?.loadierrorngStatus,
      }));
    }

    fetchReqData();
  }, [quotationsId, isLogin]);

  // -------------------------------------------------
  useEffect(() => {
    async function fetchReqData() {
      let result = "";
      if (requestedData?.qouteOnType == "request") {
        result = await getOneSourcingReq(requestedData?.qouteOnId, {});
      }
      if (requestedData?.qouteOnType == "rfq") {
        result = await getOneRFQ(requestedData?.qouteOnId, "include=product");
      }

      if (requestedData?.qouteOnType == "spmf") {
        result = await getOneSpmf(requestedData?.qouteOnId, {});
      }
      if (requestedData?.qouteOnType == "whiteLabeling") {
        result = await getOneWhiteLabel(
          requestedData?.qouteOnId,
          "include=product"
        );
      }
      if (requestedData?.qouteOnType == "privateLabeling") {
        result = await getOnePrivateLabel(
          requestedData?.qouteOnId,
          "include=product"
        );
      }

      if (result?.success) {
        if (requestedData?.qouteOnType == "request") {
          setQouteOn(result?.data?.sourcingrequests);
        }
        if (requestedData?.qouteOnType == "rfq") {
          setQouteOn(result?.data?.quotationrequests);
        }

        if (requestedData?.qouteOnType == "spmf") {
          setQouteOn(result?.data?.specialmanufacturingrequests);
        }
        if (requestedData?.qouteOnType == "whiteLabeling") {
          setQouteOn(result?.data?.whitelabelings);
        }
        if (requestedData?.qouteOnType == "privateLabeling") {
          setQouteOn(result?.data?.privatelabelings);
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
