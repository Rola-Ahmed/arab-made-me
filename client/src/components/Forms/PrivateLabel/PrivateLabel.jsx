import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "config.js";

import { useFormik } from "formik";
import * as Yup from "yup";
import { errorHandler } from "utils/errorHandler";

import { useNavigate } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { GlobalMsgContext } from "Context/globalMessage";

import FactoryInfo from "../Shared/FactoryInfo";
import ProductDetails from "../Shared/SelectedProductDetails";
import PrivateLabelForm from "./PrivateLabelForm";
import {
  textAreaValidate,
  otherTextAreaValidate,
  requiredStringValidate,
  requiredDateValidate,
} from "utils/validationUtils";

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

  const [privateLabelAdded, setPrivateLabelAdded] = useState({
    status: false,
    id: "",
  });
  const [selectedDocs, setSelectedDocs] = useState([]);

  // Context variables
  const { isLogin } = useContext(UserToken);
  const { setGlobalMsg } = useContext(GlobalMsgContext);

  // Router navigate function
  const navigate = useNavigate();

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

    // new
    // every: Yup.string()
    //   .matches(/^[0-9]+$/, "Input field must be numbers only")
    //   .min(1, "min 1 legnth"),
    // endOn: Yup.string()
    //   .matches(/^[0-9]+$/, "Input field must be numbers only")
    //   .min(1, "min 1 legnth"),

    quantity: Yup.string()
      .required("Input field is Required")
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    packingConditions: requiredStringValidate,
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),
    then: (schema) => schema.required("Input field is Required"),
    otherwise: (schema) => schema.nullable(),

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
  });
  let initialValues = {
    factoryId: factoryId,

    productId: productId ? [productId] : [],
    productName: productName ? [productName] : [],
    // productId: "77",
    // productName: "paste G100",
    moreDetails: "",

    // new
    recurrence: false,
    // repeats: "day",
    // every: "",
    // endOn: "",

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
      let config = {
        method: "post",
        url: `${baseUrl}/privateLabelings/add`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);
      if (response.data.message == "done") {
        if (selectedDocs.length > 0) {
          setPrivateLabelAdded({
            status: true,
            id: response.data.privateLabeling.id,
          });

          await SubmitDocs(response.data.privateLabeling.id);
        } else {
          setGlobalMsg(
            "Your Private Label Form has been successfully submitted"
          );

          navigate(-1);
        }
      } else {
        handleResponseError(response?.data?.message);
      }
    } catch (error) {
      handleResponseError(errorHandler(error));
    }
  }

  async function SubmitDocs(qoute_id) {
    const FormData = require("form-data");
    let data = new FormData();

    selectedDocs?.map((item) => data.append("docs", item.pdfFile));

    let config = {
      method: "put",
      url: `${baseUrl}/privateLabelings/uploadMedia/${qoute_id}`,

      headers: {
        authorization: isLogin,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.message == "done") {
          setLoadingState(true);

          setGlobalMsg("Your White Label Form has been successfully submitted");

          navigate(-1);
        } else {
          handleResponseError(response?.data?.message);
        }
      })
      .catch((error) => {
        handleResponseError(errorHandler(error));
      });
  }

  return (
    <>
      <header title="Private Label"  />
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
