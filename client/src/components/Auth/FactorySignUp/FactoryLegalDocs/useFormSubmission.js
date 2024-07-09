import { addFactoryMedia, updateFactoryFromUser } from "Services/factory";
import { useNavigate } from "react-router-dom";
import  { useState } from "react";

const useFormSubmission = (isLogin, setErrorMsg, setIsLoading) => {
  let navigate = useNavigate();

  const [requestAddedText, setRequestAddedText] = useState(false);

  function setLoadingState(loadingStatus) {
    setIsLoading((prev) => ({ ...prev, submitLoading: loadingStatus }));
  }

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
      ...(values.taxRegisterationNumber && {
        taxRegisterationNumber: values.taxRegisterationNumber,
      }),
      ...(values.commercialRegisterationNumber && {
        commercialRegisterationNumber: values.commercialRegisterationNumber,
      }),
      ...(values.IndustrialLicenseNumber && {
        IndustrialLicenseNumber: values.IndustrialLicenseNumber,
      }),
      ...(values.IndustrialRegistrationNumber && {
        IndustrialRegistrationNumber: values.IndustrialRegistrationNumber,
      }),
    };

    // try {
    let result = await updateFactoryFromUser({ authorization: isLogin }, data);

    if (result?.success) {
      setRequestAddedText(true);
      if (selectedDocs.length > 0) {
        await submitDocs(selectedDocs);
      } else {
        // display  successfully submitted message
        navigate(`/factorydashboard`);
      }
    } else {
      handleResponseError(result.error);
    }
  };

  const submitDocs = async (selectedDocs) => {
    setLoadingState(true);

    clearResponseError();
    let data = new FormData();

    selectedDocs?.forEach((item) => data.append(item.keyWord, item.pdfFile));

    try {
      let result = await addFactoryMedia({ authorization: isLogin }, data);

      if (result?.success) {
        setLoadingState(true);
        navigate(`/factorydashboard`);
      } else {
        handleResponseError(result.error);
      }
    } catch (error) {}
  };

  return { submitForm, submitDocs,requestAddedText };
};

export default useFormSubmission;
