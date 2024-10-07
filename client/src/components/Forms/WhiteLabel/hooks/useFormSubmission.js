import { useState } from "react";
import useSubmitFormMsg from "hooks/useSubmitFormMsg";

import { addWhiteLabel, addWhiteLabelMedia } from "Services/whiteLabel";

const useFormSubmission = (isLogin, setErrorMsg, setLoadingState) => {
  const [privateLabelAdded, setPrivateLabelAdded] = useState({
    status: false,
    id: "",
  });

  const handleSubmitMsg = useSubmitFormMsg();

  function clearResponseError() {
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });
  }

  function scrollToView(elementId) {
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  function handleResponseError(message) {
    setLoadingState(false);
    setErrorMsg((prevErrors) => ({ ...prevErrors, response: message }));
    scrollToView("view");
  }

  const submitForm = async (
    values,
    selectedDocs
    // specialCharacteristicsArr
  ) => {
    setLoadingState(true);
    clearResponseError();

    let {
      factoryId,
      productId,
      productName,
      moreDetails,

      deadline,
      SupplyLocation,

      // SupplyLocation,
      //
      ShippingTypeSizeOther,
      ShippingTypeSize,
      //
      shippingConditionsOther,
      shippingConditions,
      //
      packingConditions,
      packingConditionsOther,
      //
      paymentType,
      paymentTypeOther,
      //
      qualityConditions,
      qualityConditionsOther,
    } = values;

    let data = {
      factoryId,
      ...(productId && { productId: productId }), //optioal
      ...(productName && { productName: productName }),//optioal

      deadline,
      supplyLocation: SupplyLocation,

      ...(moreDetails && { moreDetails: moreDetails }),

      shippingSize:
        ShippingTypeSize == "other" ? ShippingTypeSizeOther : ShippingTypeSize,

      shippingConditions:
        shippingConditions == "other"
          ? shippingConditionsOther
          : shippingConditions,

      packingConditions:
        packingConditions == "other"
          ? packingConditionsOther
          : packingConditions,
      paymentTerms: paymentType == "other" ? paymentTypeOther : paymentType,
      qualityConditions:
        qualityConditions == "other"
          ? qualityConditionsOther
          : qualityConditions,
    };

    // try {
    let result = await addWhiteLabel({ authorization: isLogin }, data);

    if (result?.success) {
      if (selectedDocs.length > 0) {
        setPrivateLabelAdded({
          status: true,
          id: result.data.whiteLabeling.id,
        });
        await submitDocs(result.data.whiteLabeling.id, selectedDocs);
      } else {
        // display  successfully submitted message
        handleSubmitMsg(" White Label Request");
      }
    } else {
      handleResponseError(result.error);
    }
    // } catch (error) {
    //   handleResponseError(errorHandler(error));
    // }
  };

  const submitDocs = async (qoute_id, selectedDocs) => {
    setLoadingState(true);

    clearResponseError();
    const FormData = require("form-data");
    let data = new FormData();

    selectedDocs?.forEach((item) => data.append(item.keyWord, item.pdfFile));

    try {
      let result = await addWhiteLabelMedia(
        qoute_id,
        { authorization: isLogin },
        data
      );

      if (result?.success) {
        setLoadingState(true);
        handleSubmitMsg(" White Label Request");
      } else {
        handleResponseError(result.error);
      }
    } catch (error) {}
  };

  return { submitForm, privateLabelAdded, submitDocs, handleSubmitMsg };
};

export default useFormSubmission;
