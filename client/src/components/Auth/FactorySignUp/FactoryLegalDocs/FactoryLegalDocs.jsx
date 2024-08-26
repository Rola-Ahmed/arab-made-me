import { useState, useContext, useEffect } from "react";
import SelectRole from "components/Auth/FactorySignUp/TimeLineHeader/SelectRole";
import UploadDocument from "components/Forms/Shared/UploadDocument";
import useFormSubmission from "./useFormSubmission";

import { awaitImg, checkedImg, currentsubPoint } from "constants/Images";

import { useNavigate } from "react-router-dom";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { useFormik } from "formik";

import * as Yup from "yup";

function FactoryLegalDocs() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData, setCurrentUserData } = useContext(userDetails);
  let navigate = useNavigate();
  let currentUrl = window.location.pathname;
  document.title = "Company Registration";

  const updateCurrentUser = () => {
    setCurrentUserData((prevUserData) => ({
      ...prevUserData,
      continueProfilePath: null,
    }));
  };

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

  const [selectedDocs, setSelectedDocs] = useState([]);

  let { submitForm, requestAddedText, submitDocs } = useFormSubmission(
    isLogin,
    setErrorMsg,
    setIsLoading,
    updateCurrentUser
  );
  // ----------------------------------------------------------
  let validation = Yup.string()
    .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(8, "min length is 8")
    .max(16, "max length is 16")
    .required("Input field is Required");
  let validationSchema = Yup.object().shape({
    taxRegisterationNumber: validation,
    commercialRegisterationNumber: validation,
    IndustrialRegistrationNumber: validation,
    IndustrialLicenseNumber: validation,
  });

  let formValidation = useFormik({
    initialValues: {
      taxRegisterationNumber: "",
      commercialRegisterationNumber: "",
      IndustrialLicenseNumber: "",
      IndustrialRegistrationNumber: "",
    },
    validationSchema,
    onSubmit: submit,
  });

  function submit(values) {
    // if data is not added yet
    if (!requestAddedText) {
      submitForm(values, selectedDocs);
    }
    // if textApi is added and selectedDocs is greater that 0
    // call media
    // this case means that error ouccured in meidaApi so i need only to call media api
    // else
    // if (privateLabelAdded.status && selectedDocs?.length > 0) {
    else if (selectedDocs?.length > 0) {
      submitDocs(selectedDocs);
    } else {
      updateCurrentUser();
      navigate(`/factorydashboard`);
    }
  }
  return (
    <section id="view" className="register-msg ">
      {/* <div className="container "> */}
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
              <p className="text-cont text-center">Company Microsite Details</p>

              {/*  */}
            </div>

            <div className=" text-check ">
              <div className="  timeline-reg d-flex">
                <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                <div className="img-cont">
                  <img src={checkedImg} alt="" />
                </div>

                <div className="w-100 vertical-line  mt-auto mb-auto"></div>
              </div>
              <p className="text-cont text-center">Representive Information</p>
            </div>

            <div className=" text-check ">
              <div className="  timeline-reg d-flex">
                <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                <div className="img-cont me-5">
                  <img src={awaitImg} alt="" />
                </div>
              </div>
              <p className="text-cont text-end">Legal Documents</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={formValidation.handleSubmit}
          className="header w-100"
          encType="multipart/form-data"
        >
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
                    <div className="form-group gap">
                      <label className="form-title">
                        Business Registration Number *
                      </label>
                      <input
                        type="text"
                        className="form-control "
                        id="taxRegisterationNumber"
                        placeholder="12345678"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.taxRegisterationNumber}
                      />
                      {formValidation.errors.taxRegisterationNumber &&
                      formValidation.touched.taxRegisterationNumber ? (
                        <small className="text-danger">
                          {formValidation.errors.taxRegisterationNumber}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">
                        Industrial Registration Number *
                      </label>
                      <input
                        type="text"
                        className="form-control "
                        id="IndustrialRegistrationNumber"
                        placeholder="12345678"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={
                          formValidation.values.IndustrialRegistrationNumber
                        }
                      />
                      {formValidation.errors.IndustrialRegistrationNumber &&
                      formValidation.touched.IndustrialRegistrationNumber ? (
                        <small className="text-danger">
                          {formValidation.errors.IndustrialRegistrationNumber}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">
                        Industrial license number *
                      </label>
                      <input
                        type="text"
                        className="form-control "
                        id="IndustrialLicenseNumber"
                        placeholder="12345678"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.IndustrialLicenseNumber}
                      />
                      {formValidation.errors.IndustrialLicenseNumber &&
                      formValidation.touched.IndustrialLicenseNumber ? (
                        <small className="text-danger">
                          {formValidation.errors.IndustrialLicenseNumber}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">
                        commercial Registeration Number *
                      </label>
                      <input
                        type="text"
                        className="form-control "
                        placeholder="12345678"
                        id="commercialRegisterationNumber"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={
                          formValidation.values.commercialRegisterationNumber
                        }
                      />
                      {formValidation.errors.commercialRegisterationNumber &&
                      formValidation.touched.commercialRegisterationNumber ? (
                        <small className="text-danger">
                          {formValidation.errors.commercialRegisterationNumber}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  {/* factory profileeee */}
                  <UploadDocument
                    selectedDocs={selectedDocs}
                    errorMsg={errorMsg}
                    setSelectedDocs={setSelectedDocs}
                    MediaName="legalDocs"
                    mediaMaxLen="3"
                    meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
                    setErrorMsg={setErrorMsg}
                    // title={`Legal Documents ${<i className="fa-solid fa-circle-info"></i>}`}
                    title={
                      <>
                        <div className="d-flex d-flex gap-2">
                          Legal Documents *
                          <div className="tooltip-1">
                            <i className="fa-solid fa-circle-info my-auto "></i>
                            <span className="tooltiptext-1 w-50">
                              Upload your Business Registration Number,
                              Industrial Registration Number, Industrial License
                              Number, and Commercial Registration Number
                              documents.
                            </span>
                          </div>
                        </div>
                      </>
                    }
                  />

                  <div className="col-12 action">
                    {isLoading?.submitLoading ? (
                      <button type="button" className="action-btn btn-1 w-100">
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
                        Register
                      </button>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <small
                    className="text-muted title-small cursor"
                    onClick={() => {
                      navigate(`/factorydashboard`);
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
  );
}

export default FactoryLegalDocs;
