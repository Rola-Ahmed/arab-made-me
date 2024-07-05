import useSubmitFormMsg from "hooks/useSubmitFormMsg";
import { addvisitRequest } from "Services/visit";

const useFormSubmission = (isLogin, setErrorMsg, setIsLoading) => {
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

  const submitForm = async (values) => {
    setLoadingState(true);
    clearResponseError();

    let data = {
      purpose: values.visitPurpose,
      date: values.visitDate,
      factoryId: values.factoryId,
    };

    let result = await addvisitRequest({ authorization: isLogin }, data);
    if (result?.success) {
      handleSubmitMsg("Factory Visit Request");
    } else {
      handleResponseError(result.error);
    }
  };
  return { submitForm };
};

export default useFormSubmission;
