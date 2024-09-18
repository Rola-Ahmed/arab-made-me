import { addFactoryMedia, updateFactoryFromUser } from "Services/factory";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useFormSubmission = (
  isLogin,
  setErrorMsg,
  setIsLoading,
  updateCurrentUser
) => {
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
    if (selectedDocs?.length == 0) {
      setLoadingState(false);
      handleResponseError("Legal Documents is requried");
      return;
    }

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
      ...(values.BusinessRegistrationNumber && {
        BusinessRegistrationNumber: values.BusinessRegistrationNumber,
      }),
    };

    // try {
    let result = await updateFactoryFromUser({ authorization: isLogin }, data);

    if (result?.success) {
      setRequestAddedText(true);
      await submitDocs(selectedDocs);
    } else {
      setLoadingState(false);
      handleResponseError(result.error);
    }
  };

  const submitDocs = async (selectedDocs) => {
    setLoadingState(true);
    if (selectedDocs?.length == 0) {
      setLoadingState(false);
      handleResponseError("Legal Documents is requried");
      return;
    }

    clearResponseError();
    let data = new FormData();

    selectedDocs?.forEach((item) => data.append(item.keyWord, item.pdfFile));

    try {
      let result = await addFactoryMedia({ authorization: isLogin }, data);

      if (result?.success) {
        setLoadingState(true);
        navigate(`/factorydashboard`);
        updateCurrentUser(result?.data?.factory);
      } else {
        handleResponseError(result.error);
        setLoadingState(false);
      }
    } catch (error) {}
  };

  return { submitForm, submitDocs, requestAddedText };
};

export default useFormSubmission;
