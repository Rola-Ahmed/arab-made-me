import { useState, useContext, useEffect } from "react";

import { awaitImg, subPoint, currentsubPoint } from "constants/Images";
import LastPointStatus from "components/Auth/FactorySignUp/TimeLineHeader/LastPointStatus";
import SelectRole from "components/Auth/FactorySignUp/TimeLineHeader/SelectRole";
import NextPoint from "components/Auth/FactorySignUp/TimeLineHeader/NextPoint";
import { updateFactoryFromUser } from "Services/factory";

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import * as Yup from "yup";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

function CompanyRegistrationPhase2() {
  let { isLogin } = useContext(UserToken);

  let { currentUserData, setCurrentUserData } = useContext(userDetails);
  let navigate = useNavigate();

  document.title = "Company Registration";
  let currentUrl = window.location.pathname;
  useEffect(() => {
    if (!isLogin) {
      navigate(`/signIn/${currentUrl}`);
    }
    if (currentUserData && currentUserData?.importerId) {
      navigate("/403");
    }
  }, [isLogin, currentUserData]);

  const [errorMsg, setErrorMsg] = useState();

  const [isLoading, setIsLoading] = useState(false);

  let validationSchema = Yup.object().shape({
    userType: Yup.string(),


    yearOfEstablishmint: Yup.string()
      // .required("Input Field is Required")
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .min(4, "min length is 4")
      .max(4, "max length is 4"),
  });

  let formValidation = useFormik({
    initialValues: {
      yearOfEstablishmint: "",
      yearlySalesIncome: "",
      numberOfEmployees: "", //select optiton
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
        // if  values.moreDetails!==null add value
        ...(values.numberOfEmployees && {
          numberOfEmployees: values.numberOfEmployees,
        }),
        ...(values.yearOfEstablishmint && {
          yearOfEstablishmint: values.yearOfEstablishmint,
        }),
        ...(values.yearlySalesIncome && {
          yearlySalesIncome: values.yearlySalesIncome,
        }),
      };

      let result = await updateFactoryFromUser(
        { authorization: isLogin },
        data
      );

      if (result?.success) {
        setCurrentUserData((prevUserData) => ({
          ...prevUserData,
          factoryId: result?.data?.factory?.id,
        }));

        navigate(`/CompanyDetails/MircoSiteDocs`);
      } else {
        setIsLoading(false);
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: result?.error,
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
                    <img src={awaitImg} alt="" />
                  </div>

                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>
                  <div className="img-cont d-flex align-items-center ">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>

                  <div className="img-cont  d-flex align-items-center">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-25 vertical-line-after  mt-auto mb-auto"></div>

                  <div className="img-cont  d-flex align-items-center">
                    <img src={subPoint} alt="" />
                  </div>
                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont text-center">
                  Company Microsite Details
                </p>
              </div>

              <NextPoint title="Representive Information" />

              <LastPointStatus title="Legal Documents" isCurrentPoint={false} />
            </div>
          </div>

          <form onSubmit={formValidation.handleSubmit} className="w-100 ">
            <div className="sec-div d-flex justify-content-center">
              <div className="frame-container-2 ">
                <div className="cont-frame-1 ">
                  {errorMsg?.response && (
                    <p className="text-sub m-auto alert  alert-danger  text-dark">
                      {errorMsg.response}
                    </p>
                  )}
                  <div className="row gap-12">
                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">
                          Year Of Establishment
                        </label>
                        <input
                          placeholder="Enter Year Of Establishment"
                          className="form-control "
                          id="yearOfEstablishmint"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.yearOfEstablishmint}
                        />
                        {formValidation.errors.yearOfEstablishmint &&
                        formValidation.touched.yearOfEstablishmint ? (
                          <small className="text-danger">
                            {formValidation.errors.yearOfEstablishmint}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">
                          Yearly Sales Income
                        </label>
                        <select
                          className="form-select form-control "
                          onChange={formValidation.handleChange}
                          id="yearlySalesIncome"
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.yearlySalesIncome}
                        >
                          <option value=" ">Select Yearly Sales Income</option>
                          <option value="less than USD 1M ">
                            Less Than USD 1M
                          </option>
                          <option value="USD 1M-5M">USD 1M-5M</option>
                          <option value="USD 5M-10M">USD 5M-10M</option>
                          <option value="USD 10M-50M">USD 10M-50M</option>
                          <option value="USD 50M-100M">USD 50M-100M</option>
                          <option value="USD 100M-500M">USD 100M-500M</option>
                          <option value="USD 500M-1B">USD 500M-1B</option>
                          <option value="More than 1B USD">
                            More Than 1M USD
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">
                          Number of employees
                        </label>

                        <select
                          className="form-select form-control "
                          onChange={formValidation.handleChange}
                          id="numberOfEmployees"
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.numberOfEmployees}
                        >
                          <option value="">Select Number of employees</option>

                          <option value="1-10">1-10 Employess</option>
                          <option value="11-50 ">11-50 Employess</option>
                          <option value="51 - 100">51 - 100 Employess</option>
                          <option value="101 - 500">101 - 500 Employess</option>
                          <option value="501-1000">501-1000 Employess</option>
                          <option value="More than 1000">
                            More than 1000 Employess
                          </option>
                        </select>
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

                              targetElement.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
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
                        navigate(`/CompanyDetails/MircoSiteDocs`);
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

export default CompanyRegistrationPhase2;
