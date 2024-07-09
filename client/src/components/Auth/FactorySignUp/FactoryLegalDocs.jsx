import React, { useState, useContext, useEffect } from "react";
import SelectRole from "components/Auth/FactorySignUp/TimeLineHeader/SelectRole";
import UploadDocument from "components/Forms/Shared/UploadDocument";

import {
  awaitImg,
  checkedImg,
  pdfIcon,
  currentsubPoint,
} from "constants/Images";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { useFormik } from "formik";

import * as Yup from "yup";

function FactoryLegalDocs() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData, setCurrentUserData } = useContext(userDetails);
  let navigate = useNavigate();
  let currentUrl = window.location.pathname;

  useEffect(() => {
    if (!isLogin) {
      navigate(`/signIn${currentUrl}`);
    }
    if (currentUserData && currentUserData?.importerId) {
      navigate("/403");
    }
  }, [isLogin, currentUserData]);

  document.title = "Company Registration";

  const [errorMsg, setErrorMsg] = useState();

  const [isLoading, setIsLoading] = useState(false);

  // ------------------------------------------------new
  async function UploadDocs(e) {
    // e.preventDefault();

    setIsLoading(true);

    const FormData = require("form-data");
    let data = new FormData();

    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

    let config = {
      method: "put",
      url: `${baseUrl}/factories/media`,

      headers: {
        authorization: isLogin,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.message == "done") {
          setIsLoading(true);

          navigate(`/factorydashboard`);
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
        }
        setIsLoading(false);
      })
      .catch((error) => {
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
      });
    setIsLoading(false);
  }

  const [selectedDocs, setSelectedDocs] = useState([
    // {
    //   keyWord: null,
    //   pdfFile: null,
    // },
  ]);

  // ----------------------------------------------------------
  let validation = Yup.string()
    .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(8, "min length is 8")
    .max(16, "max length is 16");
  let validationSchema = Yup.object().shape({
    taxRegisterationNumber: validation,
    commercialRegisterationNumber: validation,
    IndustrialRegistrationNumber: validation,
    IndustrialLicenseNumber: validation,
  });

  let formValidation = useFormik({
    initialValues: {
      taxRegisterationNumber: "",
      commercialRegisterationNumber: "",
      IndustrialLicenseNumber: "",
      IndustrialRegistrationNumber: "",
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
        ...(values.taxRegisterationNumber && {
          taxRegisterationNumber: values.taxRegisterationNumber,
        }),
        ...(values.commercialRegisterationNumber && {
          commercialRegisterationNumber: values.commercialRegisterationNumber,
        }),
        ...(values.IndustrialLicenseNumber && {
          IndustrialLicenseNumber: values.IndustrialLicenseNumber,
        }),
        ...(values.IndustrialRegistrationNumber && {
          IndustrialRegistrationNumber: values.IndustrialRegistrationNumber,
        }),
      };

      let config = {
        method: "put",
        url: `${baseUrl}/factories/update/fromUser`,
        data: data,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);
      //   setErrorMsg("");

      if (response?.data?.message === "done") {
        if (selectedDocs?.length > 0) {
          await UploadDocs();
        } else {
          navigate(`/factorydashboard`);
        }

        setIsLoading(true);
      } else {
        setIsLoading(false);
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response?.data?.message,
        }));

        const targetElement = document.getElementById("view");
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
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
              response:
                " Too Many Requests , Please try again after 15 miuntes.",
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

        inline: "start",
      });
    }
    // }
  }

  return (
    <section id="view" className="register-msg ">
      {/* <div className="container "> */}
      <div className=" container ">
        <div className=" cont-1 d-flex justify-content-center align-items-center mx-auto  ">
          <div className=" sub-cont w-100">
            <SelectRole />

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
              <p className="text-cont text-center">Company Microsite Details</p>

              {/*  */}
            </div>

            <div className=" text-check ">
              <div className="  timeline-reg d-flex">
                <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                <div className="img-cont">
                  <img src={checkedImg} alt="" />
                </div>

                <div className="w-100 vertical-line  mt-auto mb-auto"></div>
              </div>
              <p className="text-cont text-center">Representive Information</p>
            </div>

            <div className=" text-check ">
              <div className="  timeline-reg d-flex">
                <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                <div className="img-cont me-5">
                  <img src={awaitImg} alt="" />
                </div>
              </div>
              <p className="text-cont text-end">Legal Documents</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={formValidation.handleSubmit}
          className="header w-100"
          encType="multipart/form-data"
        >
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
                    <div className="form-group gap">
                      <label className="form-title">
                        Business Registration Number
                      </label>
                      <input
                        type="text"
                        className="form-control input-style"
                        id="taxRegisterationNumber"
                        placeholder="12345678"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.taxRegisterationNumber}
                      />
                      {formValidation.errors.taxRegisterationNumber &&
                      formValidation.touched.taxRegisterationNumber ? (
                        <small className="text-danger">
                          {formValidation.errors.taxRegisterationNumber}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">
                        Industrial Registration Number
                      </label>
                      <input
                        type="text"
                        className="form-control input-style"
                        id="IndustrialRegistrationNumber"
                        placeholder="12345678"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={
                          formValidation.values.IndustrialRegistrationNumber
                        }
                      />
                      {formValidation.errors.IndustrialRegistrationNumber &&
                      formValidation.touched.IndustrialRegistrationNumber ? (
                        <small className="text-danger">
                          {formValidation.errors.IndustrialRegistrationNumber}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">
                        Industrial license number
                      </label>
                      <input
                        type="text"
                        className="form-control input-style"
                        id="IndustrialLicenseNumber"
                        placeholder="12345678"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.IndustrialLicenseNumber}
                      />
                      {formValidation.errors.IndustrialLicenseNumber &&
                      formValidation.touched.IndustrialLicenseNumber ? (
                        <small className="text-danger">
                          {formValidation.errors.IndustrialLicenseNumber}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">
                        commercial Registeration Number
                      </label>
                      <input
                        type="text"
                        className="form-control input-style"
                        placeholder="12345678"
                        id="commercialRegisterationNumber"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={
                          formValidation.values.commercialRegisterationNumber
                        }
                      />
                      {formValidation.errors.commercialRegisterationNumber &&
                      formValidation.touched.commercialRegisterationNumber ? (
                        <small className="text-danger">
                          {formValidation.errors.commercialRegisterationNumber}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  {/* factory profileeee */}
                  <UploadDocument
                    selectedDocs={selectedDocs}
                    errorMsg={errorMsg}
                    setSelectedDocs={setSelectedDocs}
                    MediaName="legalDocs"
                    mediaMaxLen="3"
                    meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
                    setErrorMsg={setErrorMsg}
                    title="Legal Documents"
                  />

                  <div className="col-12 action">
                    {isLoading ? (
                      <button type="button" className="action-btn btn-1 w-100">
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
                            if(targetElement){
                              targetElement.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                            }
                            
                          }
                        }}
                      >
                        Register
                      </button>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <small
                    className="text-muted title-small cursor"
                    onClick={() => {
                      navigate(`/factorydashboard`);
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
  );
}

export default FactoryLegalDocs;
