import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { GlobalMsgContext } from "Context/globalMessage";

import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "components/main/Header/Header";

import LoadingForm2 from "components/Loading/LoadingForm2";

import ImporterUnVerifiedFullScreen from "components/ActionMessages/ImporterUnVerifiedFullScreen/ImporterUnVerifiedFullScreen";
import FormValidation from "components/ActionMessages/FormValidation/FormValidation";
import { errorHandler } from "utils/errorHandler";

import { paymentTypeArr } from "constants/paymentTypeArr";
import FactoryInfo from "../Shared/FactoryInfo";
import SharedConditionsValidate from "../Shared/SharedConditionsValidate";
import UploadDocument from "../Shared/UploadDocument";
import CurrentAcccountInfo from "../Shared/CurrentAcccountInfo";

function PurchasingOrder() {
  let navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const productId = searchParams.get("productId");
  const sourcingOfferId = searchParams.get("sourcingOfferId");
  const factoryName = searchParams.get("factoryName");
  const productName = searchParams.get("productName");

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState({
    submitLoading: false,
    pageLoading: true,
  });
  const [modalShow, setModalShow] = useState({
    isFactoryVerified: false,
    isLogin: false,
    isImporterVerified: false,
    BecomeAfactory: false,
  });

  let { setGlobalMsg } = useContext(GlobalMsgContext);

  let [factoryDetails, setFactoryDetails] = useState({});
  // if a sepcific prouct is selected
  let [productDetails, setProductDetails] = useState({});

  // if no product is selected
  let [productDetailsArr, setProductDetailsArr] = useState([]);

  let [poAdded, setPoAdded] = useState({
    status: false,
    id: "",
  });

  // if (factoryId == null) {
  //   localStorage.setItem("ToHomePage", "Page Not Found");

  //   navigate("/");
  // }

  // if there is no specific product slected then call all the products

  async function FactoryTotalProductLen() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/products/${factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setProductDetailsArr(response?.data?.products);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (sourcingOfferId == null) {
      if (productId == "" || productId == null || productId == undefined) {
        // call all total products of the factory
        FactoryTotalProductLen();
      }
    }
    // }, [location?.state?.setFactoryDetails?.id]);
  }, [productId]);

  // factory details
  async function fetchFactoryData() {
    setIsLoading((prev) => ({
      ...prev,
      pageLoading: true,
    }));
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/${factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.factories);
        setIsLoading((prev) => ({
          ...prev,
          pageLoading: false,
        }));
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }
  useEffect(() => {
    fetchFactoryData();
  }, [factoryId]);

  // product data

  async function fetchProductData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/products/${productId !== null && productId}`,
        // url: `${baseUrl}/factories/products/2`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setProductDetails(response.data.products);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (productId !== null) {
      fetchProductData();
    }
  }, [productId]);

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const year = tomorrow.getFullYear();
  const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");
  const day = tomorrow.getDate().toString().padStart(2, "0");
  const hours = tomorrow.getHours().toString().padStart(2, "0");
  const minutes = tomorrow.getMinutes().toString().padStart(2, "0");

  // Format the date as per the 'datetime-local' input type
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
  const [timelineArr, SetTimelineArr] = useState([]);
  // ------------------------Form Validation
  let validationSchema = Yup.object().shape({
    quantity: Yup.string()
      .required("Input field is Required")
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    packingConditions: Yup.string().required("Input field is Required"),
    packingConditionsOther: Yup.string().when("packingConditions", {
      is: "other",
      then: (schema) =>
        schema

          // .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    SupplyLocation: Yup.string().required("Input field is Required"),
    shippingConditions: Yup.string().required("Input field is Required"),
    shippingConditionsOther: Yup.string().when("shippingConditions", {
      is: "other",
      then: (schema) => schema.required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),
    ShippingTypeSize: Yup.string().required("Input field is Required"),
    ShippingTypeSizeOther: Yup.string().when("ShippingTypeSize", {
      is: "other",
      then: (schema) => schema.required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    qualityConditions: Yup.string().required("Input field is Required"),
    qualityConditionsOther: Yup.string().when("qualityConditions", {
      is: "other",
      then: (schema) => schema.required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    otherConditions: Yup.string().max(255, "max legnth is 255"),

    paymentType: Yup.string().required("Input field is Required"),
    paymentTypeOther: Yup.string().when("paymentType", {
      is: "other",
      then: (schema) =>
        schema

          // .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    allowDelay: Yup.boolean().default(false),
    timeManufacturingDelay: Yup.string().when("allowDelay", {
      is: true,
      then: (schema) =>
        schema

          .matches(/^[0-9]+$/, "Input field must be numbers only")
          .min(1, "min 1 legnth")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),
    // timeManufacturingDelay:
    //  Yup.string()
    //   .matches(/^[0-9]+$/, "Input field must be numbers only")
    //   .min(1, "min 1 legnth"),

    startTimeLine: Yup.date()
      .required("Input field is Required")
      .min(formattedDate, "Invalid Date"),
    ...timelineArr?.reduce((acc, _, index) => {
      acc[`startTimeLine${index}`] = Yup.date()
        .required("Input field is Required")
        .min(formattedDate, "Invalid Date");

      acc[`TimeLineQuantity${index}`] = Yup.string()
        .required("Input field is Required")
        .matches(/^[0-9]+$/, "Input field must be numbers only")
        .min(1, "min 1 legnth");

      return acc;
    }, {}),
    TimeLineQuantity: Yup.string()
      .required("Input field is Required")
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    conditionsOfDelays: Yup.string()
      //.min(16, "min legnth is 16")
      .max(255, "max legnth is 255"),

    instructions: Yup.string()
      //.min(16, "min legnth is 16")
      .max(255, "max legnth is 255"),

    // new
    every: Yup.string()
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),
    endOn: Yup.string()
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),
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

    factoryId: factoryId,
    productId: productId || productDetailsArr?.[0]?.id || "",
    sourcingOfferId: sourcingOfferId || "",
    productName:
      productDetails?.name || productDetailsArr?.[0]?.name || productName || "",

    // productId: 11,

    timeManufacturingDelayDuration: "week", //optional
    timeManufacturingDelay: "", //optional

    trademarkCheckBox: false,

    // endTimeLine: "",
    startTimeLine: "",
    TimeLineQuantity: "",
    conditionsOfDelays: "",
    instructions: "",

    repName:
      factoryDetails?.repName != undefined
        ? `${factoryDetails?.repName?.[0]}  ${factoryDetails?.repName?.[1]}`
        : "rep Name",

    ...timelineArr?.reduce((acc, _, index) => {
      acc[`startTimeLine${index}`] = "";
      acc[`TimeLineQuantity${index}`] = "";

      return acc;
    }, {}),
    repEmail: factoryDetails?.repEmail || "",
    repPhone: factoryDetails?.repPhone,
  };

  useEffect(() => {
    if (factoryDetails.length !== 0) {
      formValidation.setValues(initialValues);
    }
  }, [factoryDetails, productDetailsArr, productDetails]);

  function addnewSepcialChar() {
    SetTimelineArr((prevSections) => {
      // Ensure prevSections is an array
      const sectionsArray = Array.isArray(prevSections) ? prevSections : [];

      // Return the updated array with the new section
      return [...sectionsArray, timelineArr?.length];
    });
  }
  function removenewSepcialChar() {
    SetTimelineArr((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections.pop(); // Remove the last item
      return updatedSections;
    });
  }

  let formValidation = useFormik({
    initialValues,

    validationSchema,
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    setIsLoading((prev) => ({
      ...prev,
      submitLoading: true,
    }));

    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    let data = {
      factoryId: values?.factoryId || "",
      repName: values.repName,
      contactData: {
        email: values.repEmail,
        phone: values.repEmail,
      },
      // quotationId: "",

      productName: values.productName,
      quantity: values.quantity,

      timeLine: [
        { date: values.startTimeLine, quantity: values.TimeLineQuantity },

        ...(timelineArr?.length > 0
          ? timelineArr.map((index) => ({
              date: values[`startTimeLine${index}`],
              quantity: values[`TimeLineQuantity${index}`],
            }))
          : []),
      ],
    };

    let addIdpath = "";

    if (values.productId !== "") {
      data.productId = values.productId;

      addIdpath = "product";
    }

    if (values.sourcingOfferId !== "") {
      data.sourcingOfferId = values.sourcingOfferId;
      addIdpath = "sourcingOffer";
    }

    if (values.shippingConditions !== "") {
      data.shippingConditions = values.shippingConditions;
    }
    if (values.packingConditions !== "") {
      data.packingConditions =
        values.packingConditions === "other"
          ? values.packingConditionsOther
          : values.packingConditions;
    }
    if (values.paymentType !== "") {
      data.paymentTerms =
        values.paymentType == "other"
          ? values.paymentTypeOther
          : values.paymentType;
    }

    if (values.qualityConditions !== "") {
      data.companyQualityTesting =
        values.qualityConditions == "other"
          ? values.qualityConditionsOther
          : values.qualityConditions;
    }

    if (values.timeManufacturingDelay !== "") {
      data.timeOfManufacturingDelay = `${values.timeManufacturingDelay} ${values.timeManufacturingDelayDuration}`;
    }

    if (values.conditionsOfDelays !== "") {
      data.conditionsOfDelays = values.conditionsOfDelays;
    }

    if (values.instructions !== "") {
      data.instructions = values.instructions;
    }

    if (!poAdded.status) {
      try {
        let config = {
          method: "post",
          url: `${baseUrl}/pos/add/${addIdpath}`,
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
              id: response.data.purchasingOrder.id,
            });
            await SubmitDocs(response.data.purchasingOrder.id);
          } else {
            setGlobalMsg(
              "Your Purchasing Order has been successfully submitted"
            );
            navigate(-1);
          }
        } else {
          setIsLoading((prev) => ({
            ...prev,
            submitLoading: true,
          }));
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            response: response?.data?.message,
          }));

          const targetElement = document.getElementById("view");
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      } catch (error) {
        setIsLoading((prev) => ({
          ...prev,
          submitLoading: false,
        }));

        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: errorHandler(error),
        }));

        const targetElement = document.getElementById("view");
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }

    if (poAdded.status && selectedDocs?.length > 0) {
      setIsLoading((prev) => ({
        ...prev,
        submitLoading: true,
      }));
      SubmitDocs(poAdded.id);
    }
  }

  //Document Validation
  const [selectedDocs, setSelectedDocs] = useState([
    // {
    //   pdfName: null,
    //   pdfFile: null,
    // },
  ]);

  async function SubmitDocs(qoute_id) {
    const FormData = require("form-data");
    let data = new FormData();

    selectedDocs?.map((item) => data.append("docs", item.pdfFile));

    let config = {
      method: "put",
      url: `${baseUrl}/pos/uploadMedia/${qoute_id}`,

      headers: {
        authorization: isLogin,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.message == "done") {
          setIsLoading((prev) => ({
            ...prev,
            submitLoading: true,
          }));

          setGlobalMsg("Your Purchasing Order has been successfully submitted");
          navigate(-1);
        } else {
          setIsLoading((prev) => ({
            ...prev,
            submitLoading: false,
          }));

          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            response: response?.data?.message,
          }));

          const targetElement = document.getElementById("view");
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      })
      .catch((error) => {
        setIsLoading((prev) => ({
          ...prev,
          submitLoading: false,
        }));

        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: errorHandler(error),
        }));

        const targetElement = document.getElementById("view");
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
  }

  useEffect(() => {
    // Un comment later
    // user not logged in
    // if (!isLogin) {
    //   navigate(
    //     `/signIn/purchasingOrder?factoryId=${factoryId}&factoryName=${factoryName}${
    //       productId !== null
    //         ? `&productId=${productId}&productName=${productName}`
    //         : ""
    //     }`
    //   );
    // }

    // importer not verfified
    if (currentUserData && currentUserData?.factoryId !== undefined) {
      if (currentUserData?.factoryId !== null) {
        setModalShow((prevVal) => ({
          ...prevVal,
          isFactoryVerified: true,
        }));
      }
    }

    // importer not verfified
    if (
      currentUserData &&
      currentUserData?.importerId !== undefined &&
      currentUserData?.importerVerified != undefined &&
      currentUserData?.importerEmailActivated != undefined
    ) {
      if (
        currentUserData &&
        currentUserData?.importerId !== null &&
        (currentUserData?.importerVerified == 0 ||
          !currentUserData?.importerEmailActivated)
      ) {
        setModalShow((prevVal) => ({
          ...prevVal,
          isImporterVerified: true,
        }));
      }
    }

    // for defult user
    if (currentUserData && currentUserData?.factoryId !== undefined) {
      if (
        currentUserData &&
        currentUserData?.factoryId == null &&
        currentUserData?.importerId == null
      ) {
        setModalShow((prevVal) => ({
          ...prevVal,
          isFactoryVerified: true,
        }));
      } else {
        setModalShow((prevVal) => ({
          ...prevVal,
          isFactoryVerified: false,
        }));
      }
    }
    // }
  }, [currentUserData, isLogin, isLoading]);

  if (isLoading?.pageLoading) {
    return <LoadingForm2 title="Send PO " subTitle="PO" />;
  }

  return (
    <section className="">
      <ImporterUnVerifiedFullScreen show={modalShow.isImporterVerified} />
      <FormValidation show={modalShow.isFactoryVerified} userType="Buyer" />

      {/* {isLoading?.pageLoading && <LoadingForm title="Send PO " subTitle="PO" />} */}

      <Header title="Send PO " subTitle="PO" />
      <form onSubmit={formValidation.handleSubmit}>
        <section id="view" className="send-po">
          {/*  Product Description */}
          {Object.keys(productDetails).length > 0 ? (
            <div className="container container-po ">
              <div className="input-content ">
                <div className="title-text w-100 ">
                  <h5>Product Details</h5>
                </div>

                <div className="row row-container w-100 ">
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productDetails?.name || ""}
                        readOnly
                      />
                      <input
                        type="text"
                        className="form-control"
                        id="productId"
                        name="productId"
                        value={formValidation?.values?.id}
                        readOnly
                        hidden
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Sku</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productDetails?.Sku || ""}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>hsnCode</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productDetails?.hsnCode || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productDetails?.country || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Price </label>
                      <input
                        type="text"
                        className="form-control"
                        value={productDetails?.price || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>guarantee </label>
                      <input
                        type="email"
                        className="form-control"
                        value={productDetails?.guarantee || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>description</label>
                      <textarea
                        type="text"
                        className="form-control"
                        value={productDetails?.description || ""}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* Factory description */}

          <div className="container container-po ">
            <FactoryInfo productDetails={factoryDetails} />
          </div>

          <div className="container container-po ">
            <CurrentAcccountInfo />
          </div>

          {/* Grid  */}
          <div className="container container-po ">
            <div className="input-content ">
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}

              <div className="title-text w-100 ">
                <h5>PO Details</h5>
              </div>

              <div className="row row-container w-100 ">
                {Object?.keys(productDetails)?.length === 0 &&
                sourcingOfferId == null ? (
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label forhtml="productId">selected product</label>
                      <select
                        id="productId"
                        name="productId"
                        className="form-select form-control"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation?.values?.productId}
                        onClick={(e) => {
                          let selectedProductName = "";
                          productDetailsArr.find(
                            (item) =>
                              item.id == e.target.value
                                ? (selectedProductName = item.name)
                                : ""
                            // )
                          );

                          formValidation.setFieldValue(
                            "productName",
                            selectedProductName
                          ); // Assuming 'productName' is the field name for product name
                        }}
                      >
                        {productDetailsArr.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {/* newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww */}

                <SharedConditionsValidate
                  formValidation={formValidation}
                  quantityTitle="Total Quantity"
                />

                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label htmlFor="paymentType">payment Term *</label>

                    <select
                      className="form-select form-control"
                      id="paymentType"
                      name="paymentType"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.paymentType}
                    >
                      <option value="">select</option>
                      {paymentTypeArr.map((item) => (
                        <option value={item?.value}>{item?.name}</option>
                      ))}
                    </select>

                    {formValidation.errors.paymentType &&
                    formValidation.touched.paymentType ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.paymentType}
                      </small>
                    ) : (
                      ""
                    )}
                    {formValidation.values.paymentType == "other" ? (
                      <textarea
                        className="form-control w-100 "
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.paymentTypeOther}
                        id="paymentTypeOther"
                        name="paymentTypeOther"
                        rows="3"
                        placeholder="enter more details"
                      ></textarea>
                    ) : (
                      ""
                    )}

                    {formValidation.errors.paymentTypeOther &&
                    formValidation.touched.paymentTypeOther ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.paymentTypeOther}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="col-12">
                  <div class="form-check w-100 d-blcok ">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="allowDelay"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.allowDelay}
                    />
                    <label class="form-check-label">Allow Delay</label>
                  </div>
                </div>
                {formValidation?.values?.allowDelay && (
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label forhtml="timeManufacturingDelay">
                        time of Manufacturing Delay *
                      </label>

                      <div className="input-group  h-100">
                        <div className="input-group-prepend">
                          <select
                            className="input-group-text h-100 p-2 m-0"
                            name="timeManufacturingDelayDuration"
                            id="timeManufacturingDelayDuration"
                            onChange={formValidation.handleChange}
                            onBlur={formValidation.handleBlur}
                            value={
                              formValidation.values
                                .timeManufacturingDelayDuration
                            }
                          >
                            {/* <select className="input-group-text h-100  m-0" name="" id=""> */}

                            <option value="week">Week</option>
                            <option value="month">Month</option>
                          </select>
                        </div>

                        <input
                          type="text"
                          className="form-control"
                          id="timeManufacturingDelay"
                          name="timeManufacturingDelay"
                          placeholder="1 week"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.timeManufacturingDelay}
                        />
                      </div>
                      {formValidation.errors.timeManufacturingDelay &&
                      formValidation.touched.timeManufacturingDelay ? (
                        <small className="form-text text-danger">
                          {formValidation.errors.timeManufacturingDelay}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
                <div className="col-12 ">
                  <div className="form-group form-control ">
                    <div className="form-group timeline-container ">
                      <label> Timeline</label>

                      {/* 1 */}
                      <div className=" timeline form-control checked d-flex justify-content-between align-content-center">
                        <div className="row w-100  p-0 m-0">
                          <div className="form-group col-xxl-6 col-xl-6   col-lg-6 col-md-12 col-sm-12">
                            <label forhtml="startTimeLine">Date* </label>
                            <input
                              type="datetime-local"
                              className="form-control d-block"
                              id="startTimeLine"
                              placeholder="Product 1"
                              onChange={formValidation.handleChange}
                              onBlur={formValidation.handleBlur}
                              value={formValidation.values.startTimeLine}
                            />
                            {formValidation.errors.startTimeLine &&
                            formValidation.touched.startTimeLine ? (
                              <small className="form-text text-danger">
                                {formValidation.errors.startTimeLine}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>

                          <div className="form-group col-xxl-6 col-xl-6   col-lg-6 col-md-12 col-sm-12">
                            <label forhtml="TimeLineQuantity">Quantity* </label>
                            <input
                              type="text"
                              className="form-control"
                              id="TimeLineQuantity"
                              placeholder="Enter Quantity"
                              onChange={formValidation.handleChange}
                              onBlur={formValidation.handleBlur}
                              value={formValidation.values.TimeLineQuantity}
                            />
                            {formValidation.errors.TimeLineQuantity &&
                            formValidation.touched.TimeLineQuantity ? (
                              <small className="form-text text-danger">
                                {formValidation.errors.TimeLineQuantity}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      {timelineArr?.map((dateSection, index) => (
                        <>
                          <div className=" timeline form-control checked d-flex justify-content-between align-content-center ">
                            <div className="row w-100   mx-auto">
                              <div className="form-group  col-xxl-6 col-xl-6   col-lg-6 col-md-12 col-sm-12   ">
                                <label forhtml="startTimeLine">
                                  Date {index + 2}*
                                </label>
                                <input
                                  type="datetime-local"
                                  className="form-control"
                                  id={`startTimeLine${index}`}
                                  onChange={formValidation.handleChange}
                                  onBlur={formValidation.handleBlur}
                                  value={
                                    formValidation.values[
                                      `startTimeLine${index}`
                                    ]
                                  }
                                />
                                {formValidation.errors[
                                  `startTimeLine${index}`
                                ] &&
                                formValidation.touched[
                                  `startTimeLine${index}`
                                ] ? (
                                  <small className="form-text text-danger">
                                    {
                                      formValidation.errors[
                                        `startTimeLine${index}`
                                      ]
                                    }
                                  </small>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div
                                className={`form-group    ${
                                  timelineArr?.length - 1 === index
                                    ? "   col-lg-5 col-md-11 col-sm-12 "
                                    : "  col-lg-6 col-md-12"
                                }`}
                              >
                                <label forhtml="TimeLineQuantity">
                                  Quantity {index + 2}*
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id={`TimeLineQuantity${index}`}
                                  placeholder="Enter Quantity"
                                  onChange={formValidation.handleChange}
                                  onBlur={formValidation.handleBlur}
                                  value={
                                    formValidation.values[
                                      `TimeLineQuantity${index}`
                                    ]
                                  }
                                />
                                {formValidation.errors[
                                  `TimeLineQuantity${index}`
                                ] &&
                                formValidation.touched[
                                  `TimeLineQuantity${index}`
                                ] ? (
                                  <small className="form-text text-danger">
                                    {
                                      formValidation.errors[
                                        `TimeLineQuantity${index}`
                                      ]
                                    }
                                  </small>
                                ) : (
                                  ""
                                )}
                              </div>
                              {timelineArr?.length - 1 === index ? (
                                <div className="col-md-1 col-sm-12">
                                  <div className="w-100 h-100 justify-content-center align-items-center d-flex pt-mt ">
                                    <i
                                      class=" w-25 cursor fa-solid fa-minus text-white px-3 py-2"
                                      onClick={() => removenewSepcialChar()}
                                    ></i>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </>
                      ))}

                      {timelineArr.length < 4 ? (
                        <div className="action ">
                          <div
                            className="cursor"
                            onClick={() => addnewSepcialChar()}
                          >
                            <button className="action-btn btn-1 " type="button">
                              add
                            </button>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group">
                    <label forhtml="conditionsOfDelays">
                      Conditions of delay
                    </label>
                    <textarea
                      type="email"
                      className="form-control"
                      id="conditionsOfDelays"
                      name="conditionsOfDelays"
                      placeholder="Conditions of delay"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.conditionsOfDelays}
                    />
                    {formValidation.errors.conditionsOfDelays &&
                    formValidation.touched.conditionsOfDelays ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.conditionsOfDelays}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group">
                    <label forhtml="instructions">instructions</label>
                    <textarea
                      type="email"
                      className="form-control"
                      id="instructions"
                      name="instructions"
                      placeholder="enter Legal stamp"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.instructions}
                    />
                    {formValidation.errors.instructions &&
                    formValidation.touched.instructions ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.instructions}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <UploadDocument
                  selectedDocs={selectedDocs}
                  errorMsg={errorMsg}
                  setSelectedDocs={setSelectedDocs}
                  MediaName="legalStamp"
                  mediaMaxLen="3"
                  meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
                  setErrorMsg={setErrorMsg}
                  title="legal Stamp"
                />

                <UploadDocument
                  selectedDocs={selectedDocs}
                  errorMsg={errorMsg}
                  setSelectedDocs={setSelectedDocs}
                  MediaName="docs"
                  mediaMaxLen="3"
                  meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
                  setErrorMsg={setErrorMsg}
                  title="Upload Documents"
                />

                <div className=" action col-12">
                  {isLoading?.submitLoading ? (
                    <button type="button" className="action-btn btn-1 w-100 ">
                      <i className="fas fa-spinner fa-spin"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="action-btn btn-1 w-100 submitButton"
                      onClick={() => {
                        if (formValidation.isValid == false) {
                          const targetElement = document.getElementById(
                            Object.keys(formValidation.errors)?.[0]
                          );

                          Object.keys(formValidation.values).forEach(
                            (field) => {
                              formValidation.setFieldTouched(field, true);
                            }
                          );

                          if (targetElement) {
                            targetElement.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                        }
                      }}
                    >
                      Send PO
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
    </section>
  );
}

export default PurchasingOrder;
