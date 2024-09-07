import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserToken } from "Context/userToken";
import "./RFQ.css";
import FactoryInfo from "../Shared/FactoryInfo";
import ProductDetails from "../Shared/SelectedProductDetails";
import RfqForm from "./RfqForm";
import useFormSubmission from "./hooks/useFormSubmission";

import {
  textAreaValidate,
  otherTextAreaValidate,
  requiredStringValidate,
  requiredDateValidate,
  reqQualityValidate,
} from "utils/validationUtils";
import CurrentAcccountInfo from "../Shared/CurrentAcccountInfo";

function SendRfq(props) {
  let {
    productDetails,
    isLoading,
    setIsLoading,
    factoryData,
    productIsSelected,
    productId,
    productName,
    factoryId,
  } = props;
  const { isLogin } = useContext(UserToken);
  const [errorMsg, setErrorMsg] = useState();

  let { submitForm, rfqAdded, submitDocs, handleSubmitMsg } = useFormSubmission(
    isLogin,
    setErrorMsg,
    setIsLoading
  );
  //Document Validation
  // array f objects
  const [selectedDocs, setSelectedDocs] = useState([]);

  // ------------------------Form Validation
  let validationSchema = Yup.object().shape({
    // productId: Yup.array()
    //   .of(Yup.string())
    //   .test("non-empty-array", "Input field is Required", function (value) {
    //     return value && value.length > 0;
    //   }),

    productId: requiredStringValidate,
    quantity: reqQualityValidate,

    shippingConditions: requiredStringValidate,
    shippingConditionsOther: otherTextAreaValidate(
      "shippingConditions",
      "other"
    ),

    packingConditions: requiredStringValidate,
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),

    qualityConditions: requiredStringValidate,
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    //
    paymentType: requiredStringValidate,
    paymentTypeOther: otherTextAreaValidate("paymentType", "other"),

    deadline: requiredDateValidate,

    otherInformation: textAreaValidate(),
  });

  let initialValues = {
    // optional
    factoryId: factoryId,
    quantity: "",
    shippingConditions: "",
    shippingConditionsOther: "",
    packingConditions: "",
    packingConditionsOther: "",
    qualityConditions: "",
    qualityConditionsOther: "",
    paymentType: "",
    paymentTypeOther: "",
    // optional
    deadline: "",
    otherInformation: "",

    // if user selected a product then productId
    //else it will display all the products of the selected factory
    // productId: 562,
    // productName: "Scarlett Mueller",
    // productId: productId ? [productId] : [],
    // productName: productName ? [productName] : [],

    productId: productId ? productId : "",
    productName: productName ? productName : "",
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
    if (!rfqAdded.status) {
      submitForm(values, selectedDocs);
    }
    // if textApi is added and selectedDocs is greater that 0
    // call media
    // this case means that error ouccured in meidaApi so i need only to call media api
    // else
    // if (privateLabelAdded.status && selectedDocs?.length > 0) {
    else if (selectedDocs?.length > 0) {
      submitDocs(rfqAdded.id, selectedDocs);
    } else {
      handleSubmitMsg("RFQ Request");
    }
  }

  return (
    <>
      <section id="view" className="send-rfq">
        {/* Factory Details */}

        <div className="container container-rfq">
          <CurrentAcccountInfo />
        </div>

        <div className="container container-rfq ">
          <FactoryInfo productDetails={factoryData} />
        </div>

        {/* Product Decription */}

        {productIsSelected && (
          <div className="container container-rfq ">
            <ProductDetails productDetails={productDetails} />
          </div>
        )}

        <RfqForm
          productDetails={productDetails}
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

export default SendRfq;
