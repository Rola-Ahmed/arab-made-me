import { useState, useContext } from "react";
import SuccessToast from "components/SuccessToast";
import { useNavigate } from "react-router-dom";
import { UserToken } from "Context/userToken";

import {
  addSourcingOffer,
  addSourcingOfferMedia,
} from "Services/sourcingOffer";

const useFormSubmission = (setErrorMsg, setIsLoading) => {
  const { isLogin } = useContext(UserToken);

  let navigate = useNavigate();

  const [sourcingOfferAdded, setSourcingOfferAdded] = useState({
    status: false,
    id: "",
  });

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
    // clear error message
    clearResponseError();

    let {
      productName,
      categoryId,
      productDescription,
      price,
      quantity,
      productHSNCode,
      country,
      productId,

      //
      shippingConditionsOther,
      shippingConditions,
      //
      paymentType,
      paymentTypeOther,

      qualityConditions,
      qualityConditionsOther,
      //
      packingConditions,
      packingConditionsOther,
    } = values;

    let data = {
      price,
      productName,
      productDescription,
      categoryId,
      quantity,

      ...(productHSNCode && { productHSNCode: productHSNCode }),
      ...(values.country.length !== 0 && { preferredCountries: country }),
      ...(productId && { productId: productId }),
      shippingConditions:
        shippingConditions == "other"
          ? shippingConditionsOther
          : shippingConditions,
      packingConditions:
        packingConditions == "other"
          ? packingConditionsOther
          : packingConditions,
      qualityConditions:
        qualityConditions == "other"
          ? qualityConditionsOther
          : qualityConditions,
    };

    let result = await addSourcingOffer({ authorization: isLogin }, data);

    if (result?.success) {
      setIsLoading(true);

      setSourcingOfferAdded({
        status: true,
        id: result.data.sourcingOffer.id,
      });
      if (selectedDocs?.length > 0) {
        await submitDocs(result.data.sourcingOffer.id, selectedDocs);
      } else {
        SuccessToast(
          "Your sourcing offer Form has been successfully submitted"
        );

        navigate("/factorydashboard/AllFactoryOffers");
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
      let result = await addSourcingOfferMedia(
        qoute_id,
        { authorization: isLogin },
        data
      );

      if (result?.success) {
        setLoadingState(true);
        SuccessToast(
          "Your sourcing offer Form has been successfully submitted"
        );

        navigate("/factorydashboard/AllFactoryOffers");
      } else {
        handleResponseError(result.error);
      }
    } catch (error) {}
  };

  return { submitForm, sourcingOfferAdded, submitDocs };
};

export default useFormSubmission;
