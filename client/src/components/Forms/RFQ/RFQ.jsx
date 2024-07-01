import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import { errorHandler } from "utils/errorHandler";
import useSubmitFormMsg from "../../../hooks/useSubmitFormMsg";
import "./RFQ.css";
import CurrentAcccountInfo from "../Shared/CurrentAcccountInfo";
import FactoryInfo from "../Shared/FactoryInfo";
import ProductDetails from "../Shared/SelectedProductDetails";
import RfqForm from "./RfqForm";

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
  let { isLogin } = useContext(UserToken);
  const handleSubmitMsg = useSubmitFormMsg();

  //Document Validation
  const [selectedDocs, setSelectedDocs] = useState([
    // {
    //   pdfName: null,
    //   pdfFile: null,
    // },
  ]);

  //
  const [errorMsg, setErrorMsg] = useState();

  let [rfqAdded, setRfqAdded] = useState({
    status: false,
    id: "",
  });

  // Date setup to not accept the old date or todays date
  // must accept future date
  const now = new Date();
  const formattedDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  // ------------------------Form Validation
  let validationSchema = Yup.object().shape({
    productId: Yup.array()
      .of(Yup.string())
      .test("non-empty-array", "Input field is Required", function (value) {
        return value && value.length > 0;
      }),
    quantity: Yup.string()
      .required("Input field is Required")
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    shippingConditions: Yup.string().required(" Input field is Required"),
    shippingConditionsOther: Yup.string().when("shippingConditions", {
      is: "other",
      then: (schema) =>
        schema
          .max(255, "Maximum length is 255")
          .required("Input field is required"),
    }),

    packingConditions: Yup.string().required(" Input field is Required"),
    packingConditionsOther: Yup.string().when("packingConditions", {
      is: "other",
      then: (schema) =>
        schema

          .max(255, "max legnth is 255")
          .required("Input field is Required"),
    }),

    qualityConditions: Yup.string().required(" Input field is Required"),
    qualityConditionsOther: Yup.string().when("qualityConditions", {
      is: "other",
      then: (schema) =>
        schema

          .max(255, "max legnth is 255")
          .required("Input field is Required"),
    }),

    //
    paymentType: Yup.string().required(" Input field is Required"),
    paymentTypeOther: Yup.string().when("paymentType", {
      is: "other",
      then: (schema) =>
        schema
          .max(255, "max legnth is 255")
          .required("Input field is Required"),
    }),

    deadLine: Yup.date()
      .required("Input field is Required")
      .min(formattedDate, "Invalid Date"),

    otherInformation: Yup.string().max(255, "max legnth is 255"),
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
    deadLine: "",
    otherInformation: "",

    // if user selected a product then productId
    //else it will display all the products of the selected factory
    // productId: productId || productDetailsArr?.[0]?.id || "",
    // productName: productDetails?.name || productDetailsArr?.[0]?.name,
    productId: productId ? [productId] : [],
    productName: productName ? [productName] : [],
  };

  useEffect(() => {
    if (productDetails.length !== 0) {
      formValidation.setValues(initialValues);
    }
  }, [productDetails]);

  let formValidation = useFormik({
    initialValues,

    validationSchema,
    onSubmit: submit,
  });

  //-------------------------Start api helper function
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

  //-------------------------End api helper function

  function submit(values) {
    // if data is not added yet
    if (!rfqAdded.status) {
      submitForm(values);
    }

    // if textApi is added and selectedDocs is greater that 0
    // call media
    // this case means that error ouccured in meidaApi so i need only to call media api
    // else
    // if (privateLabelAdded.status && selectedDocs?.length > 0) {
    else if (selectedDocs?.length > 0) {
      setLoadingState(true);
      SubmitDocs(rfqAdded.id);
    }
  }

  async function submitForm(values) {
    setLoadingState(true);

    clearResponseError();

    let data = {
      factoryId: values.factoryId,
      productId: values.productId,
      productName: values.productName,

      deadline: values.deadLine,
      quantity: values.quantity,
      shippingConditions:
        values.shippingConditions == "other"
          ? values.shippingConditionsOther
          : values.shippingConditions,
      packingConditions:
        values.packingConditions == "other"
          ? values.packingConditionsOther
          : values.packingConditions,
      paymentTerms:
        values.paymentType == "other"
          ? values.paymentTypeOther
          : values.paymentType,
      qualityConditions:
        values.qualityConditions == "other"
          ? values.qualityConditionsOther
          : values.qualityConditions,

      // if  values.moreDetails!==null add value
      ...(values.otherInformation && {
        otherInfoRequest: values.otherInformation,
      }),
    };

    try {
      let config = {
        method: "post",
        url: `${baseUrl}/rfqs/add`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        if (selectedDocs.length > 0) {
          setRfqAdded({
            status: true,
            id: response.data.quotationRequest.id,
          });

          await SubmitDocs(response.data.quotationRequest.id);
        } else {
          // display  successfully submitted message
          handleSubmitMsg("RFQ");
        }
      } else {
        handleResponseError(response?.data?.message);

        // window.scrollTo({ top: 920 });
      }
    } catch (error) {
      handleResponseError(errorHandler(error));

      // window.scrollTo({ top: 920 });
    }
  }

  function SubmitDocs(productId) {
    // e.preventDefault();

    let data = new FormData();

    selectedDocs?.map((item) => data.append("docs", item.pdfFile));

    const config = {
      method: "put",
      url: `${baseUrl}/rfqs/uploadMedia/${productId}`,
      headers: {
        authorization: isLogin,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.message == "done") {
          setLoadingState(true);

          // display  successfully submitted message
          handleSubmitMsg("RFQ");
        } else {
          handleResponseError(response?.data?.message);
        }

        // check this logic
        // setIsLoading((prev) => ({
        //   ...prev,
        //   submitLoading: false,
        // }));
      })

      .catch((error) => {
        handleResponseError(errorHandler(error));
      });
  }

  return (
    <>
      <section id="view" className="send-rfq">
        {/* Factory Details */}
        <div className="container container-rfq ">
          <FactoryInfo productDetails={factoryData} />
        </div>

        <div className="container container-rfq ">
          <CurrentAcccountInfo />
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
