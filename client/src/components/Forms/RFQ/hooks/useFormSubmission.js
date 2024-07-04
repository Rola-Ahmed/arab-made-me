import { useState } from "react";
import useSubmitFormMsg from "hooks/useSubmitFormMsg";

import { addRfqMedia, addRfqLabel } from "Services/rfq";



const useFormSubmission = (isLogin, setErrorMsg, setIsLoading) => {
  const [rfqAdded, setRfqAdded] = useState({
    status: false,
    id: "",
  });


  function setLoadingState(loadingStatus) {
    setIsLoading((prev) => ({ ...prev, submitLoading: loadingStatus }));
  }

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

    let data = {
      factoryId: values.factoryId,
      productId: values.productId,
      productName: values.productName,

      deadline: values.deadLine,
      quantity: values.quantity,
      shippingConditions:
        values.shippingConditions == "other"
          ? values.shippingConditionsOther
          : values.shippingConditions,
      packingConditions:
        values.packingConditions == "other"
          ? values.packingConditionsOther
          : values.packingConditions,
      paymentTerms:
        values.paymentType == "other"
          ? values.paymentTypeOther
          : values.paymentType,
      qualityConditions:
        values.qualityConditions == "other"
          ? values.qualityConditionsOther
          : values.qualityConditions,

      // if  values.moreDetails!==null add value
      ...(values.otherInformation && {
        otherInfoRequest: values.otherInformation,
      }),
    };

    // try {
    let result = await addRfqLabel({ authorization: isLogin }, data);

    if (result?.success) {
      if (selectedDocs.length > 0) {
        setRfqAdded({
          status: true,
          id: result.data.quotationRequest.id,
        });
        await submitDocs(result.data.quotationRequest.id, selectedDocs);
      } else {
        // display  successfully submitted message
        handleSubmitMsg("RFQ Request");
      }
    } else {
      handleResponseError(result.error);
    }
  };

  const submitDocs = async (qoute_id, selectedDocs) => {
    setLoadingState(true);

    clearResponseError();
    // const FormData = require("form-data");
    let data = new FormData();

    selectedDocs?.forEach((item) => data.append(item.keyWord, item.pdfFile));

    try {
      let result = await addRfqMedia(
        qoute_id,
        { authorization: isLogin },
        data
      );

      if (result?.success) {
        setLoadingState(true);
        handleSubmitMsg("RFQ Request");
      } else {
        handleResponseError(result.error);
      }
    } catch (error) {}
  };

  return { submitForm, rfqAdded, submitDocs,handleSubmitMsg };
};

export default useFormSubmission;
