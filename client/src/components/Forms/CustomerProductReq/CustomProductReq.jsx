import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserToken } from "Context/userToken";

import useFormSubmission from "./hooks/useFormSubmission";

import FactoryInfo from "../Shared/FactoryInfo";
import CurrentAcccountInfo from "../Shared/CurrentAcccountInfo";
import CustomProductForm from "./CustomProductForm";
import {
  formattedDateValidate,
  requiredStringValidate,
  otherTextAreaValidate,
} from "utils/validationUtils";
function CustomerProductReq(props) {
  let { factoryDetails, isLoading, setIsLoading, factoryId } = props;

  const [errorMsg, setErrorMsg] = useState();

  let { isLogin } = useContext(UserToken);

  //Document Validation
  const [selectedDocs, setSelectedDocs] = useState([
    // {
    //   pdfName: null,
    //   pdfFile: null,
    // },
  ]);

  const { submitForm, poAdded, submitDocs } = useFormSubmission(
    isLogin,
    setIsLoading,
    setErrorMsg
  );

  //-------------------------Start api helper function
  function setLoadingState(loadingStatus) {
    setIsLoading((prev) => ({ ...prev, submitLoading: loadingStatus }));
  }

  let validationSchema = Yup.object().shape({
    productName: Yup.string()
      .required("Input field is Required")
      .max(50, "max legnth is 50"),

    specialCharKeyWord: Yup.string().max(50, "max legnth is 50"),

    specialCharDesc: Yup.string().when("specialCharKeyWord", {
      is: (schema) => !!schema,
      then: (schema) =>
        schema.max(50, "max length is 50"),
    }),

    technicalSpecifications: Yup.string()
      .required("Input field is Required")
      .max(255, "max legnth is 255"),
    inqueries: Yup.string()
      .required("Input field is Required")
      .max(255, "max legnth is 255"),

    quantity: Yup.string()
      .required("Input field is Required")
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

    otherConditions: Yup.string().max(255, "max legnth is 255"),

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

    productCharacteristic: Yup.array().of(
      Yup.object().shape({
        keyword: Yup.string().max(50, "max legnth is  50"),
        value: Yup.string().max(50, "max legnth is  50"),
      })
    ),
  });

  let initialValues = {
    factoryId: factoryId,
    productName: "",

    specialCharKeyWord: "",
    specialCharDesc: "",

    productCharacteristic: [
      {
        keyword: "",
        value: "",
      },
    ],

    technicalSpecifications: "",
    inqueries: "",

    // newwwwww
    recurrence: "oneBatch",
    timeLine: [
      {
        date: "",
        quantity: "",
      },
    ],

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

    trademarkCheckBox: false,
    productType: "text",
  };

  useEffect(() => {
    if (factoryDetails.length !== 0) {
      formValidation.setValues(initialValues);
    }
  }, [factoryId]);

  let formValidation = useFormik({
    initialValues,
    validationSchema,
    onSubmit: submit,
  });

  function submit(values) {
    // if data is not added yet
    if (!poAdded.status) {
      submitForm(values, selectedDocs);
    }

    // if textApi is added and selectedDocs is greater that 0
    // call media
    // this case means that error ouccured in meidaApi so i need only to call media api
    // else
    // if (privateLabelAdded.status && selectedDocs?.length > 0) {
    else if (selectedDocs?.length > 0) {
      setLoadingState(true);
      submitDocs(poAdded.id, selectedDocs);
    }
  }
  return (
    <section id="view" className="req-visit">
      {/* Factory Details */}

      <div className="container container-req ">
        <FactoryInfo productDetails={factoryDetails} />
      </div>

      <div className="container container-req ">
        <CurrentAcccountInfo />
      </div>

      <CustomProductForm
        isLoading={isLoading}
        formValidation={formValidation}
        selectedDocs={selectedDocs}
        setSelectedDocs={setSelectedDocs}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
    </section>
  );
}

export default CustomerProductReq;
