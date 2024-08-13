import { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "config.js";
import "./Sign.css";
import Header from "components/main/Header/Header";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { UserToken } from "Context/userToken";
import InputField from "components/Forms/Shared/InputField";
import FormVlaidtionError from "components/Forms/Shared/FormVlaidtionError";

function Sign() {
  document.title = "Sign In";

  let params = useParams();
  const location = useLocation();
  let navigate = useNavigate();
  const searchParams = new URLSearchParams(location?.search);

  // Resulting query string will be "?factoryId=3&factoryName=samsung"
  if (searchParams?.size != 0) {
    const queryString = searchParams?.toString();
    params = `${params["*"]}?${queryString}`;
  }
  // console.log("params", params, params["*"]);

  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleSeePassword, settoggleSeePassword] = useState(false);

  let { setIsLogin } = useContext(UserToken);

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

  async function submitForm(values) {
    setErrorMsg("");
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

      //1st if condition  means there is a redirect page that needs sign in first
      // the other else conditons means that its only sign in && user is directed to a specific path based on his type
      if (params !== null && params !== undefined && params["*"] != "") {
        // console.log("params if", params);
        navigate(`/${params["*"]}`);
      } else if (response?.data?.user?.factoryId !== null) {
        navigate(`/factorydashboard`);
      } else if (response?.data?.user?.role == "admin") {
        navigate(`/admin/adminDashboard`);
      } else {
        navigate("/");
      }
    } else {
      setErrorMsg(response?.data?.message);
    }

    setIsLoading(false);
  }

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
                          <label >password <span className="text-danger">*</span></label>

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
                              class="input-group-append cursor"
                              onClick={() =>
                                settoggleSeePassword(!toggleSeePassword)
                              }
                            >
                              <span
                                class={`input-group-text bg-white  h-100  icon-eye-passowrd cursor ${
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
