import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "components/main/Header/Header";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "Services/UserAuth";

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
    setIsLoading(true);

    let data = {
      password: values.password,
    };

    let result = await resetPassword(revoceryToken, data);

    if (result?.success) {
      localStorage.setItem("RecoverAccMsg", true);
      localStorage.removeItem("recoverEmailAction");

      navigate(`/recover/account/`, {
        state: {
          title: "Password changed!",
          message: `Your password has been successfully changed. `,
          icon: `fa-solid fa-check recvoerAcc-icon checked-success`,
          actionBtn: {
            name: "Login", // Button text
            navigate: "/signIn",
            setlocalStorage: "ToSignIn",
          },
        },
      });
      // }
    } else {
      setErrorMsg(result?.error);
    }

    setIsLoading(false);
  }

  let [toggleSeePassword, settoggleSeePassword] = useState({
    confirmPassword: false,
    password: false,
  });

  return (
    <>
      <Header title="Reset Password" />
      <section className="login">
        <div className="container d-flex justify-content-center align-content-center">
          <div className="frame-container-1">
            <div className="container content-1">
              <div className="sub-content">
                <div className="title-text ">
                  <p>Change your password by entering a new one below.</p>
                </div>
                <form
                  onSubmit={formValidation.handleSubmit}
                  autoComplete="off"
                  className="w-100"
                >
                  <div className="input-content">
                    {errorMsg **
                    (
                      <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                        {errorMsg}
                      </div>
                    )}
                    <div className="gap-20 row">
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
                              onChange={formValidation.handleChange}
                              value={formValidation.values.password}
                              onBlur={formValidation.handleBlur}
                              autoComplete="new-password"
                            />
                            <div
                              className="input-group-append h-100 cursor"
                              onClick={() =>
                                settoggleSeePassword((prevData) => ({
                                  ...prevData,
                                  password: !toggleSeePassword.password,
                                }))
                              }
                            >
                              <span
                                className={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
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
                            Confirm new password
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
                              className="input-group-append h-100 cursor"
                              onClick={() =>
                                settoggleSeePassword((prevData) => ({
                                  ...prevData,
                                  confirmPassword: !toggleSeePassword.confirmPassword,
                                }))
                              }
                            >
                              <span
                                className={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
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
