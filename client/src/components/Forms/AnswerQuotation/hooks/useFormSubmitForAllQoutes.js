import useSubmitFormMsg from "hooks/useSubmitFormMsg";

import {
  addqouteForSpmf,
  addqouteForWhiteLabel,
  addqouteForPrivateLabel,
  addqouteForSourcingReq,
  addqouteForRfq,
} from "Services/quotations";

const useFormSubmitForAllQoutes = (isLogin, setErrorMsg, setIsLoading) => {
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
    extraDataForSecpificForm,
    requestType
    // specialCharacteristicsArr
  ) => {
    setLoadingState(true);
    clearResponseError();

    let {
      importerId,
      //   productName,
    //   quantity,
      minQuantity,
      price,
      deadline,
      SupplyLocation,
      //
      qualityConditions,
      qualityConditionsOther,
      //
      paymentType,
      paymentTypeOther,
      //
      packingConditionsOther,
      packingConditions,
      //
      shippingConditions,
      shippingConditionsOther,
      //
      ShippingTypeSize,
      ShippingTypeSizeOther,
      //
      moreDetails,
      discounts,
      timeLine,
      notes,
    } = values;

    let data = {
      importerId,
      //   productName,
      price,
    //   quantity,
      minQuantity,
      deadline,
      timeLine,
      supplyLocation: SupplyLocation,

      qualityConditions:
        qualityConditions == "other"
          ? qualityConditionsOther
          : qualityConditions,

      shippingConditions:
        shippingConditions == "other"
          ? shippingConditionsOther
          : shippingConditions,

      packingConditions:
        packingConditions == "other"
          ? packingConditionsOther
          : packingConditions,

      shippingSize:
        ShippingTypeSize == "other" ? ShippingTypeSizeOther : ShippingTypeSize,

      paymentTerms: paymentType == "other" ? paymentTypeOther : paymentType,

      ...(moreDetails && { moreDetails }),
      ...(discounts && { discounts }),

      ...(notes && { notes }),

      ...extraDataForSecpificForm,
    };


    console.log("dataa quote",data)
    let result = "";
    if (requestType == "rfq") {
      result = await addqouteForRfq({ authorization: isLogin }, data);
    }

    if (result?.success) {
      // display  successfully submitted message
      handleSubmitMsg("Quotation");
    } else {
      handleResponseError(result.error);
    }
  };

  return { submitForm  };
};

export default useFormSubmitForAllQoutes;


