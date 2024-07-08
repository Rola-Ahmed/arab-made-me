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

    let data = {
      factoryId: values?.factoryId,
      productId: values?.productId,
      productName: values.productName,

      // productId: 562,
      // productName: "Scarlett Mueller",

      // if  values.moreDetails!==null add value
      ...(values.moreDetails && { moreDetails: values.moreDetails }),
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

  return { submitForm, privateLabelAdded, submitDocs,handleSubmitMsg };
};

export default useFormSubmission;
