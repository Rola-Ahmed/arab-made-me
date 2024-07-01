import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "config.js";

import Header from "components/main/Header/Header";
import { useNavigate } from "react-router-dom";

import "./ResetPassword.css";

function ResetPassword() {
  let revoceryToken = localStorage.getItem("recoverEmailAction");

  document.title = "Reset Password";

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form Validation
  let validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Input Field is Required")
      .min(6, "min legnth is 6")
      .max(255, "max legnth is 255"),

    confirmPassword: Yup.string()
      .required("Input Field is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  let formValidation = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    setErrorMsg("");
    try {
      setIsLoading(true);

      let data = {
        password: values.password,
      };

      let config = {
        method: "patch",
        url: `${baseUrl}/users/resetPassword/${revoceryToken}`,

        data: data,
      };

      const response = await axios.request(config);
      setErrorMsg("");
      setIsLoading(false);

      if (response?.data?.message === "done") {
        // if (response?.data?.user?.factoryId !== null) {
        localStorage.setItem("RecoverAccMsg", true);
        localStorage.removeItem("recoverEmailAction");

        navigate(`/recover/account/`, {
          state: {
            title: "Password changed!",
            message: `Your password has been successfully changed. `,
            //   buttonName:`Login`,
            icon: `fa-solid fa-check recvoerAcc-icon checked-success`,
            //   actionBtn:{localStorage.setItem("ToSignIn"),
            //   navigate("/signIn")}

            actionBtn: {
              name: "Login", // Button text
              navigate: "/signIn",
              setlocalStorage: "ToSignIn",
            },
          },
        });
        // }
      } else {
        setErrorMsg(response?.data?.message);
      }
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            setErrorMsg(error?.response?.data?.errorMessage);
            break;
          case 401:
            setErrorMsg("User is not Unauthorized ");
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
      } else {
        setErrorMsg("An unexpected error occurred. Please try again later.");
      }

      if (error.message === "Network Error") {
        setErrorMsg("Something Went Wrong Please Try Again");
      } else if (error.message === "error") {
        setErrorMsg(error?.response?.data?.errorMessage);
      }
    }
    setIsLoading(false);
  }

  let [toggleSeePassword, settoggleSeePassword] = useState({
    confirmPassword: false,
    password: false,
  });

  return (
    <>
      <Header title="Reset Password" subTitle="Reset Password" />
      <section className="login">
        <div className="container d-flex justify-content-center align-content-center">
          <div className="frame-container-1">
            <div className="container content-1">
              <div className="sub-content">
                {/* <div className="title-text ">
                  <p>Login</p>
                </div> */}
                <div className="title-text ">
                  <p>Change your password by entering a new one below.</p>
                </div>
                <form
                  onSubmit={formValidation.handleSubmit}
                  autoComplete="off"
                  className="w-100"
                >
                  <div className="input-content">
                    {errorMsg ? (
                      <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                        {errorMsg}{" "}
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="form-1 row">
                      <div className="col-12">
                        <div className="form-group">
                          <label forHtml="password">
                            new password <span className="text-danger">*</span>
                          </label>

                          <div className="input-group">
                            <input
                              type={`${
                                toggleSeePassword.password == true
                                  ? "text"
                                  : "password"
                              }`}
                              className="form-control remove-left-border"
                              id="password"
                              name="password"
                              // placeholder="Enter Password"
                              onChange={formValidation.handleChange}
                              value={formValidation.values.password}
                              onBlur={formValidation.handleBlur}
                              autoComplete="new-password"
                            />
                            <div
                              class="input-group-append h-100 cursor"
                              onClick={() =>
                                settoggleSeePassword((prevData) => ({
                                  ...prevData,
                                  password: !toggleSeePassword.password,
                                }))
                              }
                            >
                              <span
                                class={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
                                  toggleSeePassword.password == true
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

                      <div className="col-12">
                        <div className="form-group">
                          <label forHtml="confirmPassword">
                            {" "}
                            Confirm new password{" "}
                            <span className="text-danger">*</span>
                          </label>

                          <div className="input-group">
                            <input
                              type={`${
                                toggleSeePassword.confirmPassword == true
                                  ? "text"
                                  : "password"
                              }`}
                              className="form-control remove-left-border"
                              id="confirmPassword"
                              name="confirmPassword"
                              onChange={formValidation.handleChange}
                              value={formValidation.values.confirmPassword}
                              onBlur={formValidation.handleBlur}
                              autoComplete="new-password"
                            />
                            <div
                              class="input-group-append h-100 cursor"
                              onClick={() =>
                                settoggleSeePassword((prevData) => ({
                                  ...prevData,
                                  confirmPassword:
                                    !toggleSeePassword.confirmPassword,
                                }))
                              }
                            >
                              <span
                                class={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
                                  toggleSeePassword.confirmPassword == true
                                    ? "fa-solid fa-eye-slash"
                                    : "fa-solid fa-eye"
                                }`}
                              ></span>
                            </div>
                          </div>
                          {formValidation.errors.confirmPassword &&
                          formValidation.touched.confirmPassword ? (
                            <small className="form-text  text-danger">
                              {formValidation.errors.confirmPassword}
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
                            <i className="fas fa-spinner fa-spin"></i>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="action-btn btn-1 w-100 submitButton"
                            disabled={
                              !(formValidation.isValid && formValidation.dirty)
                            }
                          >
                            Confirm
                          </button>
                        )}
                      </div>

                      {/* <div className="col-12">
                        <button className="action-btn btn-2 w-100 ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_464_619)">
                              <path
                                d="M23.7663 12.2765C23.7663 11.4608 23.7001 10.6406 23.559 9.83813H12.2402V14.4591H18.722C18.453 15.9495 17.5888 17.2679 16.3233 18.1056V21.104H20.1903C22.4611 19.014 23.7663 15.9274 23.7663 12.2765Z"
                                fill="#4285F4"
                              />
                              <path
                                d="M12.2391 24.0008C15.4756 24.0008 18.205 22.9382 20.1936 21.1039L16.3266 18.1055C15.2507 18.8375 13.8618 19.252 12.2435 19.252C9.11291 19.252 6.45849 17.1399 5.50607 14.3003H1.51562V17.3912C3.55274 21.4434 7.70192 24.0008 12.2391 24.0008Z"
                                fill="#34A853"
                              />
                              <path
                                d="M5.50277 14.3002C5.00011 12.8099 5.00011 11.196 5.50277 9.70569V6.61475H1.51674C-0.185266 10.0055 -0.185266 14.0004 1.51674 17.3912L5.50277 14.3002Z"
                                fill="#FBBC04"
                              />
                              <path
                                d="M12.2391 4.74966C13.9499 4.7232 15.6034 5.36697 16.8425 6.54867L20.2685 3.12262C18.0991 1.0855 15.2198 -0.034466 12.2391 0.000808666C7.70192 0.000808666 3.55274 2.55822 1.51562 6.61481L5.50166 9.70575C6.44967 6.86173 9.1085 4.74966 12.2391 4.74966Z"
                                fill="#EA4335"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_464_619">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          Login with Google
                        </button>
                      </div> */}
                    </div>

                    <div className="signUp-container">
                      <p className="text">Don't have an account?</p>
                      <button
                        onClick={() => {
                          navigate("/signup");
                        }}
                      >
                        {" "}
                        Create New
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

export default ResetPassword;
