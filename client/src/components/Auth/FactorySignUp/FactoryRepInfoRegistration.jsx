import { useState, useContext, useEffect } from "react";
import "./UserType.css";
import { currentsubPoint, checkedImg } from "constants/Images";
import LastPointStatus from "components/Auth/FactorySignUp/TimeLineHeader/LastPointStatus";
import SelectRole from "components/Auth/FactorySignUp/TimeLineHeader/SelectRole";
import { updateFactoryFromUser } from "Services/factory";
import FormVlaidtionError from "components/Forms/Shared/FormVlaidtionError";

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import * as Yup from "yup";

import InputField from "components/Forms/Shared/InputField";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { countriesMiddleEast } from "constants/countries";
import CurrentPoint from "./TimeLineHeader/CurrentPoint";

function FactoryRepInfoRegistration() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData, setCurrentUserData } = useContext(userDetails);
  let currentUrl = window.location.pathname;
  let navigate = useNavigate();

  document.title = "Company RegistrationUser Type";
  useEffect(() => {
    if (!isLogin) {
      navigate(`/signIn${currentUrl}`);
    }
    if (currentUserData && currentUserData?.importerId) {
      navigate("/403");
    }
  }, [isLogin, currentUserData]);
  const [errorMsg, setErrorMsg] = useState();

  const [isLoading, setIsLoading] = useState(false);

  let validationSchema = Yup.object().shape({
    repName: Yup.string()
      .max(50, "max length is 50")
      .required("Input field is Required"),
    repLastName: Yup.string()
      .max(50, "max length is 50")
      .required("Input field is Required"),

    repEmail: Yup.string()
      .email("Invalid email")
      .required("Input Field is Required")
      .max(255, "max length is 255"),

    repPhone: Yup.string()
      .required("Input Field is Required")
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .min(6, "min length is 6")
      .max(15, "max length is 15"),
  });

  let formValidation = useFormik({
    initialValues: {
      repName: "",
      repLastName: "",
      factoryName: "",

      repEmail: "",

      repPhone: "",
      repPhoneCode: countriesMiddleEast?.[0].phoneCode,

      allowEmailNotification: "false",
    },
    validationSchema,
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    setIsLoading(true);
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    try {
      let data = {
        repEmail: values.repEmail,
        allowEmailNotification: values.allowEmailNotification,
        repName: [values.repName, values.repLastName],

        repPhone: `${values.repPhoneCode}${values.repPhone}`,
      };

      let result = await updateFactoryFromUser(
        { authorization: isLogin },
        data
      );

      if (result?.success) {
        setCurrentUserData((prevUserData) => ({
          ...prevUserData,
          factoryId: result?.data?.factory?.id,
          continueProfilePath: "CompanyDetails/LegalDocuments",
        }));
        navigate(`/CompanyDetails/LegalDocuments`);
      } else {
        setIsLoading(false);

        let error = "";
        if (result?.error == "Validation error") {
          error = "This email is already in use. Please use a different email.";
        } else {
          error = result?.error;
        }
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: error,
        }));

        const targetElement = document.getElementById("view");
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    } catch (error) {}
    // }
  }

  return (
    <>
      <section id="view" className="register-msg ">
        <div className=" container ">
          <div className=" cont-1 d-flex justify-content-center align-items-center mx-auto  ">
            <div className=" sub-cont w-100">
              <SelectRole />

              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line mt-auto mb-auto"></div>
                  <div className="img-cont">
                    <img src={checkedImg} alt="" />
                  </div>

                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>
                  <div className="img-cont d-flex align-items-center ">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>

                  <div className="img-cont  d-flex align-items-center">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>

                  <div className="img-cont  d-flex align-items-center">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont text-center">
                  Company Microsite Details
                </p>
              </div>

              <CurrentPoint title="Representive Information" />

              <LastPointStatus title="Legal Documents" isCurrentPoint={false} />
            </div>
          </div>

          <form onSubmit={formValidation.handleSubmit} className="w-100 ">
            <div className="sec-div d-flex justify-content-center">
              <div className="frame-container-2 ">
                <div className="cont-frame-1 ">
                  {errorMsg?.response && (
                    <p className="text-sub m-auto alert  alert-danger  text-dark w-100">
                      {errorMsg.response}
                    </p>
                  )}

                  <div className="row gap-12">
                    <div className="col-12">
                      <InputField
                        isRequired={true}
                        title={"Representive first Name"}
                        formValidation={formValidation}
                        vlaidationName={"repName"}
                      />
                    </div>

                    <div className="col-12">
                      <InputField
                        isRequired={true}
                        title={"Representive last Name"}
                        formValidation={formValidation}
                        vlaidationName={"repLastName"}
                      />
                    </div>

                    <div className="col-12">
                      <InputField
                        isRequired={true}
                        title={"Representive Email"}
                        formValidation={formValidation}
                        vlaidationName={"repEmail"}
                      />
                    </div>

                    {/* ----------------------- */}
                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group gap">
                          <label className="form-title">
                            Representive Phone Number
                            <span className="text-danger"> * </span>
                          </label>
                          <div className="input-group  h-100">
                            <div className="input-group-prepend">
                              <select
                                className="input-group-text h-100 p-2 m-0 phone-borders"
                                id="repPhoneCode"
                                name="repPhoneCode"
                                placeholder="1113534343"
                                onChange={formValidation.handleChange}
                                value={formValidation.values.repPhoneCode}
                                onBlur={formValidation.handleBlur}
                              >
                                {/* <select className="input-group-text h-100  m-0" name="" id=""> */}

                                {countriesMiddleEast.map((phoneItem) => (
                                  <option value={phoneItem.phoneCode}>
                                    {phoneItem.phoneCode}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <input
                              type="text"
                              className="form-control  phone-border"
                              id="repPhone"
                              name="repPhone"
                              placeholder="1113534343"
                              onChange={formValidation.handleChange}
                              value={formValidation.values.repPhone}
                              onBlur={formValidation.handleBlur}
                            />
                          </div>
                          <FormVlaidtionError
                            formValidation={formValidation}
                            vlaidationName={"repPhone"}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group m-0 p-0">
                        <label>Allow Email Notifications</label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input switch-input cursor form-select form-control"
                          type="checkbox"
                          id="allowEmailNotification"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.allowEmailNotification}
                        />
                      </div>
                    </div>

                    <div className="col-12 action">
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
                          onClick={() => {
                            if (formValidation.isValid == false) {
                              const targetElement = document.getElementById(
                                Object.keys(formValidation.errors)?.[0]
                              );

                              // Scroll to the target element
                              if (targetElement) {
                                targetElement.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                              }
                            }
                          }}
                        >
                          Countinue
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-center">
                    <small
                      className="text-muted title-small cursor"
                      onClick={() => {
                        navigate(`/CompanyDetails/LegalDocuments`);
                      }}
                    >
                      Skip
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default FactoryRepInfoRegistration;
