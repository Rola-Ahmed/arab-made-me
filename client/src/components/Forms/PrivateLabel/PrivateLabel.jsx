import { useState, useContext, useEffect } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";

import { UserToken } from "Context/userToken";
import Header from "components/main/Header/Header";

import FactoryInfo from "../Shared/FactoryInfo";
import ProductDetails from "../Shared/SelectedProductDetails";
import PrivateLabelForm from "./PrivateLabelForm";
import {
  textAreaValidate,
  otherTextAreaValidate,
  requiredStringValidate,
  requiredStringMax255,
  requiredDateValidate,
} from "utils/validationUtils";

import useFormSubmission from "./hooks/useFormSubmission";
import CurrentAcccountInfo from "../Shared/CurrentAcccountInfo";

export default function PrivateLabel(props) {
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

  let {
    submitForm,
    privateLabelAdded,
    submitDocs,
    handleSubmitMsg,
  } = useFormSubmission(isLogin, setErrorMsg, setIsLoading);

  // ------------------------Form Validation

  let validationSchema = Yup.object().shape({
    // productId: Yup.array()
    //   .of(Yup.string())
    //   .test("non-empty-array", "Input field is Required", function (value) {
    //     return value && value.length > 0;
    //   }),
    // productId: Yup.string().required("Input field is Required"),
    productId: Yup.string(),

    quantity: requiredStringMax255,

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

    moreDetails: textAreaValidate(),
    otherConditions: textAreaValidate(),
    deadline: requiredDateValidate,
  });
  let initialValues = {
    factoryId: factoryId,

    // productId: productId ? [productId] : [],
    // productName: productName ? [productName] : [],

    productId: productId ? productId : "",
    productName: productName ? productName : "",

    moreDetails: "",

    // new
    // recurrence: false,

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
    deadline: "",
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
      submitDocs(privateLabelAdded.id, selectedDocs);
    } else {
      handleSubmitMsg("Private Label Request");
    }
  }

  return (
    <>
      <Header title="Private Label" />
      <section className="req-visit">
        <div className="container container-req ">
          <CurrentAcccountInfo />
        </div>

        {/* Factory Details */}
        <div className="container container-req ">
          <FactoryInfo productDetails={factoryData} />
        </div>

        {/* Product details */}
        {/* if the user selected a  Product then product  Description will be displayed  */}
        {productIsSelected && (
          <ProductDetails productDetails={productDetails} />
        )}

        <PrivateLabelForm
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
