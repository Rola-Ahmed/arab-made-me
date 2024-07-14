import { useState } from "react";
import useSubmitFormMsg from "hooks/useSubmitFormMsg";

import {
  addPOMedia,
  addPoFromProduct,
  addPoFromSourcingOffer,
  addPoFromQuotation,
} from "Services/PO";

const useFormSubmission = (
  isLogin,
  setErrorMsg,
  setIsLoading,
  requestType,
  requestTypeValues
) => {
  const [poAdded, setPoAdded] = useState({
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
      factoryId: values?.factoryId || "",
      // repName: values.repName,
      // contactData: {
      //   email: values.repEmail,
      //   phone: values.repPhone,
      // },
      // otherConditions: values.otherConditions,
      productName: values.productName,
      quantity: values.quantity,

      ...(values.instructions && { instructions: values.instructions }),
      ...(values.conditionsOfDelays && {
        conditionsOfDelays: values.conditionsOfDelays,

        shippingConditions:
          values.shippingConditions == "other"
            ? values.shippingConditionsOther
            : values.shippingConditions,
      }),

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

      ...(values.timeManufacturingDelay && {
        timeOfManufacturingDelay: `${values.timeManufacturingDelay} ${values.timeManufacturingDelayDuration}`,
        timeLine: values.timeLine,
      }),

      // ---------new-----------
      supplyLocation: values.SupplyLocation,
      // ShippingTypeSize:values.SupplyLocation,
    };

    if (values.productId !== "") {
      data.productId = values.productId;
    }

    if (values.sourcingOfferId !== "") {
      data.sourcingOfferId = values.sourcingOfferId;
    }

    // try {
    let result;
    if (
      requestType == requestTypeValues?.fromFactory ||
      requestType == requestTypeValues?.fromSelectedProduct
    ) {
      result = await addPoFromProduct({ authorization: isLogin }, data);
    } else if (requestType == requestTypeValues?.fromSourcingReuqest) {
      result = await addPoFromSourcingOffer({ authorization: isLogin }, data);
    } else if (requestType == requestTypeValues?.fromQuotation) {
      result = await addPoFromQuotation({ authorization: isLogin }, data);
    }

    if (result?.success) {
      if (selectedDocs.length > 0) {
        setPoAdded({
          status: true,
          id: result.data.purchasingOrder.id,
        });
        await submitDocs(result.data.purchasingOrder.id, selectedDocs);
      } else {
        // display  successfully submitted message
        handleSubmitMsg("PO Request");
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
      let result = await addPOMedia(qoute_id, { authorization: isLogin }, data);

      if (result?.success) {
        setLoadingState(true);
        handleSubmitMsg("po Request");
      } else {
        handleResponseError(result.error);
      }
    } catch (error) {}
  };

  return { submitForm, poAdded, submitDocs, handleSubmitMsg };
};

export default useFormSubmission;
