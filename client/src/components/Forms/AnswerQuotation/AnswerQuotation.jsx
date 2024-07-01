import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { GlobalMsgContext } from "Context/globalMessage";

import { useNavigate, useSearchParams } from "react-router-dom";

import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { packingConditionsArr } from "constants/packingConditionsArr";

import Footer from "components/main/Footer/Footer";
import Header from "components/main/Header/Header";
import Navbar from "components/main/Navbar/Navbar";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
// import "./PurchasingOrder.css";
export default function AnswerQuotation() {
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);

  let { currentUserData } = useContext(userDetails);
  let { setGlobalMsg } = useContext(GlobalMsgContext);

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const sourcingRequestId = searchParams.get("sourcingRequestId");
  const quotationRequestId = searchParams.get("quotationRequestId");
  const specialManufacturingRequestId = searchParams.get(
    "specialManufacturingRequestId"
  );
  const productName = searchParams.get("productName");
  const productId = searchParams.get("productId");
  const importerId = searchParams.get("userId");

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const year = tomorrow.getFullYear();
  const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");
  const day = tomorrow.getDate().toString().padStart(2, "0");
  const hours = tomorrow.getHours().toString().padStart(2, "0");
  const minutes = tomorrow.getMinutes().toString().padStart(2, "0");

  // Format the date as per the 'datetime-local' input type
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

  // ------------------------Form Validation
  let validationSchema = Yup.object().shape({
    quantity: Yup.string()
      .required("Input field is Required")
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),
    minQuantity: Yup.string()
      .required("Input field is Required")
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    price: Yup.string()
      .required("Input field is Required")
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    discounts: Yup.string()
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    packingConditions: Yup.string(),
    packingConditionsOther: Yup.string().when("packingConditions", {
      is: "other",
      then: (schema) =>
        schema
          //.min(16, "min legnth is 16")
          .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    paymentType: Yup.string(),
    paymentTypeOther: Yup.string().when("paymentType", {
      is: "other",
      then: (schema) =>
        schema
          //.min(16, "min legnth is 16")
          .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    qualityConditions: Yup.string().required("Input field is Required"),
    qualityConditionsOther: Yup.string().when("qualityConditions", {
      is: "other",
      then: (schema) =>
        schema
          //.min(16, "min legnth is 16")
          .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    shippingConditions: Yup.string().required(" Input field is Required"),

    startDeliveryDate: Yup.date().min(formattedDate, "Invalid Date"),
    endDeliveryDate: Yup.date().min(formattedDate, "Invalid Date"),

    notes: Yup.string()
      //.min(16, "min legnth is 16")
      .max(255, "max legnth is 255"),
  });

  let initialValues = {
    quantity: "", //requried
    minQuantity: "", //requried
    price: "", //requried
    discounts: "", //optional
    shippingConditions: "", //required,
    packingConditions: "box", //req
    paymentType: "advancePayment", //req
    qualityConditions: "", //req
    startDeliveryDate: "", //optional
    endDeliveryDate: "", //optional
    country: "", //
    productDescription: "", //requried
    notes: "", //optional

    // productName: productName || "", //requried

    // Send only one of those ids:
    specialManufacturingRequestId: specialManufacturingRequestId || "",
    privateLabelingId: "",
    sourcingRequestId: sourcingRequestId || "",
    quotationRequestId: quotationRequestId || "",

    // importerId: currentUserData?.importerId,
    importerId: importerId || "",
    productName: productName || "",

    qualityConditionsOther: "",
    packingConditionsOther: "",
    paymentTypeOther: "",
  };

  let formValidation = useFormik({
    initialValues,

    validationSchema,
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    setIsLoading(true);

    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    let data = {
      importerId: values.importerId,
      productName: values.productName,
      quantity: values.quantity,
      minQuantity: values.minQuantity,

      price: values.price,

      qualityConditions:
        values.qualityConditions == "other"
          ? values.qualityConditionsOther
          : values.qualityConditions,

      shippingConditions: values.shippingConditions,

      packingConditions:
        values.packingConditions === "other"
          ? values.packingConditionsOther
          : values.packingConditions,

      paymentTerms:
        values.paymentType == "other"
          ? values.paymentTypeOther
          : values.paymentType,
      timeForDelivery: {},
    };

    if (values.discounts !== "") {
      data.discounts = values.discounts;
    }

    if (values.notes !== "") {
      data.notes = values.notes;
    }

    if (values.startDeliveryDate !== "") {
      data.timeForDelivery["start"] = values.startDeliveryDate;
    }
    if (values.endDeliveryDate !== "") {
      data.timeForDelivery["end"] = values.endDeliveryDate;
    }

    let addIdpath = "";

    if (values.privateLabelingId !== "") {
      data.privateLabelingId = values.privateLabelingId;
      addIdpath = "privateLabel";
    }

    if (values.sourcingRequestId !== "") {
      data.sourcingRequestId = values.sourcingRequestId;
      addIdpath = "sourcingRequest";
    }

    if (values.quotationRequestId !== "") {
      data.quotationRequestId = values.quotationRequestId;
      data.productId = productId;
      addIdpath = "rfq";
    }
    if (values.specialManufacturingRequestId !== "") {
      data.specialManufacturingRequestId = values.specialManufacturingRequestId;
      addIdpath = "spmf";
    }

    try {
      let config = {
        method: "post",
        url: `${baseUrl}/quotations/add/${addIdpath}`,

        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setGlobalMsg("Your Quotation has been successfully submitted");
        navigate(-1);
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response.data.message,
        }));

        const targetElement = document.getElementById("view");
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;
          case 401:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              // response: "User is not Unauthorized ",
              response: error?.response?.data?.message,
            }));
            break;
          case 403:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                "Forbidden, You do not have permission to access this resource.",
            }));

            break;
          case 404:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                "Not Found (404). The requested resource was not found.",
            }));

            break;

          case 500:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;

          //  429 Too Many Requests
          // The user has sent too many requests in a given amount of time ("rate limiting").
          case 429:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: " Too Many Requests , Please try again later.",
            }));
            break;
          case 402:
            // 402
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.message,
            }));
            window.scrollTo({ top: 390 });

            break;
          default:
            window.scrollTo({ top: 390 });

            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            // case message== error
            break;
        }
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: "An unexpected error occurred. Please try again later.",
        }));
      }
      setIsLoading(false);
      const targetElement = document.getElementById("view");
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <>
      <Navbar />
      <Header title="Send Quotation " subTitle="Quotation" />
      <form onSubmit={formValidation.handleSubmit}>
        <section id="view" className="req-visit">
          {/* Grid  */}
          <div className="container container-req ">
            <div className="input-content ">
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}{" "}
                </div>
              ) : (
                ""
              )}

              <div className="title-text w-100 ">
                <h5> Quotation Details</h5>
              </div>

              <div className="row row-container w-100 ">
                <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label forhtml="quantity">Quantity*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      placeholder="Enter QUANTITY"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.quantity}
                    />
                    {formValidation.errors.quantity &&
                    formValidation.touched.quantity ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.quantity}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label forhtml="minQuantity">minQuantity*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="minQuantity"
                      name="minQuantity"
                      placeholder="Enter minQuantity"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.minQuantity}
                    />
                    {formValidation.errors.minQuantity &&
                    formValidation.touched.minQuantity ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.minQuantity}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label forhtml="price">Price*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="price"
                      name="price"
                      placeholder="Enter price"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.price}
                    />
                    {formValidation.errors.price &&
                    formValidation.touched.price ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.price}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label forhtml="discounts">discounts</label>
                    <input
                      type="text"
                      className="form-control"
                      id="discounts"
                      name="discounts"
                      placeholder="Enter discounts"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.discounts}
                    />
                    {formValidation.errors.discounts &&
                    formValidation.touched.discounts ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.discounts}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label htmlFor="shippingConditions">
                      shipping conditions*
                    </label>
                    <select
                      id="shippingConditions"
                      name="shippingConditions"
                      className="form-select form-control"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.shippingConditions}
                    >
                      {shippingConditionsArr.map((item) => (
                        <option value={item?.value}>{item?.name}</option>
                      ))}
                    </select>
                    {formValidation.errors.shippingConditions &&
                    formValidation.touched.shippingConditions ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.shippingConditions}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label htmlFor="packingConditions">
                      Packing condition*
                    </label>
                    <select
                      id="packingConditions"
                      name="packingConditions"
                      className="form-select form-control"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.packingConditions}
                    >
                      {packingConditionsArr.map((item) => (
                        <option value={item?.value}>{item?.name}</option>
                      ))}
                    </select>

                    {formValidation.values.packingConditions == "other" ? (
                      <textarea
                        className="form-control w-100 "
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.packingConditionsOther}
                        id="packingConditionsOther"
                        name="packingConditionsOther"
                        rows="3"
                        placeholder="enter more details"
                      ></textarea>
                    ) : (
                      ""
                    )}

                    {formValidation.errors.packingConditionsOther &&
                    formValidation.touched.packingConditionsOther ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.packingConditionsOther}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label htmlFor="paymentType">payment Term*</label>

                    <select
                      className="form-select form-control"
                      id="paymentType"
                      name="paymentType"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.paymentType}
                    >
                      <option value="advancePayment">
                        Advance payment on order
                      </option>
                      <option value="immediateCreditCardCharge">
                        The credit card will be charged immediately after the
                        order
                      </option>
                      <option value="immediateInvoicePayment">
                        Payable immediately upon issuance of the invoice
                      </option>
                      <option value="payableWithin14Days">
                        Payable within 14 days
                      </option>

                      <option value="other">Other Payment Terms</option>
                    </select>
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

                <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label htmlFor="qualityConditions">
                      Quality Condition*
                    </label>

                    <select
                      className="form-select form-control"
                      id="qualityConditions"
                      name="qualityConditions"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.qualityConditions}
                    >
                      {qualityConditionsArr.map((item) => (
                        <option value={item?.value}>{item?.name}</option>
                      ))}
                    </select>

                    {formValidation.values.qualityConditions == "other" ? (
                      <textarea
                        className="form-control w-100 "
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.qualityConditionsOther}
                        id="qualityConditionsOther"
                        name="qualityConditionsOther"
                        rows="3"
                        placeholder="enter more details"
                      ></textarea>
                    ) : (
                      ""
                    )}

                    {formValidation.errors.qualityConditionsOther &&
                    formValidation.touched.qualityConditionsOther ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.qualityConditionsOther}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                {/*  */}
                <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label forhtml="startDeliveryDate">Start Deadline</label>
                    <input
                      type="datetime-local"
                      className="form-control d-block"
                      id="startDeliveryDate"
                      name="startDeliveryDate"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.startDeliveryDate}
                    />
                    {formValidation.errors.startDeliveryDate &&
                    formValidation.touched.startDeliveryDate ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.startDeliveryDate}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label forhtml="endDeliveryDate">end Deadline</label>
                    <input
                      type="datetime-local"
                      className="form-control d-block"
                      id="endDeliveryDate"
                      name="endDeliveryDate"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.endDeliveryDate}
                    />
                    {formValidation.errors.endDeliveryDate &&
                    formValidation.touched.endDeliveryDate ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.endDeliveryDate}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                {/*  */}

                <div className="col-12">
                  <div className="form-group">
                    <label forhtml="notes">Other Information</label>
                    <textarea
                      type="email"
                      className="form-control"
                      id="notes"
                      name="notes"
                      placeholder="Conditions of delay"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.notes}
                    />
                    {formValidation.errors.notes &&
                    formValidation.touched.notes ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.notes}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              <div className="action row">
                <div className="col-12">
                  {isLoading ? (
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

                          // Scroll to the target element
                          targetElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }
                      }}
                    >
                      Send Quotation
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>

      <Footer />
    </>
  );
}
