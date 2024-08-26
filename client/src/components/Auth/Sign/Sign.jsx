import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Sign.css";
import Header from "components/main/Header/Header";
import { useNavigate } from "react-router-dom";
import InputField from "components/Forms/Shared/InputField";
import FormVlaidtionError from "components/Forms/Shared/FormVlaidtionError";
import useSignIn from "./useSignIn";

function Sign() {
  document.title = "Sign In";

  let navigate = useNavigate();
  let { submitForm, isLoading, errorMsg } = useSignIn();

  const [toggleSeePassword, settoggleSeePassword] = useState(false);

  // Form Validation
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Input Field is Required")
      .max(255, "max legnth is 255"),
    password: Yup.string()
      .required("Input Field is Required")
      .min(6, "min legnth is 6")
      .max(255, "max legnth is 255"),
  });

  const formValidation = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: submitForm,
  });

  return (
    <>
      <Header title="Sign in" />
      <section className="py-5">
        <div className="container d-flex justify-content-center align-content-center">
          <div className="cont border border-1 d-flex justify-content-center mx-auto py-5 rounded-3 w-all-50 w-xl-60 w-lg-75 w-md-100">
            {/* <div className="col-6 "> */}
            <form onSubmit={formValidation.handleSubmit} className="w-100">
              {errorMsg && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg}
                </div>
              )}
              <div className="gap-20 row">
                <div className="col-12">
                  <InputField
                    isRequired={true}
                    title={"Email"}
                    formValidation={formValidation}
                    vlaidationName={"email"}
                  />
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label>
                      password <span className="text-danger">*</span>
                    </label>

                    <div className="input-group">
                      <input
                        type={`${
                          toggleSeePassword == true ? "text" : "password"
                        }`}
                        className="form-control remove-left-border"
                        id="password"
                        name="password"
                        onChange={formValidation.handleChange}
                        value={formValidation.values.password}
                        onBlur={formValidation.handleBlur}
                      />
                      <div
                        className="input-group-append cursor"
                        onClick={() => settoggleSeePassword(!toggleSeePassword)}
                      >
                        <span
                          className={`input-group-text bg-white  h-100  icon-eye-passowrd cursor ${
                            toggleSeePassword == true
                              ? "fa-solid fa-eye-slash"
                              : "fa-solid fa-eye"
                          }`}
                        ></span>
                      </div>
                    </div>

                    <FormVlaidtionError
                      formValidation={formValidation}
                      vlaidationName={"password"}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <button
                    className=" border-0 py-0 mx-0 bg-0 small-note w-100 text-decoration-underline cursor mb-2"
                    onClick={() => {
                      navigate("/login/identify?action=forgotPassowrd");
                    }}
                  >
                    Forgot password
                  </button>

                  {isLoading ? (
                    <button
                      type="button"
                      className="btn btn-primary w-100 bg-main"
                    >
                      <i className="fas fa-spinner fa-spin"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary fs-14 px-5 mx-auto bg-main border-0 w-100"
                    >
                      Submit
                    </button>
                  )}

                  <div className="d-flex justify-content-center align-content-center mt-2 ">
                    <p className=" small-note">Don't have an account?</p>
                    <button
                      className="small-note bg-transparent border-0 text-main"
                      onClick={() => {
                        navigate("/signup");
                      }}
                    >
                      Create New
                    </button>
                  </div>
                </div>
              </div>
            </form>
            {/* </div> */}
          </div>
        </div>
      </section>
    </>
  );
}

export default Sign;
