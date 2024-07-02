import React, { useState, useContext, useEffect } from "react";

import {
  awaitImg,
  nextImg,
  subPoint,
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
import "./UserType.css";

function CompanyRegistrationPhase2() {
  let { isLogin } = useContext(UserToken);
  let { setCurrentUserData } = useContext(userDetails);

  document.title = "Company Registration";
  useEffect(() => {
    if (!isLogin) {
      navigate(`/signIn/CompanyDetails/setp2`);
    }

    // }
  }, [isLogin]);

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState();

  const [isLoading, setIsLoading] = useState(false);

  let validationSchema = Yup.object().shape({
    userType: Yup.string(),

    address: Yup.string()
      .min(3, "min length is 3")
      .max(255, "max length is 255"),

    // addressLink: Yup.string()
    //   .min(3, "min length is 3")
    //   .max(255, "max length is 255"),

    yearOfEstablishmint: Yup.string()
      // .required("Input Field is Required")
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .min(4, "min length is 4")
      .max(4, "max length is 4"),
  });

  let formValidation = useFormik({
    initialValues: {
      address: "",
      // addressLink:"",
      yearOfEstablishmint: "",
      yearlySalesIncome: "",
      numberOfEmployees: "", //select optiton
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
      // setIsLoading(true);

      let data = {};

      if (values.address !== "") data.address = [values.address];
      // if (values.addressLink !== "") data.address.push(values.addressLink)

      if (values.numberOfEmployees !== "")
        data.numberOfEmployees = values.numberOfEmployees;

      if (values.yearOfEstablishmint !== "")
        data.yearOfEstablishmint = values.yearOfEstablishmint;

      if (values.yearlySalesIncome !== "")
        data.yearlySalesIncome = values.yearlySalesIncome;

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
        navigate(`/CompanyDetails/MircoSiteDocs`);
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

      if (error.response) {
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
                    <img src={awaitImg} alt="" />
                  </div>

                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>
                  <div className="img-cont d-flex align-items-center ">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>

                  <div className="img-cont  d-flex align-items-center">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-25 vertical-line-after  mt-auto mb-auto"></div>

                  <div className="img-cont  d-flex align-items-center">
                    <img src={subPoint} alt="" />
                  </div>
                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont text-center">
                  Company Microsite Details
                </p>
              </div>

              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                  <div className="img-cont">
                    <img src={nextImg} alt="" />
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
                    <p className="text-sub m-auto alert  alert-danger  text-dark">
                      {errorMsg.response}
                    </p>
                  )}
                  <div className="row gap-row-2">
                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">
                          Year Of Establishment
                        </label>
                        <input
                          placeholder="Enter Year Of Establishment"
                          className="form-control input-style"
                          id="yearOfEstablishmint"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.yearOfEstablishmint}
                        />
                        {formValidation.errors.yearOfEstablishmint &&
                        formValidation.touched.yearOfEstablishmint ? (
                          <small className="text-danger">
                            {formValidation.errors.yearOfEstablishmint}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">
                          Yearly Sales Income
                        </label>
                        <select
                          className="form-select form-control input-style"
                          onChange={formValidation.handleChange}
                          id="yearlySalesIncome"
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.yearlySalesIncome}
                        >
                          <option value=" ">Select Yearly Sales Income</option>
                          <option value="less than USD 1M ">
                            Less Than USD 1M
                          </option>
                          <option value="USD 1M-5M">USD 1M-5M</option>
                          <option value="USD 5M-10M">USD 5M-10M</option>
                          <option value="USD 10M-50M">USD 10M-50M</option>
                          <option value="USD 50M-100M">USD 50M-100M</option>
                          <option value="USD 100M-500M">USD 100M-500M</option>
                          <option value="USD 500M-1B">USD 500M-1B</option>
                          <option value="More than 1B USD">
                            More Than 1M USD
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">
                          Number of employees
                        </label>

                        <select
                          className="form-select form-control input-style"
                          onChange={formValidation.handleChange}
                          id="numberOfEmployees"
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.numberOfEmployees}
                        >
                          <option value="">Select Number of employees</option>

                          <option value="1-10">1-10 Employess</option>
                          <option value="11-50 ">11-50 Employess</option>
                          <option value="51 - 100">51 - 100 Employess</option>
                          <option value="101 - 500">101 - 500 Employess</option>
                          <option value="501-1000">501-1000 Employess</option>
                          <option value="More than 1000">
                            More than 1000 Employess
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">Address</label>
                        <input
                          type="text"
                          className="form-control input-style"
                          id="address"
                          placeholder="Enter Address"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.address}
                        />
                        {formValidation.errors.address &&
                        formValidation.touched.address ? (
                          <small className="text-danger">
                            {formValidation.errors.address}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    {/* <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">Address Link</label>
                        <input
                          type="link"
                          className="form-control input-style"
                          id="addressLink"
                          placeholder="Enter address Link"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.addressLink}
                        />
                        {formValidation.errors.addressLink &&
                        formValidation.touched.addressLink ? (
                          <small className="text-danger">
                            {formValidation.errors.addressLink}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div> */}

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
                        navigate(`/CompanyDetails/MircoSiteDocs`);
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

export default CompanyRegistrationPhase2;
