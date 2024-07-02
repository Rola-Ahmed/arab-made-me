import { useState } from "react";
import { errorHandler } from "utils/errorHandler";
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
    selectedDocs,
    specialCharacteristicsArr
  ) => {
    setLoadingState(true);
    clearResponseError();

    let data = {
      factoryId: values?.factoryId,
      productName: values.productName,
      technicalSpecifications: values.technicalSpecifications,
      inqueries: values.inqueries,
      specialCharacteristics: values.specialCharKeyWord
        ? { [values.specialCharKeyWord]: values.specialCharDesc }
        : {},
    };

    if (specialCharacteristicsArr?.length > 0) {
      specialCharacteristicsArr.forEach((index) => {
        const key = values[`specialCharKeyWord${index}`];
        const desc = values[`specialCharDesc${index}`];
        data.specialCharacteristics[key] = desc;
      });
    }

    try {
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
    } catch (error) {
      handleResponseError(errorHandler(error));
    }
  };

  const submitDocs = async (qoute_id, selectedDocs) => {
    setLoadingState(true);

    clearResponseError();
    const FormData = require("form-data");
    let data = new FormData();

    selectedDocs?.forEach((item) => data.append("docs", item.pdfFile));

    try {
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
    } catch (error) {
      // handleResponseError(errorHandler(error));
    }
  };

  return { submitForm, poAdded, submitDocs };
};

export default useFormSubmission;
