import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "components/main/Header/Header";
import { useNavigate, useSearchParams } from "react-router-dom";
import { forgotPassword } from "Services/UserAuth";
import InputField from "components/Forms/Shared/InputField";
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
    setIsLoading(true);

    let data = {
      email: values.email,
    };

    let result = await forgotPassword(data);

    if (result?.success) {
      localStorage.setItem("RecoverAccMsg", true);
      localStorage.setItem("recoverEmailAction", result?.data.token);
      navigate(`/recover/account/`, {
        state: {
          title: "We'll send you a code to your email address ",
          message: `Check your Email to retrieve your password , please check the email address ${values.email}. `,
          icon: "fa-solid fa-envelope recvoerAcc-icon",
        },
      });
    } else if (result?.error === "invalid email") {
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
    } else {
      setErrorMsg(result?.error);
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
                <p>
                  Enter your email and we'll send you a link to reset your
                  password.
                </p>
                <form onSubmit={formValidation.handleSubmit} className="w-100">
                  <div className="input-content">
                    {errorMsg && (
                      <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                        {errorMsg}
                      </div>
                    )}
                    <div className="gap-20 row">
                      <div className="col-12">
                        <InputField
                          formValidation={formValidation}
                          vlaidationName="email"
                          isRequired={true}
                          title="Email"
                        />
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
                          <i className="fa-solid fa-chevron-left my-auto"></i>

                          <button
                            className="small-note bg-transparent border-0 my-auto"
                            onClick={() => {
                              navigate("/signIn");
                            }}
                          >
                            Back to Login
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

export default ForgotPassword;
