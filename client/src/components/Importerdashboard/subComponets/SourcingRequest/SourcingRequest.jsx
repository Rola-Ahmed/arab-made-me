import { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "config.js";
import {
  requiredStringMax255,
  reqQualityValidate,
  otherTextAreaValidate,
  requiredDateValidate,
  textAreaValidate,
} from "utils/validationUtils";
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
import SpecialChar from "components/Forms/Shared/SpecialChar/SpecialChar";

// import "./PurchasingOrder.css";
function SourcingRequest() {
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let { setGlobalMsg } = useContext(GlobalMsgContext);

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);


  // ------------------------Form Validation
  let validationSchema = Yup.object().shape({
    productName: requiredStringMax255,

    quantity: reqQualityValidate,

    packingConditions: Yup.string(),
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),

    paymentType: Yup.string(),
    paymentTypeOther: otherTextAreaValidate("paymentType", "other"),

    qualityConditions: Yup.string(),
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    deadline: requiredDateValidate,

    otherInfoRequest: textAreaValidate(),

    productDescription: requiredStringMax255,

    country: Yup.array()
      .of(Yup.string())
      .nullable(),

    productCharacteristic: Yup.array().of(
      Yup.object().shape({
        keyword: Yup.string().max(50, "max legnth is  50"),
        value: Yup.string().max(50, "max legnth is  50"),
      })
    ),
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

    productCharacteristic: [
      {
        keyword: "",
        value: "",
      },
    ],
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

    if (Object.keys(values.productCharacteristic).length != 0) {
      // create an object with the keyword property as the key and the value property as the value.
      const obj = Object.fromEntries(
        values.productCharacteristic.map((obj) => [obj.keyword, obj.value])
      );
      data.specialCharacteristics = obj;
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




  if (
    currentUserData?.importerVerified == "0" ||
    currentUserData?.importerEmailActivated == false
  ) {
    return <ImporterUnVerified />;
  }
  console.log("formvalidation",formValidation)
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
              <div className="col-12 ms-3 ">
                <div className="border-row row">
                  <div>
                    <label className="pb-2">Product Characteristics</label>
                  </div>

                  <SpecialChar
                    formValidation={formValidation}
                    vlaidationName="productCharacteristic"
                  />
                </div>
              </div>

              {/* ----------------------------------------- */}

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
