import { useState } from "react";
import axios from "axios";
import { baseUrl } from "config.js";
import { errorHandler } from "utils/errorHandler";
import useSubmitFormMsg from "hooks/useSubmitFormMsg";

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
      let config = {
        method: "post",
        url: `${baseUrl}/spmfs/add`,
        headers: { authorization: isLogin },
        data: data,
      };

      const response = await axios.request(config);
      if (response.data.message === "done") {
        if (selectedDocs.length > 0) {
          setPoAdded({
            status: true,
            id: response.data.specialManufacturing.id,
          });
          await submitDocs(response.data.specialManufacturing.id, selectedDocs);
        } else {
          // display  successfully submitted message
          handleSubmitMsg("Custom product Request");
        }
      } else {
        handleResponseError(response?.data?.message);
      }
    } catch (error) {
      handleResponseError(errorHandler(error));
    }
  };

  const submitDocs = async (qoute_id, selectedDocs) => {
    const FormData = require("form-data");
    let data = new FormData();

    selectedDocs?.forEach((item) => data.append("docs", item.pdfFile));

    let config = {
      method: "put",
      url: `${baseUrl}/spmfs/uploadMedia/${qoute_id}`,
      headers: { authorization: isLogin },
      data: data,
    };

    try {
      const response = await axios.request(config);
      if (response.data.message === "done") {
        setLoadingState(true);
        handleSubmitMsg("Custom product Request");
      } else {
        handleResponseError(response?.data?.message);
      }
    } catch (error) {
      handleResponseError(errorHandler(error));
    }
  };

  return { submitForm, poAdded, submitDocs };
};

export default useFormSubmission;
