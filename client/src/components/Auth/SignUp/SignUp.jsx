import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "components/main/Header/Header";
import { useNavigate } from "react-router-dom";
import InputField from "components/Forms/Shared/InputField";
import FormVlaidtionError from "components/Forms/Shared/FormVlaidtionError";
import useSignUp from "./useSignUp";
export default function SignUp() {
  document.title = "Sign Up";
  let navigate = useNavigate();
  let { submitForm, isLoading, errorMsg } = useSignUp();
  let [toggleSeePassword, settoggleSeePassword] = useState(false);

  let validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Input Field is Required")
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
  return (
    <>
      <Header title="Create Account" />

      <section className="login">
        <div className="container d-flex justify-content-center align-content-center">
          <div className="frame-container-1 ">
            <div className="container content-1">
              <div className="sub-content">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    formValidation.handleSubmit(e);
                  }}
                  className="w-100"
                >
                  <div className="input-content">
                    {errorMsg && (
                      <div className="alert mt-3 p-2 alert-danger form-control text-dark w-100">
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
                          <label forHtml="password">
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
                              onClick={() =>
                                settoggleSeePassword(!toggleSeePassword)
                              }
                            >
                              <span
                                className={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
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
                          <p className=" small-note">
                            Already have an account?
                          </p>
                          <button
                            className="small-note bg-transparent border-0 text-main"
                            onClick={() => {
                              navigate("/signIn");
                            }}
                          >
                            Sign in
                          </button>
                        </div>
                      </div>
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
