import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserToken } from "Context/userToken";
import useFormSubmission from "./hooks/useFormSubmission";

import {
  textAreaValidate,
  otherTextAreaValidate,
  requiredStringValidate,
  requiredDateValidate,
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
    productName,
    productId,
    factoryId,
  } = props;
  // State variables
  const [errorMsg, setErrorMsg] = useState();

  const [selectedDocs, setSelectedDocs] = useState([]);

  // Context variables
  const { isLogin } = useContext(UserToken);

  function setLoadingState(loadingStatus) {
    setIsLoading((prev) => ({ ...prev, submitLoading: loadingStatus }));
  }

  let { submitForm, privateLabelAdded, submitDocs } = useFormSubmission(
    isLogin,
    setErrorMsg,
    setLoadingState
  );
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
          date: requiredDateValidate,
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
      submitForm(values, selectedDocs);
    }
    // if textApi is added and selectedDocs is greater that 0
    // call media
    // this case means that error ouccured in meidaApi so i need only to call media api
    // else
    // if (privateLabelAdded.status && selectedDocs?.length > 0) {
    else if (selectedDocs?.length > 0) {
      setLoadingState(true);
      submitDocs(privateLabelAdded.id, selectedDocs);
    }
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
