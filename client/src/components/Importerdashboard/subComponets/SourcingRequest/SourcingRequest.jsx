import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { GlobalMsgContext } from "Context/globalMessage";
import { qualityConditionsArr } from "constants/qualityConditionsArr";

import { packingConditionsArr } from "constants/packingConditionsArr";

import { useNavigate } from "react-router-dom";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedDash";

import { countriesMiddleEast } from "constants/countries";
import "./SourcingRequest.css";
import { shippingConditionsArr } from "constants/shippingConditionsArr";

// import "./PurchasingOrder.css";
function SourcingRequest() {
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let { setGlobalMsg } = useContext(GlobalMsgContext);

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [specialCharacteristicsArr, SetSpecialCharacteristicsArr] = useState(
    []
  );

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
    productName: Yup.string()
      .required("Input Field is Required")
      .max(25, "max length is 25"),

    quantity: Yup.string()
      .required("Input field is Required")
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    packingConditions: Yup.string(),
    packingConditionsOther: Yup.string().when("packingConditions", {
      is: "other",
      then: (schema) =>
        schema

          .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    paymentType: Yup.string(),
    paymentTypeOther: Yup.string().when("paymentType", {
      is: "other",
      then: (schema) =>
        schema

          .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    qualityConditions: Yup.string(),
    qualityConditionsOther: Yup.string().when("qualityConditions", {
      is: "other",
      then: (schema) =>
        schema

          .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    deadline: Yup.date().min(formattedDate, "Invalid Date"),

    otherInfoRequest: Yup.string().max(255, "max legnth is 255"),

    productDescription: Yup.string()
      .required("Input field is Required")

      .max(255, "max legnth is 255"),

    country: Yup.array().of(Yup.string()).nullable(),

    specialCharKeyWord: Yup.string()
      // .required("Input field is Required")
      .min(3, "min legnth is 3")
      .max(50, "max legnth is 50"),
    specialCharDesc: Yup.string()
      // .required("Input field is Required")
      .min(3, "min legnth is 3")
      .max(50, "max legnth is 50"),

    ...specialCharacteristicsArr?.reduce((acc, _, index) => {
      acc[`specialCharKeyWord${index}`] = Yup.string()
        //   .required("Input field is Required")
        .min(3, "min legnth is 3")
        .max(50, "max legnth is 50");

      acc[`specialCharDesc${index}`] = Yup.string()
        //   .required("Input field is Required")
        .min(3, "min legnth is 3")
        .max(50, "max legnth is 50");

      return acc;
    }, {}),
  });

  let initialValues = {
    quantity: "", //requried
    productName: "", //requried
    shippingConditions: "", //optional,
    packingConditions: "", //optional
    paymentType: "", //optional
    qualityConditions: "", //optional
    deadline: "", //optional
    country: "", //

    productDescription: "", //requried

    otherInfoRequest: "", //optional

    specialCharKeyWord: "",
    specialCharDesc: "",

    ...specialCharacteristicsArr?.reduce((acc, _, index) => {
      acc[`specialCharKeyWord${index}`] = "";

      acc[`specialCharDesc${index}`] = "";

      return acc;
    }, {}),
  };

  let formValidation = useFormik({
    initialValues,

    validationSchema,
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    let data = {
      productName: values.productName,

      quantity: values.quantity,

      productDescription: values.productDescription,

      //   specialCharacteristics: {
      //     if(values.specialCharKeyWord!==""){

      //         [values.specialCharKeyWord]: values.specialCharDesc,
      //     }

      //     ...(specialCharacteristicsArr?.length > 0
      //       ? Object.assign(
      //           {},
      //           ...specialCharacteristicsArr?.map((index) => ({
      //             [values[`specialCharKeyWord${index}`]]:
      //               values[`specialCharDesc${index}`],
      //           }))
      //         )
      //       : {}),
      //   },
      specialCharacteristics: {},
    };

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
      data.qualityConditions =
        values.qualityConditions == "other"
          ? values.qualityConditionsOther
          : values.qualityConditions;
    }
    if (values.deadline !== "") {
      data.deadline = values.deadline;
    }

    if (values.country.length !== 0) {
      data.preferredCountries = values.country;
    }

    if (values.productDescription !== "") {
      data.productDescription = values.productDescription;
    }

    if (values.otherInfoRequest !== "") {
      data.otherInfoRequest = values.otherInfoRequest;
    }

    if (values.specialCharKeyWord !== "") {
      data.specialCharacteristics[values.specialCharKeyWord] =
        values.specialCharDesc;
    }

    if (specialCharacteristicsArr?.length > 0) {
      specialCharacteristicsArr.forEach((index) => {
        const key = values[`specialCharKeyWord${index}`];
        const desc = values[`specialCharDesc${index}`];
        data.specialCharacteristics[key] = desc;
      });
    }

    try {
      setIsLoading(true);
      let config = {
        method: "post",
        url: `${baseUrl}/sourcingRequests/add`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setGlobalMsg("Your Sourcing Request has been successfully submitted");
        navigate(-1);
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response?.data?.message,
        }));
        window.scrollTo({ top: 390 });
      }
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          // case 200:
          //   setErrorMsg("Success (200).");
          //   break;
          // case 204:
          //   setErrorMsg("No Content (204).");
          //   break;
          case 400:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;
          case 401:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: "User is not Unauthorized ",
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
      window.scrollTo({ top: 390 });
    }
  }

  function addnewSepcialChar() {
    SetSpecialCharacteristicsArr((prevSections) => {
      // Ensure prevSections is an array
      const sectionsArray = Array.isArray(prevSections) ? prevSections : [];

      // Return the updated array with the new section
      return [...sectionsArray, specialCharacteristicsArr?.length];
    });
  }

  function removenewSepcialChar() {
    SetSpecialCharacteristicsArr((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections.pop(); // Remove the last item
      return updatedSections;
    });
  }

  if (
    currentUserData?.importerVerified == "0" ||
    currentUserData?.importerEmailActivated == false
  ) {
    return <ImporterUnVerified />;
  }
  return (
    <>
      <div id="view" className="m-4 order-section  ">
        {/* <ToastContainer /> */}
        <form onSubmit={formValidation.handleSubmit} className="header w-100">
          <div>
            <div className=" d-flex justify-content-between align-items-center ">
              <h2>Add New Sourcing Request</h2>

              <div className="btn-container">
                <button
                  type="button"
                  className="order-btn-1"
                  onClick={() =>
                    navigate("/importerdashboard/AllSourcingRequests")
                  }
                >
                  <p className="cursor">All Requests</p>
                </button>

                {/* {isLoading ? (
                  <button type="button" className="order-btn-2 px-5 ">
                    <i className="fas fa-spinner fa-spin px-2"></i>
                  </button>
                ) : (
                  <button
                    className="order-btn-2"
                    type="submit"
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
                    <i className="fa-solid fa-plus"></i>
                    <p className="cursor">Add Sourcing Request</p>
                  </button>
                )} */}
              </div>
            </div>
          </div>

          {/* <section className="req-visit pt-0 pb-0 m-5 border-0"> */}
          {/* Grid  */}
          <div className="container add-product-dash">
            <div className="row row-container w-100 ">
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}

              {/* <div className="title-text w-100 ">
                  <h5>Sourcing Request Details</h5>
                </div> */}

              {/* <div className="row row-container w-100 "> */}
              <div className="col-4">
                <div className="form-group">
                  <label forhtml="productName">product Name*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    name="productName"
                    placeholder="Enter productName"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.productName}
                  />
                  {formValidation.errors.productName &&
                  formValidation.touched.productName ? (
                    <small className="form-text text-danger">
                      {formValidation.errors.productName}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-4">
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

              <div className="col-4">
                <div className="form-group">
                  <label htmlFor="shippingConditions">
                    shipping conditions
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
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label htmlFor="packingConditions">Packing condition</label>
                  <select
                    id="packingConditions"
                    name="packingConditions"
                    className="form-select form-control"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.packingConditions}
                  >
                    <option value="">Select Packing condition</option>
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

              <div className="col-4">
                <div className="form-group">
                  <label htmlFor="paymentType">payment Term</label>

                  <select
                    className="form-select form-control"
                    id="paymentType"
                    name="paymentType"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.paymentType}
                  >
                    <option value="">Select Payment Term</option>
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

              <div className="col-4">
                <div className="form-group">
                  <label htmlFor="qualityConditions">Quality Condition</label>

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
              <div className="col-4">
                <div className="form-group">
                  <label forhtml="deadline">deadline</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="deadline"
                    name="deadline"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.deadline}
                  />
                  {formValidation.errors.deadline &&
                  formValidation.touched.deadline ? (
                    <small className="form-text text-danger">
                      {formValidation.errors.deadline}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {/*  */}

              <div className="col-4">
                <div className="form-group">
                  <label forhtml="country">Select Countries</label>

                  {/*  */}
                  <button
                    className="btn form-control dropdown-toggle w-100 text-center countries-drop d-flex "
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <p> Select Countries</p>
                    <i className="fa-solid fa-chevron-down text-end my-auto"></i>
                    {/* {Dropdown} */}
                  </button>
                  <ul className="dropdown-menu col-3 scroller">
                    {countriesMiddleEast.map((item) => (
                      <li>
                        <div className=" dropdown-item d-flex justify-content-start align-items-center width-drop">
                          <input
                            //   onClick={(e) => SelectedCountry(e)}
                            onChange={formValidation.handleChange}
                            className="form-check-input cursor me-3 "
                            type="checkbox"
                            name="country"
                            id="country"
                            value={item.code}
                          />
                          <label
                            className="form-check-label p-0 m-0"
                            htmlFor="country"
                          >
                            {item.name}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/*  */}
                </div>
              </div>

              {/* ---------------------------- */}
              <div className="col-12 ">
                {/* <div className="form-group form-control "> */}
                <div className="form-group form-control ">
                  <div className="form-group timeline-container ">
                    {/* <label> Timeline</label> */}
                    <label forhtml="">Product Characteristics </label>

                    {/* 1 */}
                    <div className=" timeline form-control checked d-flex justify-content-between align-content-center">
                      <div className="form-group w-50">
                        <label forhtml="specialCharKeyWord">Keyword </label>
                        <input
                          type="text"
                          id="specialCharKeyWord"
                          name="specialCharKeyWord"
                          className="form-control"
                          placeholder="Color"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.specialCharKeyWord}
                        />

                        {formValidation.errors.specialCharKeyWord &&
                        formValidation.touched.specialCharKeyWord ? (
                          <small className="form-text text-danger">
                            {formValidation.errors.specialCharKeyWord}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="form-group w-50">
                        <label forhtml="specialCharDesc">description </label>
                        <input
                          type="text"
                          className="form-control"
                          id="specialCharDesc"
                          name="specialCharDesc"
                          placeholder="Red"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.specialCharDesc}
                        />

                        {formValidation.errors.specialCharDesc &&
                        formValidation.touched.specialCharDesc ? (
                          <small className="form-text text-danger">
                            {formValidation.errors.specialCharDesc}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    {specialCharacteristicsArr?.map((dateSection, index) => (
                      <>
                        <div className="  timeline form-control checked d-flex justify-content-between align-content-center ">
                          <div className="row w-100 ">
                            <div className="form-group  col-6 col-6-50  ">
                              <label forhtml="specialCharKeyWord">
                                Keyword {index + 2}*
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id={`specialCharKeyWord${index}`}
                                // placeholder={`${formValidation.values.specialCharKeyWord}${index} --`}
                                onChange={formValidation.handleChange}
                                onBlur={formValidation.handleBlur}
                                // value={`${formValidation.values.specialCharKeyWord0} ----`}
                                value={
                                  formValidation.values[
                                    `specialCharKeyWord${index}`
                                  ]
                                }
                              />
                              {formValidation.errors[
                                `specialCharKeyWord${index}`
                              ] &&
                              formValidation.touched[
                                `specialCharKeyWord${index}`
                              ] ? (
                                <small className="form-text text-danger">
                                  {
                                    formValidation.errors[
                                      `specialCharKeyWord${index}`
                                    ]
                                  }
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                            <div
                              className={`form-group    ${
                                specialCharacteristicsArr?.length - 1 === index
                                  ? "col-5"
                                  : " col-6 col-6-50 "
                              }`}
                            >
                              <label forhtml="specialCharDesc">
                                description {index + 2}*
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id={`specialCharDesc${index}`}
                                placeholder="Enter Quantity"
                                onChange={formValidation.handleChange}
                                onBlur={formValidation.handleBlur}
                                value={
                                  formValidation.values[
                                    `specialCharDesc${index}`
                                  ]
                                }
                              />
                              {formValidation.errors[
                                `specialCharDesc${index}`
                              ] &&
                              formValidation.touched[
                                `specialCharDesc${index}`
                              ] ? (
                                <small className="form-text text-danger">
                                  {
                                    formValidation.errors[
                                      `specialCharDesc${index}`
                                    ]
                                  }
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                            {specialCharacteristicsArr?.length - 1 === index ? (
                              <div className=" col-1 h-100 justify-content-center align-items-center d-flex   pt-4">
                                <i
                                  class=" cursor fa-solid fa-minus text-white px-3 py-2"
                                  onClick={() => removenewSepcialChar()}
                                ></i>
                                {/* {dateSection} */}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </>
                    ))}

                    {specialCharacteristicsArr.length < 4 ? (
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
              {/* ------------------------------- */}

              <div className="col-12">
                <div className="form-group">
                  <label forhtml="productDescription">
                    product Description *
                  </label>
                  <textarea
                    type="email"
                    className="form-control"
                    id="productDescription"
                    name="productDescription"
                    placeholder="enter Legal stamp"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.productDescription}
                  />

                  {formValidation.errors.productDescription &&
                  formValidation.touched.productDescription ? (
                    <small className="form-text text-danger">
                      {formValidation.errors.productDescription}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label forhtml="otherInfoRequest">Other Information</label>
                  <textarea
                    type="email"
                    className="form-control"
                    id="otherInfoRequest"
                    name="otherInfoRequest"
                    placeholder="Conditions of delay"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.otherInfoRequest}
                  />
                  {formValidation.errors.otherInfoRequest &&
                  formValidation.touched.otherInfoRequest ? (
                    <small className="form-text text-danger">
                      {formValidation.errors.otherInfoRequest}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="btn-container d-flex justify-content-center">
                  {isLoading ? (
                    <button type="button" className="order-btn-2 px-5 ">
                      <i className="fas fa-spinner fa-spin px-2"></i>
                    </button>
                  ) : (
                    <button
                      className="order-btn-2"
                      type="submit"
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
                      <i className="fa-solid fa-plus"></i>
                      <p className="cursor">Add </p>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default SourcingRequest;
