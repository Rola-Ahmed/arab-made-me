import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "config.js";
import "./Sign.css";
import Header from "components/main/Header/Header";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { UserToken } from "Context/userToken";

function Sign() {
  document.title = "Sign In";

  let params = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);

  if (searchParams?.size !== 0) {
    const queryString = searchParams?.toString();
    params = `${params["*"]}?${queryString}`;
  }

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let { setIsLogin } = useContext(UserToken);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Input Field is Required")
      .min(5, "min length is 5")
      .max(255, "max length is 255"),
    password: Yup.string()
      .required("Input Field is Required")
      .min(6, "min length is 6")
      .max(255, "max length is 255"),
  });

  const formValidation = useFormik({
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

      const data = {
        email: values.email,
        password: values.password,
      };

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/users/signin`,
        data: data,
      };

      const response = await axios.request(config);
      setErrorMsg("");
      setIsLoading(false);

      if (response?.data?.message === "done") {
        setIsLogin(response?.data?.token);

        if (params !== null && params !== undefined && params["*"] !== "") {
          navigate(`/${params}`);
        } else if (response?.data?.user?.factoryId !== null) {
          navigate(`/factorydashboard`);
        } else if (response?.data?.user?.role === "admin") {
          navigate(`/admin/adminDashboard`);
        } else {
          navigate("/");
        }
      } else {
        setErrorMsg(response?.data?.message);
      }
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleErrors(error) {
    if (error.response) {
      const statusCode = error.response.status;
      switch (statusCode) {
        case 400:
          setErrorMsg(error?.response?.data?.message || "An unexpected error occurred. Please try again later.");
          break;
        case 401:
          setErrorMsg("User is not Unauthorized");
          break;
        case 403:
          setErrorMsg("Forbidden, You do not have permission to access this resource.");
          break;
        case 404:
          setErrorMsg("Not Found (404). The requested resource was not found.");
          break;
        case 500:
          setErrorMsg(error?.response?.data?.errorMessage);
          break;
        case 429:
          setErrorMsg("Too Many Requests. Please try again later after 15 minutes.");
          break;
        case 402:
          setErrorMsg(error?.response?.data?.message);
          break;
        default:
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

  const [toggleSeePassword, settoggleSeePassword] = useState(false);

  return (
    <>
      <Header title="Sign in" subTitle="Sign In" />
      <section className="login">
        <div className="container d-flex justify-content-center align-content-center">
          <div className="frame-container-1">
            <div className="container content-1">
              <div className="sub-content">
                <form onSubmit={formValidation.handleSubmit} className="w-100">
                  <div className="input-content">
                    {errorMsg && (
                      <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                        {errorMsg}
                      </div>
                    )}
                    <div className="form-1 row">
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="email">Email*</label>
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
                          {formValidation.errors.email && formValidation.touched.email && (
                            <small className="form-text text-danger">
                              {formValidation.errors.email}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="password">Password*</label>
                          <div className="input-group">
                            <input
                              type={toggleSeePassword ? 'text' : 'password'}
                              className="form-control remove-left-border"
                              id="password"
                              name="password"
                              onChange={formValidation.handleChange}
                              value={formValidation.values.password}
                              onBlur={formValidation.handleBlur}
                            />
                            <div
                              className="input-group-append h-100 cursor"
                              onClick={() => settoggleSeePassword(!toggleSeePassword)}
                            >
                              <span
                                className={`input-group-text bg-white h-100 icon-eye-password cursor ${
                                  toggleSeePassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                                }`}
                              ></span>
                            </div>
                          </div>
                          <small
                            className="form-text text-muted m-auto text-decoration-underline cursor"
                            onClick={() => {
                              navigate("/login/identify?action=forgotPassword");
                            }}
                          >
                            Forgot password
                          </small>
                          {formValidation.errors.password && formValidation.touched.password && (
                            <small className="form-text text-danger">
                              {formValidation.errors.password}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="action row">
                      <div className="col-12">
                        {isLoading ? (
                          <button type="button" className="action-btn btn-1 w-100">
                            <i className="fas fa-spinner fa-spin"></i>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="action-btn btn-1 w-100 submitButton"
                            disabled={!(formValidation.isValid && formValidation.dirty)}
                          >
                            Login
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="signUp-container">
                      <p className="text">Don't have an account?</p>
                      <button
                        onClick={() => {
                          navigate("/signup");
                        }}
                      >
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

export default Sign;
