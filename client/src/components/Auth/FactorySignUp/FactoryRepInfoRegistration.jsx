import React, { useState, useContext, useEffect } from "react";

import {
  awaitImg,
  nextImg,
  currentsubPoint,
  checkedImg,
} from "constants/Images";

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { baseUrl } from "config.js";

import * as Yup from "yup";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { countriesMiddleEast } from "constants/countries";
import "./UserType.css";

function FactoryRepInfoRegistration() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData, setCurrentUserData } = useContext(userDetails);

  document.title = "Company RegistrationUser Type";
  useEffect(() => {
    if (!isLogin) {
      navigate(`/signIn/CompanyDetails/RepresentiveDetails`);
    }

    // }
  }, [isLogin]);

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState();

  const [isLoading, setIsLoading] = useState(false);

  let validationSchema = Yup.object().shape({
    userType: Yup.string(),

    // if user type == factory
    repName: Yup.string()
      .min(3, "min length is 3")
      .max(50, "max length is 50")
      .required("Input field is Required"),
    repLastName: Yup.string()
      .min(3, "min length is 3")
      .max(50, "max length is 50")
      .required("Input field is Required"),

    repEmail: Yup.string()
      .email("Invalid email")
      .required("Input Field is Required")
      .min(10, "min length is 10")
      .max(255, "max length is 255"),

    repPhone: Yup.string()
      .required("Input Field is Required")
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .min(6, "min length is 6")
      .max(15, "max length is 15"),
  });

  let formValidation = useFormik({
    initialValues: {
      repName: "",
      repLastName: "",
      factoryName: "",

      repEmail: "",

      repPhone: "",
      repPhoneCode: countriesMiddleEast?.[0].phoneCode,

      allowEmailNotification: "false",
    },
    validationSchema,
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    setIsLoading(true);

    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    try {
      let data = {
        repEmail: values.repEmail,
        allowEmailNotification: values.allowEmailNotification,
        repName: [values.repName, values.repLastName],

        repPhone: `${values.repPhoneCode}${values.repPhone}`,
      };

      // return (data)
      let config = {
        method: "put",

        url: `${baseUrl}/factories/update/fromUser`,
        data: data,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);
      setErrorMsg((prevErrors) => {
        const { response, ...restErrors } = prevErrors || {};
        return restErrors;
      });

      if (response?.data?.message === "done") {
        navigate(`/CompanyDetails/LegalDocuments`);

        setCurrentUserData((prevUserData) => ({
          ...prevUserData,
          factoryId: response?.data?.factory?.id,
        }));

        setIsLoading(true);
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response?.data?.message,
        }));

        const targetElement = document.getElementById("view");
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);

      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            if (error?.response?.data?.errorMessage == "Validation error") {
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response: "Email must be unique",
              }));
            } else {
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response: error?.response?.data?.errorMessage,
              }));
            }

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
            if (error?.response?.data?.errorMessage == "Validation error") {
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response: "Comapny Name must be unique",
              }));
            } else {
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response: error?.response?.data?.errorMessage,
              }));
            }

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
            break;
          default:
            // case message== error
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;
        }
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: "An unexpected error occurred. Please try again later.",
        }));
      }

      const targetElement = document.getElementById("view");
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    // }
  }

  return (
    <>
      <section id="view" className="register-msg ">
        <div className=" container ">
          <div className=" cont-1 d-flex justify-content-center align-items-center mx-auto  ">
            <div className=" sub-cont w-100">
              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="img-cont ms-5">
                    <img src={checkedImg} alt="" />
                  </div>

                  <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont  ">Select Your Role</p>
              </div>

              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line mt-auto mb-auto"></div>
                  <div className="img-cont">
                    <img src={checkedImg} alt="" />
                  </div>

                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>
                  <div className="img-cont d-flex align-items-center ">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>

                  <div className="img-cont  d-flex align-items-center">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>

                  <div className="img-cont  d-flex align-items-center">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont text-center">
                  Company Microsite Details
                </p>
              </div>

              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                  <div className="img-cont">
                    <img src={awaitImg} alt="" />
                  </div>

                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont text-center">
                  Representive Information
                </p>
              </div>

              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                  <div className="img-cont me-5">
                    <img src={nextImg} alt="" />
                  </div>
                </div>
                <p className="text-cont text-end">Legal Documents</p>
              </div>
            </div>
          </div>

          <form onSubmit={formValidation.handleSubmit} className="w-100 ">
            <div className="sec-div d-flex justify-content-center">
              <div className="frame-container-2 ">
                <div className="cont-frame-1 ">
                  {errorMsg?.response && (
                    <p className="text-sub m-auto alert  alert-danger  text-dark w-100">
                      {errorMsg.response}
                    </p>
                  )}

                  <div className="row gap-row-2">
                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group gap">
                          <label className="form-title">
                            Representive first Name
                            <span className="text-danger"> * </span>
                          </label>
                          <input
                            type="text"
                            className="form-control input-style"
                            id="repName"
                            name="repName"
                            placeholder="Enter full Name"
                            onChange={formValidation.handleChange}
                            onBlur={formValidation.handleBlur}
                            value={formValidation.values.repName}
                          />
                          {formValidation.errors.repName &&
                          formValidation.touched.repName ? (
                            <small className="text-danger">
                              {formValidation.errors.repName}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group gap">
                          <label className="form-title">
                            Representive last Name
                            <span className="text-danger"> * </span>
                          </label>
                          <input
                            type="text"
                            className="form-control input-style"
                            id="repLastName"
                            name="repLastName"
                            placeholder="Enter full Name"
                            onChange={formValidation.handleChange}
                            onBlur={formValidation.handleBlur}
                            value={formValidation.values.repLastName}
                          />
                          {formValidation.errors.repLastName &&
                          formValidation.touched.repLastName ? (
                            <small className="text-danger">
                              {formValidation.errors.repLastName}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group gap">
                          <label className="form-title">
                            Representive Email
                            <span className="text-danger"> * </span>
                          </label>
                          <input
                            type="text"
                            className="form-control input-style"
                            id="repEmail"
                            name="repEmail"
                            placeholder="enter Representive Email"
                            onChange={formValidation.handleChange}
                            onBlur={formValidation.handleBlur}
                            value={formValidation.values.repEmail}
                          />

                          {formValidation.errors.repEmail &&
                          formValidation.touched.repEmail ? (
                            <small className="text-danger">
                              {formValidation.errors.repEmail}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ----------------------- */}
                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group gap">
                          <label className="form-title">
                            Representive Phone Number
                            <span className="text-danger"> * </span>
                          </label>
                          <div className="input-group  h-100">
                            <div className="input-group-prepend">
                              <select
                                className="input-group-text h-100 p-2 m-0 phone-borders"
                                id="repPhoneCode"
                                name="repPhoneCode"
                                placeholder="1113534343"
                                onChange={formValidation.handleChange}
                                value={formValidation.values.repPhoneCode}
                                onBlur={formValidation.handleBlur}
                              >
                                {/* <select className="input-group-text h-100  m-0" name="" id=""> */}

                                {countriesMiddleEast.map((phoneItem) => (
                                  <option value={phoneItem.phoneCode}>
                                    {phoneItem.phoneCode}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <input
                              type="text"
                              className="form-control input-style phone-border"
                              id="repPhone"
                              name="repPhone"
                              placeholder="1113534343"
                              onChange={formValidation.handleChange}
                              value={formValidation.values.repPhone}
                              onBlur={formValidation.handleBlur}
                            />
                          </div>
                          {formValidation.errors.repPhone &&
                          formValidation.touched.repPhone ? (
                            <small className="form-text text-danger">
                              {formValidation.errors.repPhone}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group m-0 p-0">
                        <label>Allow Email Notifications</label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input switch-input cursor form-select form-control"
                          type="checkbox"
                          id="allowEmailNotification"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.allowEmailNotification}
                        />
                        {/* </div> */}
                      </div>
                    </div>

                    <div className="col-12 action">
                      {isLoading ? (
                        <button
                          type="button"
                          className="action-btn btn-1 w-100"
                        >
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
                          Countinue
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-center">
                    <small
                      className="text-muted title-small cursor"
                      onClick={() => {
                        navigate(`/CompanyDetails/LegalDocuments`);
                      }}
                    >
                      Skip
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default FactoryRepInfoRegistration;
