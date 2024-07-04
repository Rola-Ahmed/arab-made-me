import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "config.js";

import { useFormik } from "formik";
import * as Yup from "yup";

import Footer from "components/main/Footer/Footer";
import Header from "components/main/Header/Header";
import Navbar from "components/main/Navbar/Navbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { GlobalMsgContext } from "Context/globalMessage";
import FactoryInfo from "../Shared/FactoryInfo";
import CurrentAcccountInfo from "../Shared/CurrentAcccountInfo";

function RequestVisit() {
  let navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState();

  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const factoryName = searchParams.get("factoryName");

  let [factoryDetails, setFactoryDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  let { isLogin } = useContext(UserToken);
  let { setGlobalMsg } = useContext(GlobalMsgContext);
  if (factoryId == null) {
    localStorage.setItem("ToHomePage", "Page Not Found");

    navigate("/");
  }

  async function fetchFactoryData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/${factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.factories);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  useEffect(() => {
    fetchFactoryData();
  }, [factoryId]);

  // ------------------------Form Validation

  let validationSchema = Yup.object().shape({
    visitDate: Yup.string().required("Input field is Required"),
    visitPurpose: Yup.string()
    .max(255, "max legnth is 255"),
  });
  let initialValues = {
    factoryId: factoryId,

    visitDate: "",
    visitPurpose: "",
    visitType: "offline",
  };

  // if i used this or no it will work

  useEffect(() => {
    if (factoryId.length !== 0) {
      formValidation.setValues(initialValues);
    }
  }, [factoryId]);

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
    setIsLoading(true);

    let data = {
      purpose: values.visitPurpose,
      date: values.visitDate,
      factoryId: values.factoryId,
    };
    try {
      let config = {
        method: "post",
        url: `${baseUrl}/visits/add`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setIsLoading(true);

        setGlobalMsg("Your Factory visit Form has been successfully submitted");
        navigate(-1);
        // }
      } else {
        setIsLoading(false);

        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response?.data?.message,
        }));
        window.scrollTo({ top: 937.5999755859375 });
      }
    } catch (error) {
      setIsLoading(false);

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
              response: error?.response?.data?.errorMessage,
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
            window.scrollTo({ top: 937.5999755859375 });

            break;
          default:
            window.scrollTo({ top: 937.5999755859375 });

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

      window.scrollTo({ top: 937.5999755859375 });
    }
  }

  return (
    <>
      <Navbar />

      <Header title="Request A visit" subTitle="Request A visit" />
      <form onSubmit={formValidation.handleSubmit}>
        <section className="req-visit">
          <div className="container container-req ">
            <FactoryInfo productDetails={factoryDetails} />
          </div>

          <div className="container container-req ">
            <CurrentAcccountInfo />
          </div>

          <div className="container container-req ">
            <div className="input-content ">
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}

              <div className="row row-container w-100 ">
                {/* Factory description */}
                <div className="container container-po ">
                  <div className="input-content ">
                    <div className="title-text w-100 ">
                      <h5>Visit Details</h5>
                    </div>
                    <div className="row row-container w-100 ">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                          <div class="form-check w-100 d-blcok ">
                            <input
                              class="form-check-input"
                              type="radio"
                              id="visitType"
                              name="visitType"
                              value="offline"
                              defaultChecked
                              onChange={formValidation.handleChange}
                              onBlur={formValidation.handleBlur}
                            />
                            <label class="form-check-label">
                              Visit Factory
                            </label>
                          </div>
                          <div class="form-check w-100 d-blcok ">
                            <input
                              class="form-check-input"
                              type="radio"
                              id="visitType"
                              name="visitType"
                              onChange={formValidation.handleChange}
                              onBlur={formValidation.handleBlur}
                              value="online"
                            />
                            <label class="form-check-label">
                              Online Meeting
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label> date *</label>
                          <input
                            type="datetime-local"
                            className="form-control d-block"
                            placeholder="visit"
                            onChange={formValidation.handleChange}
                            onBlur={formValidation.handleBlur}
                            value={formValidation.values.visitDate}
                            id="visitDate"
                            name="visitDate"
                          />
                          {formValidation.errors.visitDate &&
                          formValidation.touched.visitDate ? (
                            <small className="form-text text-danger">
                              {formValidation.errors.visitDate}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      {formValidation.values.visitType == "offline" && (
                        <div className="col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Type Of Visit</label>
                            <input
                              className="form-control d-block"
                              onChange={formValidation.handleChange}
                              onBlur={formValidation.handleBlur}
                              // value={formValidation.values.visitDate}
                              // id="visitDate"
                              // name="visitDate"
                            />
                            {/* {formValidation.errors.visitDate &&
                          formValidation.touched.visitDate ? (
                            <small className="form-text text-danger">
                              {formValidation.errors.visitDate}
                            </small>
                          ) : (
                            ""
                          )} */}
                          </div>
                        </div>
                      )}
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>The number of individuals accompanying</label>
                          <input
                            className="form-control d-block"
                            onChange={formValidation.handleChange}
                            onBlur={formValidation.handleBlur}
                            // value={formValidation.values.visitDate}
                            // id="visitDate"
                            // name="visitDate"
                          />
                          {/* {formValidation.errors.visitDate &&
                          formValidation.touched.visitDate ? (
                            <small className="form-text text-danger">
                              {formValidation.errors.visitDate}
                            </small>
                          ) : (
                            ""
                          )} */}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label>Required Products</label>
                          <textarea
                            type="text"
                            className="form-control"
                            id="visitPurpose"
                            name="visitPurpose"
                            onChange={formValidation.handleChange}
                            onBlur={formValidation.handleBlur}
                            value={formValidation.values.visitPurpose}
                          />
                          {formValidation.errors.visitPurpose &&
                          formValidation.touched.visitPurpose ? (
                            <small className="form-text text-danger">
                              {formValidation.errors.visitPurpose}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      {formValidation.values.visitType == "offline" && (
                        <div className="col-12">
                          <div className="form-group">
                            <label>Visit Reason</label>
                            <textarea
                              type="text"
                              className="form-control"
                              id="visitPurpose"
                              name="visitPurpose"
                              onChange={formValidation.handleChange}
                              onBlur={formValidation.handleBlur}
                              value={formValidation.values.visitPurpose}
                            />
                            {formValidation.errors.visitPurpose &&
                            formValidation.touched.visitPurpose ? (
                              <small className="form-text text-danger">
                                {formValidation.errors.visitPurpose}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="row row-container w-100  ">
                      <div className="col-12 action ">
                        {isLoading ? (
                          <button
                            type="button"
                            className="action-btn btn-1 w-100 "
                          >
                            <i className="fas fa-spinner fa-spin"></i>
                          </button>
                        ) : (
                          <button
                            className="action-btn btn-1 w-100"
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
                            Send
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*  */}
            </div>
          </div>
        </section>
      </form>
      <Footer />
    </>
  );
}

export default RequestVisit;
