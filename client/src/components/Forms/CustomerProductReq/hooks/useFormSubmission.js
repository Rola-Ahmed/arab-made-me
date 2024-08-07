import { useState } from "react";
import useSubmitFormMsg from "hooks/useSubmitFormMsg";
import {
  addCustomProductlMedia,
  addCustomProduct,
} from "Services/customProduct";

const useFormSubmission = (isLogin, setIsLoading, setErrorMsg) => {
  const [poAdded, setPoAdded] = useState({ status: false, id: "" });
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
    let {
      factoryId,
      productName,
      technicalSpecifications,
      inqueries,
      quantity,
      deadline,
      timeLine,

      SupplyLocation,
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
      // paymentType,
      // paymentTypeOther,
      //
      qualityConditions,
      qualityConditionsOther,
    } = values;

    let data = {
      factoryId,
      productName,
      technicalSpecifications,
      inqueries,
      quantity,
      supplyLocation: SupplyLocation,
      deadline,
      timeLine,

      specialCharacteristics: {},

      packingType:
        packingConditions == "other"
          ? packingConditionsOther
          : packingConditions,

      shippingSize:
        ShippingTypeSize == "other" ? ShippingTypeSizeOther : ShippingTypeSize,

      shippingConditions:
        shippingConditions == "other"
          ? shippingConditionsOther
          : shippingConditions,

      qualityConditions:
        qualityConditions == "other"
          ? qualityConditionsOther
          : qualityConditions,

      // paymentTerms: paymentType == "other" ? paymentTypeOther : paymentType,
    };

    if (values?.productCharacteristic?.[0]?.keyword !='') {

      
      // create an object with the keyword property as the key and the value property as the value.
      const obj = Object.fromEntries(
        values.productCharacteristic.map((obj) => [obj.keyword, obj.value])
      );
      data.specialCharacteristics = obj;
    }

    let result = await addCustomProduct({ authorization: isLogin }, data);

    if (result?.success) {
      if (selectedDocs.length > 0) {
        setPoAdded({
          status: true,
          id: result.data.specialManufacturing.id,
        });
        await submitDocs(result.data.specialManufacturing.id, selectedDocs);
      } else {
        // display  successfully submitted message
        handleSubmitMsg("Custom product Request");
      }
    } else {
      handleResponseError(result.error);
    }
  };

  const submitDocs = async (qoute_id, selectedDocs) => {
    setLoadingState(true);

    clearResponseError();
    const FormData = require("form-data");
    let data = new FormData();

    selectedDocs?.forEach((item) => data.append("docs", item.pdfFile));

      let result = await addCustomProductlMedia(
        qoute_id,
        { authorization: isLogin },
        data
      );

      if (result?.success) {
        setLoadingState(true);
        handleSubmitMsg("Custom product Request");
      } else {
        handleResponseError(result.error);
      }
  };

  return { submitForm, poAdded, submitDocs ,handleSubmitMsg};
};

export default useFormSubmission;
