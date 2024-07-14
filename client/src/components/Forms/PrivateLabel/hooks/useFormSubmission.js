import { useState } from "react";
import useSubmitFormMsg from "hooks/useSubmitFormMsg";

import { addPrivateLabelMedia, addPrivateLabel } from "Services/privateLabel";

const useFormSubmission = (isLogin, setErrorMsg, setIsLoading) => {
  const [privateLabelAdded, setPrivateLabelAdded] = useState({
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
      factoryId: values?.factoryId,
      // productId: values?.productId,
      // productName: values.productName,

      ...(values.productId && { productId: values.productId }),
      ...(values.productName && { productName: values.productName }),

      // if  values.moreDetails!==null add value
      ...(values.moreDetails && { moreDetails: values.moreDetails }),
    };

    // try {
    let result = await addPrivateLabel({ authorization: isLogin }, data);

    if (result?.success) {
      if (selectedDocs.length > 0) {
        setPrivateLabelAdded({
          status: true,
          id: result.data?.privateLabeling?.id,
        });
        await submitDocs(result.data?.privateLabeling?.id, selectedDocs);
      } else {
        // display  successfully submitted message
        handleSubmitMsg("Private Label Request");
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
      let result = await addPrivateLabelMedia(
        qoute_id,
        { authorization: isLogin },
        data
      );

      if (result?.success) {
        setLoadingState(true);
        handleSubmitMsg("Private Label Request");
      } else {
        handleResponseError(result.error);
      }
    } catch (error) {}
  };

  return { submitForm, privateLabelAdded, submitDocs, handleSubmitMsg };
};

export default useFormSubmission;
