import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { baseUrl } from "config.js";

import * as Yup from "yup";
import Header from "components/main/Header/Header";
import { useNavigate } from "react-router-dom";
import { UserToken } from "Context/userToken";

import "./SignUp.css";
export default function SignUp() {
  let { setIsLogin } = useContext(UserToken);

  document.title = "Sign Up";

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let [toggleSeePassword, settoggleSeePassword] = useState(false);

  let validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Input Field is Required")
      .min(5, "min length is 5")
      .max(255, "max length is 255"),
    password: Yup.string()
      .required("Input Field is Required")
      .min(6, "min legnth is 6")
      .max(255, "max legnth is 255"),
  });

  let formValidation = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: submitForm,
  });
  async function submitForm(values) {
    setErrorMsg("");
    try {
      setIsLoading(true);

      let data = {
        email: values.email,
        password: values.password,
      };

      let config = {
        method: "post",
        url: `${baseUrl}/users/signup`,

        data: data,
      };

      const response = await axios.request(config);
      setErrorMsg("");
      setIsLoading(false);

      if (response?.data?.message === "done") {
        setIsLogin(response?.data?.token);

        navigate(`/userType`);
      } else {
        setErrorMsg(response?.data?.message);
        window.scrollTo({ top: 0 });
      }

      // if (redirectTo === null || redirectTo === undefined) {
      //   navigate(`/`);
      // } else {
      //   navigate(`/${redirectTo}`);
      // }
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
            // setErrorMsg(error?.response?.data?.errorMessage);;
            setErrorMsg(error?.response?.data?.errorMessage);

            break;
          case 401:
            setErrorMsg(error?.response?.data?.message);
            break;
          case 403:
            setErrorMsg(
              "Forbidden, You do not have permission to access this resource."
            );
            break;
          case 404:
            setErrorMsg(
              "Not Found (404). The requested resource was not found."
            );
            break;

          case 500:
            // status 500 // message error // errorMessage =>display the missig inputs
            // setErrorMsg("Internal Server Error  Please try again later.");
            setErrorMsg(error?.response?.data?.errorMessage);

            break;

          //  429 Too Many Requests
          // The user has sent too many requests in a given amount of time ("rate limiting").
          case 429:
            setErrorMsg(" Too Many Requests , Please try again later.");
            break;
          case 402:
            // 402
            setErrorMsg(error?.response?.data?.message);
            break;
          default:
            // case message== error
            setErrorMsg(error?.response?.data?.errorMessage);
            break;
        }
      }

      if (error.message === "Network Error") {
        setErrorMsg("Something Went Wrong Please Try Again");
      } else if (error.message === "error") {
        setErrorMsg(error?.response?.data?.errorMessage);
      }
      window.scrollTo({ top: 0 });
    }
    setIsLoading(false);
  }
  return (
    <>
      <Header title="Create Account" subTitle="Sign Up" />

      <section className="login">
        <div className="container d-flex justify-content-center align-content-center">
          <div className="frame-container-1">
            <div className="container content-1">
              <div className="sub-content">
                {/* <div className="title-text ">
                  <p>Login</p>
                </div> */}

                <form onSubmit={formValidation.handleSubmit} className="w-100">
                  <div className="input-content">
                    {errorMsg ? (
                      <div className="alert mt-3 p-2 alert-danger form-control text-dark w-100">
                        {errorMsg}{" "}
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="form-1 row">
                      <div className="col-12">
                        <div className="form-group">
                          <label forHtml="email">Email*</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Enter email"
                            onChange={formValidation.handleChange}
                            value={formValidation.values.email}
                            onBlur={formValidation.handleBlur}
                          />
                          {formValidation.errors.email &&
                          formValidation.touched.email ? (
                            <small className="form-text text-danger">
                              {formValidation.errors.email}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label forHtml="password">password*</label>

                          <div className="input-group">
                            <input
                              type={`${
                                toggleSeePassword == true ? "text" : "password"
                              }`}
                              className="form-control remove-left-border"
                              id="password"
                              name="password"
                              // placeholder="Enter Password"
                              onChange={formValidation.handleChange}
                              value={formValidation.values.password}
                              onBlur={formValidation.handleBlur}
                            />
                            <div
                              class="input-group-append h-100 cursor"
                              onClick={() =>
                                settoggleSeePassword(!toggleSeePassword)
                              }
                            >
                              <span
                                class={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
                                  toggleSeePassword == true
                                    ? "fa-solid fa-eye-slash"
                                    : "fa-solid fa-eye"
                                }`}
                              ></span>
                            </div>
                          </div>

                          {formValidation.errors.password &&
                          formValidation.touched.password ? (
                            <small className="form-text  text-danger">
                              {formValidation.errors.password}
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
                          <button
                            type="button"
                            className="action-btn btn-1 w-100"
                          >
                            <i className="fas fa-spinner fa-spin text-white"></i>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="action-btn btn-1 w-100 submitButton"
                            disabled={
                              !(formValidation.isValid && formValidation.dirty)
                            }
                          >
                            Sign Up
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="signUp-container">
                      <p className="text">Already have an account?</p>
                      <button
                        onClick={() => {
                          navigate("/signIn");
                        }}
                      >
                        {" "}
                        Sign In
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
