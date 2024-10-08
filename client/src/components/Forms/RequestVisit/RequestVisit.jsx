import { useState, useContext, useEffect } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";

import Header from "components/main/Header/Header";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import FactoryInfo from "../Shared/FactoryInfo";
import CurrentAcccountInfo from "../Shared/CurrentAcccountInfo";
import { fetchOneFactory } from "Services/factory";
import useFormSubmission from "./hooks/useFormSubmission";
import DateTimeInput from "../Shared/DateTimeInput";
import TextareaInput from "../Shared/TextareaInput";
import RadioInput from "../Shared/RadioInput";
import ErrorToast from "components/ErrorToast";

function RequestVisit() {
  let navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState();

  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const factoryName = searchParams.get("factoryName");

  let [factoryDetails, setFactoryDetails] = useState({});
  const [isLoading, setIsLoading] = useState({
    pageLoading: true,
    errorPageLoading: null, //msg
    submitLoading: false,
  });

  let { isLogin } = useContext(UserToken);

  let { submitForm } = useFormSubmission(isLogin, setErrorMsg, setIsLoading);

  if (!factoryId) {
    ErrorToast("Page Not Found");
    navigate("/");
  }

  async function fetchFactoryData() {
    const result = await fetchOneFactory(factoryId);

    if (result?.success) {
      setFactoryDetails(result?.data?.factories);
    }

    setIsLoading((prev) => ({
      ...prev,
      pageLoading: result?.loadingStatus,
      errorPageLoading: result?.error,
    }));
  }

  useEffect(() => {
    fetchFactoryData();
  }, [factoryId]);

  // ------------------------Form Validation

  let validationSchema = Yup.object().shape({
    visitDate: Yup.string().required("Input field is Required"),
    visitType: Yup.string().required("Input field is Required"),
    requiredProducts: Yup.string().required("Input field is Required"),
    visitPurpose: Yup.string().required("Input field is Required"),
    individualsNumber: Yup.string()
      .required("Input Field is Required")
      .matches(/^[0-9]+$/, "Input Field should contain numbers only"),
  });
  let initialValues = {
    factoryId: factoryId,

    visitDate: "",
    visitPurpose: "",
    visitType: "",
    individualsNumber: "",
    requiredProducts: "",
  };

  // if i used this or no it will work

  useEffect(() => {
    if (factoryId?.length !== 0) {
      formValidation.setValues(initialValues);
    }
  }, [factoryId]);

  let formValidation = useFormik({
    initialValues,
    validationSchema,
    onSubmit: submitForm,
  });

  return (
    <>
      <Header title="Request A visit" />
      {/* <form id="view" onSubmit={formValidation.handleSubmit}> */}
      <section className="req-visit">
        <div className="container container-req ">
          <CurrentAcccountInfo />
        </div>

        <div className="container container-req ">
          <FactoryInfo productDetails={factoryDetails} />
        </div>

        <form
          id="view"
          onSubmit={formValidation.handleSubmit}
          className="container container-req "
        >
          <div className="input-content ">
            {errorMsg?.response && (
              <div className="alert mt-3 p-2 alert-danger form-control text-dark w-100">
                {errorMsg?.response}
              </div>
            )}

            <div className="input-content ">
              <div className="title-text w-100 ">
                <h5>Visit Details</h5>
              </div>
              <div className="row row-container w-100 ">
                {/* will use it in the future */}
                {/* <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check w-100 d-blcok ">
                      <RadioInput
                        formValidation={formValidation}
                        vlaidationName="visitType"
                        label="Visit Factory"
                        value="offline"
                        defaultChecked={true}
                      />
                    </div>
                    <div className="form-check w-100 d-blcok ">
                      <RadioInput
                        formValidation={formValidation}
                        vlaidationName="visitType"
                        label="Online Meeting"
                        value="online"
                        defaultChecked={false}
                      />
                    </div>
                  </div>
                </div> */}

                <div className="col-md-6 col-sm-12">
                  <DateTimeInput
                    isRequired={true}
                    title={"Visit Date"}
                    formValidation={formValidation}
                    vlaidationName={"visitDate"}
                  />
                </div>

                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label>Type Of Visit *</label>
                    <input
                      className="form-control d-block"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.visitType}
                      id="visitType"
                      name="visitType"
                    />
                    {formValidation.errors.visitType &&
                    formValidation.touched.visitType ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.visitType}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label>The number of individuals accompanying</label>
                    <input
                      className="form-control d-block"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.individualsNumber}
                      id="individualsNumber"
                      name="individualsNumber"
                    />
                    {formValidation.errors.individualsNumber &&
                    formValidation.touched.individualsNumber ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.individualsNumber}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <TextareaInput
                  vlaidationName="requiredProducts"
                  formValidation={formValidation}
                  isRequired={true}
                  title="Required Products"
                />

                <TextareaInput
                  vlaidationName="visitPurpose"
                  formValidation={formValidation}
                  isRequired={true}
                  title="visit Purpose"
                />

                <div className="col-12 action ">
                  {isLoading?.submitLoading ? (
                    <button type="button" className="action-btn btn-1 w-100 ">
                      <i className="fas fa-spinner fa-spin"></i>
                    </button>
                  ) : (
                    <button
                      className="action-btn btn-1 w-100"
                      type="submit"
                      onClick={() => {
                        if (formValidation.isValid == false) {
                          const targetElement = document.getElementById(
                            Object.keys(formValidation.errors)?.[0]
                          );

                          // Scroll to the target element
                          if (targetElement)
                            targetElement.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                        }
                      }}
                    >
                      Send
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
      {/* </form> */}
    </>
  );
}

export default RequestVisit;
