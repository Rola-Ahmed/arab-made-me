import { useState, useContext } from "react";
import SuccessToast from "components/SuccessToast";
import { useNavigate } from "react-router-dom";
import { UserToken } from "Context/userToken";

import {
  addSourcingRequest,
  addSourcingRequestrMedia,
} from "Services/sourcingReuqest";

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
  function dataSaved() {
    SuccessToast("Your Sourcing Request has been successfully submitted");

    navigate("/importerdashboard/AllSourcingRequests");
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
      quantity,
      productDescription,
      shippingConditions,
      shippingConditionsOther,
      packingConditions,
      packingConditionsOther,
      qualityConditionsOther,
      qualityConditions,

      deadline,
      otherInfoRequest,
    } = values;

    let data = {
      productName,
      quantity,
      productDescription,

      ...(deadline && { deadline: deadline }),
      ...(otherInfoRequest && { otherInfoRequest: otherInfoRequest }),
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
      specialCharacteristics: {},
    };
    if (values.country.length !== 0) {
      data.preferredCountries = values.country;
    }
    if (Object.keys(values.productCharacteristic).length != 0) {
      // create an object with the keyword property as the key and the value property as the value.
      const obj = Object.fromEntries(
        values.productCharacteristic.map((obj) => [obj.keyword, obj.value])
      );
      data.specialCharacteristics = obj;
    }

    let result = await addSourcingRequest({ authorization: isLogin }, data);

    if (result?.success) {
      setIsLoading(true);

      setSourcingOfferAdded({
        status: true,
        id: result.data.sourcingRequest.id,
      });
      if (selectedDocs?.length > 0) {
        await submitDocs(result.data.sourcingRequest.id, selectedDocs);
      } else {
        dataSaved();
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

    let result = await addSourcingRequestrMedia(
      qoute_id,
      { authorization: isLogin },
      data
    );

    if (result?.success) {
      setLoadingState(true);
      dataSaved();
    } else {
      handleResponseError(result.error);
    }
  };

  return { submitForm, sourcingOfferAdded, submitDocs };
};

export default useFormSubmission;
