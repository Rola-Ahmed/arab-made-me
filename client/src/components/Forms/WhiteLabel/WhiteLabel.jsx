import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { addWhiteLabel, addWhiteLabelMedia } from "Services/whiteLabel";
import useSubmitFormMsg from "../../../hooks/useSubmitFormMsg";

import {
  textAreaValidate,
  otherTextAreaValidate,
  requiredStringValidate,
  formattedDateValidate,
} from "utils/validationUtils";

import FactoryInfo from "../Shared/FactoryInfo";
import ProductDetails from "../Shared/SelectedProductDetails";
import Header from "components/main/Header/Header";
import WhiteLabelForm from "./WhiteLabelForm";

export default function WhiteLabel(props) {
  let {
    productDetails,
    isLoading,
    setIsLoading,
    factoryData,
    productIsSelected,
  } = props;
  // State variables
  const [searchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = useState();
  const handleSubmitMsg = useSubmitFormMsg();

  const [privateLabelAdded, setPrivateLabelAdded] = useState({
    status: false,
    id: "",
  });
  const [selectedDocs, setSelectedDocs] = useState([]);

  // Context variables
  const { isLogin } = useContext(UserToken);

  // Constants for URL parameters
  const factoryId = searchParams.get("factoryId");
  const productId = searchParams.get("productId");
  const factoryName = searchParams.get("factoryName");
  const productName = searchParams.get("productName");

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

  // ------------------------Form Validation

  let validationSchema = Yup.object().shape({
    productId: Yup.array()
      .of(Yup.string())
      .test("non-empty-array", "Input field is Required", function (value) {
        return value && value.length > 0;
      }),
    // .required("Input field is Required"),

    quantity: requiredStringValidate
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    packingConditions: requiredStringValidate,
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),
    SupplyLocation: requiredStringValidate,

    shippingConditions: requiredStringValidate,
    shippingConditionsOther: otherTextAreaValidate(
      "shippingConditions",
      "other"
    ),

    ShippingTypeSize: requiredStringValidate,
    ShippingTypeSizeOther: otherTextAreaValidate("ShippingTypeSize", "other"),

    qualityConditions: requiredStringValidate,
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    otherConditions: textAreaValidate(),
    moreDetails: textAreaValidate(),

    recurrence: Yup.string().oneOf(["oneBatch", "repeat"]),

    timeLine: Yup.array()
      .of(
        Yup.object().shape({
          date: Yup.date()
            .required("Input field is Required")
            .min(formattedDateValidate, "Invalid Date"),
          quantity: Yup.string()
            .required("Input field is Required")
            .matches(/^[0-9]+$/, "Input field must be numbers only")
            .min(1, "min 1 legnth"),
        })
      )
      .min("1", "minimum length is 1"),
  });

  let initialValues = {
    factoryId: factoryId,

    productId: productId ? [productId] : [],
    productName: productName ? [productName] : [],

    // productId: productId,
    // productName: productName,
    moreDetails: "",

    // new
    recurrence: "oneBatch",

    quantity: "",

    packingConditions: "",
    packingConditionsOther: "",

    SupplyLocation: "",

    shippingConditions: "",
    shippingConditionsOther: "",

    ShippingTypeSize: "",
    ShippingTypeSizeOther: "",

    qualityConditions: "",
    qualityConditionsOther: "",
    timeLine: [
      {
        date: "",
        quantity: "",
      },
    ],
  };
  useEffect(() => {
    if (productDetails && factoryId) {
      formValidation.setValues(initialValues);
    }
  }, [factoryId, productDetails]);

  let formValidation = useFormik({
    initialValues,
    validationSchema,
    onSubmit: submit,
  });

  function submit(values) {
    // if data is not added yet
    if (!privateLabelAdded.status) {
      submitForm(values);
    }

    // if textApi is added and selectedDocs is greater that 0
    // call media
    // this case means that error ouccured in meidaApi so i need only to call media api
    // else
    // if (privateLabelAdded.status && selectedDocs?.length > 0) {
    else if (selectedDocs?.length > 0) {
      setLoadingState(true);
      SubmitDocs(privateLabelAdded.id);
    }
  }

  async function submitForm(values) {
    setLoadingState(true);
    clearResponseError();
    let data = {
      factoryId: values?.factoryId,
      productId: values?.productId,
      productName: values.productName,

      // if  values.moreDetails!==null add value
      ...(values.moreDetails && { moreDetails: values.moreDetails }),
    };

    try {
      let result = await addWhiteLabel({ authorization: isLogin }, data);

      // if there is error
      if (result && result.error) {
        handleResponseError(result.error);
      }
      //  state is success
      if (result && result.success) {
        if (selectedDocs.length > 0) {
          setPrivateLabelAdded({
            status: true,
            id: result.data.whiteLabeling.id,
          });
          await SubmitDocs(result.data.whiteLabeling.id);
        } else {
          // setGlobalMsg("Your White Label Form has been successfully submitted");
          // navigate(-1);

          handleSubmitMsg("White Label");
        }
      }
    } catch (error) {}
  }

  async function SubmitDocs(id) {
    setLoadingState(true);

    clearResponseError();
    const FormData = require("form-data");
    let data = new FormData();

    selectedDocs?.map((item) => data.append("docs", item.pdfFile));
    try {
      let result = await addWhiteLabelMedia(
        id,
        { authorization: isLogin },
        data
      );

      // if there is error
      if (result && result.error) {
        handleResponseError(result.error);
      }
      //  state is success

      if (result && result.success) {
        // setGlobalMsg("Your White Label Form has been successfully submitted");
        // navigate(-1);
        handleSubmitMsg("White Label");
      }
    } catch (error) {}
  }

  return (
    <>
      <Header title="White Label" subTitle="White Label" />

      <section className="req-visit">
        {/* Factory Details */}
        <div className="container container-req ">
          <FactoryInfo productDetails={factoryData} />
        </div>

        {/* Product details */}
        {/* if the user selected a  Product then product  Description will be displayed  */}
        {productIsSelected && (
          <ProductDetails productDetails={productDetails} />
        )}

        <WhiteLabelForm
          allProductsArr={productDetails}
          isLoading={isLoading}
          formValidation={formValidation}
          errorMsg={errorMsg}
          setSelectedDocs={setSelectedDocs}
          setErrorMsg={setErrorMsg}
          selectedDocs={selectedDocs}
          productIsSelected={productIsSelected}
        />
      </section>
    </>
  );
}
