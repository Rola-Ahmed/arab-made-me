import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "components/main/Header/Header";

import FactoryInfo from "../Shared/FactoryInfo";

import {
  textAreaValidate,
  otherTextAreaValidate,
  requiredStringValidate,
  requiredDateValidate,
  reqQualityValidate,
} from "utils/validationUtils";
import ProductDetails from "../Shared/SelectedProductDetails";
import PurchasingOrderForm from "./PurchasingOrderForm";

import useFormSubmission from "./hooks/useFormSubmission";
import { UserToken } from "Context/userToken";
import CurrentAcccountInfo from "../Shared/CurrentAcccountInfo";
function PurchasingOrder(props) {
  let {
    productDetails,
    factoryData,

    isLoading,
    setIsLoading,
    productIsSelected,
    SourcingIsSelected,
    requestType,
    requestTypeValues,

    // ids
    productId,
    factoryId,
    productName,
    sourcingOfferId,
  } = props;

  let { isLogin } = useContext(UserToken);
  const [errorMsg, setErrorMsg] = useState({});

  let { submitForm, poAdded, submitDocs } = useFormSubmission(
    isLogin,
    setErrorMsg,
    setIsLoading,
    requestType,
    requestTypeValues
  );

  // Format the date as per the 'datetime-local' input type
  // ------------------------Form Validation
  let validationSchema = Yup.object().shape({
    quantity: reqQualityValidate,
    deadline: requiredDateValidate,

    // productId: requiredStringValidate,
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

    // otherConditions: requiredStringValidate,

    paymentType: requiredStringValidate,
    paymentTypeOther: otherTextAreaValidate("paymentType", "other"),

    allowDelay: Yup.boolean().default(false),
    timeManufacturingDelay: Yup.string().when("allowDelay", {
      is: true,
      then: (schema) =>
        schema
          .matches(/^[0-9]+$/, "Input field must be numbers only")
          .min(1, "min 1 legnth")
          .required("Input field is Required"),
    }),

    conditionsOfDelays: textAreaValidate(),
    recurrence: Yup.string().oneOf(["oneBatch", "repeat"]),
    instructions: textAreaValidate(),
    timeLine: Yup.array()
      .of(
        Yup.object().shape({
          date: requiredDateValidate,
          quantity: reqQualityValidate,
        })
      )
      .min(1, "minimum length is 1"),
  });

  let initialValues = {
    // optional
    quantity: "",
    allowDelay: false,

    packingConditions: "", //optional
    packingConditionsOther: "",

    SupplyLocation: "",

    shippingConditions: "",
    shippingConditionsOther: "",

    ShippingTypeSize: "",
    ShippingTypeSizeOther: "",

    qualityConditions: "",
    qualityConditionsOther: "",

    paymentType: "", //optional
    paymentTypeOther: "",
    recurrence: "oneBatch",

    factoryId: factoryId,
    productId: productId || "",
    sourcingOfferId: sourcingOfferId || "",
    productName: productName || "",

    timeManufacturingDelayDuration: "days", //optional
    timeManufacturingDelay: "", //optional

    trademarkCheckBox: false,

    conditionsOfDelays: "",
    instructions: "",

    timeLine: [
      {
        date: "",
        quantity: "",
      },
    ],
    deadline: "",

    // otherConditions: "",
  };

  useEffect(() => {
    if (factoryData?.length != 0) {
      formValidation.setValues(initialValues);
    }
  }, [factoryData, productDetails]);

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
      submitDocs(poAdded.id, selectedDocs);
    }
  }

  //Document Validation
  const [selectedDocs, setSelectedDocs] = useState([]);

  return (
    <>
      <Header
        title={`Send PO  ${sourcingOfferId ? "on Sourcing Offer" : ""}`}
      />

      <section id="view" className="send-po">
        <div className="container container-po ">
          <CurrentAcccountInfo />
        </div>

        {/* Factory description */}
        <div className="container container-po ">
          <FactoryInfo productDetails={factoryData} />
        </div>

        {/*  Product Description */}
        {productIsSelected && (
          <div className="container container-po ">
            <ProductDetails productDetails={productDetails} />
          </div>
        )}

        {/* stand alone function */}

        {/* Grid  */}
        <PurchasingOrderForm
          productDetails={productDetails}
          isLoading={isLoading}
          formValidation={formValidation}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          productIsSelected={productIsSelected}
          setSelectedDocs={setSelectedDocs}
          SourcingIsSelected={SourcingIsSelected}
          selectedDocs={selectedDocs}
        />
      </section>
    </>
  );
}

export default PurchasingOrder;
