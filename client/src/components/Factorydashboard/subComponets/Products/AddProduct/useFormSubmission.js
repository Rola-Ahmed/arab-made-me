import { useState, useContext } from "react";
import SuccessToast from "components/SuccessToast";
import { useNavigate } from "react-router-dom";
import { UserToken } from "Context/userToken";

import { addProduct, addProductMedia } from "Services/products";

const useFormSubmission = (setErrorMsg, setIsLoading) => {
  const { isLogin } = useContext(UserToken);

  let navigate = useNavigate();

  const [productAdded, setProductAdded] = useState({
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

    const existingImageIndex = selectedDocs?.some(
      (item) => item?.keyWord === "coverImage"
    );

    // The "coverImage" does not exist in the selectedDocs array
    if (!existingImageIndex) {
      // The "coverImage" exists in the selectedDocs array
      handleResponseError("Cover image is required");
      return;
    }

    let {
      country,
      name,
      sectorId,
      categoryId,
      description,
      price,
      hsnCode,
      minOrderQuantity,
      city,
      guarantee,
      maxOrderQuantity,
    } = values;

    let data = {
      country,
      name,
      sectorId,
      categoryId,
      description,
      price,
      hsnCode,
      minOrderQuantity,
      specialCharacteristics: {},
      ...(city && { city: city }),
      ...(guarantee && { guarantee: guarantee }),
      ...(maxOrderQuantity && { maxOrderQuantity: maxOrderQuantity }),
    };
    if (Object.keys(values.productCharacteristic).length != 0) {
      // create an object with the keyword property as the key and the value property as the value.
      const obj = Object.fromEntries(
        values.productCharacteristic.map((obj) => [obj.keyword, obj.value])
      );
      data.specialCharacteristics = obj;
    }

    let result = await addProduct({ authorization: isLogin }, data);

    if (result?.success) {
      setIsLoading(true);

      setProductAdded({
        status: true,
        id: result.data.product.id,
      });
      await submitDocs(result.data.product.id, selectedDocs);
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
      let result = await addProductMedia(
        qoute_id,
        { authorization: isLogin },
        data
      );

      if (result?.success) {
        setLoadingState(true);
        SuccessToast("Product added Successfully");

        navigate("/factorydashboard/AllFactoryProducts");
      } else {
        handleResponseError(result.error);
      }
    } catch (error) {}
  };

  return { submitForm, productAdded, submitDocs };
};

export default useFormSubmission;
