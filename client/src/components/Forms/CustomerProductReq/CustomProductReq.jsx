import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { baseUrl } from "config.js";
import { errorHandler } from "utils/errorHandler";
import { UserToken } from "Context/userToken";
import { GlobalMsgContext } from "Context/globalMessage";

import "../PrivateLabel/PrivateLabel.css";
import useSubmitFormMsg from "../../../hooks/useSubmitFormMsg";

import FactoryInfo from "../Shared/FactoryInfo";
import CurrentAcccountInfo from "../Shared/CurrentAcccountInfo";
import CustomProductForm from "./CustomProductForm";
function CustomerProductReq(props) {
  let { factoryDetails, isLoading, setIsLoading, factoryId } = props;
  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState();

  const [specialCharacteristicsArr, SetSpecialCharacteristicsArr] = useState(
    []
  );

  let { isLogin } = useContext(UserToken);
  const handleSubmitMsg = useSubmitFormMsg();

  let { setGlobalMsg } = useContext(GlobalMsgContext);

  let [poAdded, setPoAdded] = useState({
    status: false,
    id: "",
  });

  //Document Validation
  const [selectedDocs, setSelectedDocs] = useState([
    // {
    //   pdfName: null,
    //   pdfFile: null,
    // },
  ]);

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

  const location = useLocation();
  const hasPreviousState = location.key !== "default";
  console.log("hasPreviousState", hasPreviousState);
  //-------------------------End api helper function

  // ------------------------Form Validation

  let requiredString = Yup.string().required("Input field is Required");
  const otherTextAreaValidate = (field, value) => {
    return Yup.string().when(field, {
      is: value,
      then: (schema) =>
        schema
          .required("Input field is Required")
          .max(255, "max length is 255"),
    });
  };

  let validationSchema = Yup.object().shape({
    productName: Yup.string()
      .required("Input field is Required")
      .min(3, "min legnth is 3")
      .max(50, "max legnth is 50"),

    specialCharKeyWord: Yup.string()
      .min(3, "min legnth is 3")
      .max(50, "max legnth is 50"),

    specialCharDesc: Yup.string().when("specialCharKeyWord", {
      is: (schema) => !!schema,
      then: (schema) =>
        schema.min(3, "min length is 3").max(50, "max length is 50"),
    }),

    ...specialCharacteristicsArr?.reduce((acc, _, index) => {
      acc[`specialCharKeyWord${index}`] = Yup.string()
        .required("Input field is Required")
        .min(3, "min legnth is 3")
        .max(50, "max legnth is 50");

      acc[`specialCharDesc${index}`] = Yup.string()
        .required("Input field is Required")
        .min(3, "min legnth is 3")
        .max(50, "max legnth is 50");

      return acc;
    }, {}),

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

    packingConditions: requiredString,
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),
    SupplyLocation: requiredString,

    shippingConditions: requiredString,
    shippingConditionsOther: otherTextAreaValidate(
      "shippingConditions",
      "other"
    ),

    ShippingTypeSize: requiredString,
    ShippingTypeSizeOther: otherTextAreaValidate("ShippingTypeSize", "other"),

    qualityConditions: requiredString,
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    otherConditions: Yup.string().max(255, "max legnth is 255"),
  });
  let initialValues = {
    factoryId: factoryId,
    productName: "",

    specialCharKeyWord: "",
    specialCharDesc: "",
    ...specialCharacteristicsArr?.reduce((acc, _, index) => {
      acc[`specialCharKeyWord${index}`] = "";

      acc[`specialCharDesc${index}`] = "";

      return acc;
    }, {}),

    technicalSpecifications: "",
    inqueries: "",

    // newwwwww
    recurrence: false,

    repeats: "day",
    every: "",
    endOn: "",

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
      submitForm(values);
    }

    // if textApi is added and selectedDocs is greater that 0
    // call media
    // this case means that error ouccured in meidaApi so i need only to call media api
    // else
    // if (privateLabelAdded.status && selectedDocs?.length > 0) {
    else if (selectedDocs?.length > 0) {
      setLoadingState(true);
      SubmitDocs(poAdded.id);
    }
  }

  async function submitForm(values) {
    setLoadingState(true);

    clearResponseError();

    let data = {
      factoryId: values?.factoryId,

      productName: values.productName,
      technicalSpecifications: values.technicalSpecifications,
      inqueries: values.inqueries,

      specialCharacteristics: values.specialCharKeyWord
        ? { [values.specialCharKeyWord]: values.specialCharDesc }
        : {},
    };

    if (specialCharacteristicsArr?.length > 0) {
      specialCharacteristicsArr.forEach((index) => {
        const key = values[`specialCharKeyWord${index}`];
        const desc = values[`specialCharDesc${index}`];
        data.specialCharacteristics[key] = desc;
      });
    }

    try {
      let config = {
        method: "post",
        url: `${baseUrl}/spmfs/add`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        if (selectedDocs.length > 0) {
          setPoAdded({
            status: true,
            id: response.data.specialManufacturing.id,
          });

          await SubmitDocs(response.data.specialManufacturing.id);
        } else {
          // display  successfully submitted message
          handleSubmitMsg("Custom product Request");
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
      url: `${baseUrl}/spmfs/uploadMedia/${qoute_id}`,

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

          // display  successfully submitted message
          handleSubmitMsg("Custom product Request");
        } else {
          handleResponseError(response?.data?.message);
        }
      })
      .catch((error) => {
        handleResponseError(errorHandler(error));
      });
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
        specialCharacteristicsArr={specialCharacteristicsArr}
        SetSpecialCharacteristicsArr={SetSpecialCharacteristicsArr}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
    </section>
  );
}

export default CustomerProductReq;
