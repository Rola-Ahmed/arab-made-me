import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "axios";
import { baseUrl } from "config.js";

import Header from "components/main/Header/Header";
import { useNavigate, useSearchParams } from "react-router-dom";

function ForgotPassword() {
  document.title = "Forgot Password";

  const [searchParams] = useSearchParams();
  const emailAddress = searchParams.get("emailAddress");

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Form Validation
  let validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Input Field is Required")
      .max(255, "max legnth is 255"),
  });

  let formValidation = useFormik({
    initialValues: {
      email: emailAddress ?? "",
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
      };

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/users/forgetPassword`,

        // headers: {
        //   "Content-Type": "application/json",
        // },
        data: data,
      };

      const response = await axios.request(config);
      setErrorMsg("");
      setIsLoading(false);

      if (response?.data?.message === "check your email") {
        localStorage.setItem("RecoverAccMsg", true);
        localStorage.setItem("recoverEmailAction", response?.data.token);

        navigate(`/recover/account/`, {
          state: {
            title: "We'll send you a code to your email address ",
            message: `Check your Email to retrieve your password , please check the email address ${values.email}. `,
            icon: "fa-solid fa-envelope recvoerAcc-icon",
          },
        });
      } else if (response?.data?.message === "invalid email") {
        localStorage.setItem("RecoverAccMsg", true);
        navigate(`/recover/account/`, {
          state: {
            title: "We'll send you a code to your email address ",
            message: `Check your Email to retrieve your password , please check the email address ${values.email}. `,
            icon: "fa-solid fa-envelope recvoerAcc-icon",
            actionBtn: {
              name: "resend Email", // Button text
              navigate: `/login/identify?emailAddress=${values.email}`,
              setlocalStorage: "ToForgotPassword",
            },
          },
        });
        // setErrorMsg("No search results Your search did not return any results. Please try again with other information.");
      } else {
        // if (response?.data?.message === "invalid email") {
        setErrorMsg(response?.data?.message);
        // }
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

  return (
    <>
      <Header title="ForgotPassword " />
      <section className="login">
        <div className="container d-flex justify-content-center align-content-center">
          <div className="frame-container-1">
            <div className="container content-1">
              <div className="sub-content">
                <div className="title-text ">
                  <p>Forgot Passowrd</p>
                </div>
                <p>
                  Enter your email and we'll send you a link to reset your
                  password.
                </p>
                <form
                  onSubmit={formValidation.handleSubmit}
                  autoComplete="off"
                  className="w-100"
                >
                  <div className="input-content">
                    {errorMsg ? (
                      <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                        {errorMsg}
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="form-1 row">
                      <div className="col-12">
                        <div className="form-group">
                          <label forHtml="email">
                            Email <span className="text-danger">*</span>
                          </label>
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
                              !formValidation.isValid
                              // && formValidation.dirty
                            }
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </div>

                    <div
                      className="signUp-container align-items-center"
                      onClick={() => {
                        navigate("/signIn");
                      }}
                    >
                      <i class="fa-solid fa-chevron-left"></i>
                      <p className="text">Back to Login</p>
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

export default ForgotPassword;
