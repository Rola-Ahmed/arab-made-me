import React, { useState, useContext, useEffect } from "react";

import {
  awaitImg,
  nextImg,
  currentsubPoint,
  checkedImg,
  subPoint,
} from "constants/Images";

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import * as Yup from "yup";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { countriesMiddleEast } from "constants/countries";
import "./UserType.css";

export default function CompanyRegistration() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData, setCurrentUserData } = useContext(userDetails);

  // if (currentUserData?.factoryId)

  document.title = "Company Registration";
  useEffect(() => {
    if (!isLogin) {
      navigate(`/signIn/CompanyDetails`);
    }

    // }
  }, [isLogin]);

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [allSectors, setAllSectors] = useState([]);

  let validationSchema = Yup.object().shape({
    factoryName: Yup.string()
      .min(3, "min length is 3")
      .max(50, "max length is 50")
      .required("Input field is Required"),

    // }),

    factoryPhone: Yup.string()
      // .required("Input Field is Required")
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .min(6, "min length is 6")
      .max(15, "max length is 15"),
    WhatsappPhone: Yup.string()
      // .required("Input Field is Required")
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .min(6, "min length is 6")
      .max(15, "max length is 15"),

    website: Yup.string().matches(
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}([/?#]\S*)?$/,
      "Invalid URL"
    ),

    description: Yup.string()
      .required("Input Field is Required")
      .min(10, "min legnth is 10")
      .max(255, "max legnth is 255"),
    city: Yup.string().min(3, "min length is 3").max(60, "max length is 60"),
  });

  let formValidation = useFormik({
    initialValues: {
      factoryName: "",
      factoryPhone: "",
      factoryPhoneCode: countriesMiddleEast?.[0].phoneCode,

      WhatsappPhone: "",
      WhatsappPhoneCode: countriesMiddleEast?.[0].phoneCode,

      description: "",
      // sectorId: "",
      website: "",
      country: countriesMiddleEast?.[0].code,
      city: "",
    },
    validationSchema,
    onSubmit: submitForm,
  });
  useEffect(() => {
    if (allSectors.length !== 0) {
      formValidation.setValues({
        ...formValidation.values,
        sectorId: allSectors?.[0]?.id || "",
      });
    }
  }, [allSectors]);

  async function submitForm(values) {
    setIsLoading(true);

    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    try {
      let data = {
        description: values.description,
        country: values.country,
        sectorId: values.sectorId,
        name: values.factoryName,
        socialLinks: {},
      };

      if (values.website !== "") data.website = values.website;

      if (values.city !== "") {
        data.city = values.city;
      }
      if (values.factoryPhone !== "")
        data.phone = `${values.factoryPhoneCode}${values.factoryPhone}`;
      if (values.WhatsappPhone !== "")
        data.socialLinks[
          "whatsapp"
        ] = `${values.WhatsappPhoneCode}${values.WhatsappPhone}`;

      // return (data)
      let config = {
        method: "post",
        url: `${baseUrl}/factories/add`,
        data: data,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);
      //   setErrorMsg("");
      setErrorMsg((prevErrors) => {
        const { response, ...restErrors } = prevErrors || {};
        return restErrors;
      });

      // setIsLoading(false);

      if (response?.data?.message === "done") {
        setCurrentUserData((prevUserData) => ({
          ...prevUserData,
          factoryId: response?.data?.factory?.id,
        }));

        navigate(`/CompanyDetails/setp2`);

        setIsLoading(true);
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response?.data?.message,
        }));

        const targetElement = document.getElementById("view");
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);

      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;
          case 401:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: "User is not Unauthorized ",
            }));
            break;
          case 403:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                "Forbidden, You do not have permission to access this resource.",
            }));
            break;
          case 404:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                "Not Found (404). The requested resource was not found.",
            }));
            break;

          case 500:
            if (error?.response?.data?.errorMessage == "Validation error") {
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response: "Comapny Name must be unique",
              }));
            } else {
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response: error?.response?.data?.errorMessage,
              }));
            }

            break;

          //  429 Too Many Requests
          // The user has sent too many requests in a given amount of time ("rate limiting").
          case 429:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                " Too Many Requests , Please try again after 15 miuntes.",
            }));
            break;
          case 402:
            // 402
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.message,
            }));
            break;
          default:
            // case message== error
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;
        }
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: "An unexpected error occurred. Please try again later.",
        }));
      }

      const targetElement = document.getElementById("view");
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",

        inline: "start",
      });

      // setIsLoading(false);
    }
    // }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/sectors?size=10`);

        if (response.data.message === "done") {
          setAllSectors(response.data.sectors);
        }
      } catch (error) {
        // Handle error or set loading state if needed
        // setApiLoadingData(true);
      }
    };

    fetchData(); // Call the asynchronous function
  }, []);

  return (
    <>
      <section id="view" className="register-msg ">
        <div className=" container ">
          <div className=" cont-1 d-flex justify-content-center align-items-center mx-auto  ">
            <div className=" sub-cont w-100">
              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="img-cont ms-5">
                    <img src={checkedImg} alt="" />
                  </div>

                  <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont  ">Select Your Role</p>
              </div>

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
                  <div className="w-25 vertical-line-after  mt-auto mb-auto"></div>

                  <div className="img-cont  d-flex align-items-center">
                    <img src={subPoint} alt="" />
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

                {/*  */}
              </div>

              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                  <div className="img-cont">
                    <img src={nextImg} alt="" />
                  </div>

                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont text-center">
                  Representive Information
                </p>
              </div>
              {/* <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                  <div className="img-cont">
                    <img src={nextImg} alt="" />
                  </div>

                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont text-center">
                  Company Microsite Details
                </p>
              </div> */}

              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                  <div className="img-cont me-5">
                    <img src={nextImg} alt="" />
                  </div>
                </div>
                <p className="text-cont text-end">Legal Documents</p>
              </div>
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
                  <div className="row gap-row-2">
                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group gap">
                          <label className="form-title">
                            Company Name
                            <span> * </span>
                          </label>

                          <input
                            type="text"
                            className="form-control input-style"
                            placeholder="Enter Factory Name"
                            id="factoryName"
                            onChange={formValidation.handleChange}
                            onBlur={formValidation.handleBlur}
                            value={formValidation.values.factoryName}
                          />
                          {formValidation.errors.factoryName &&
                          formValidation.touched.factoryName ? (
                            <small className="text-danger">
                              {formValidation.errors.factoryName}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group gap">
                          <label className="form-title">
                            Company Phone Number
                          </label>
                          <div className="input-group  h-100">
                            <div className="input-group-prepend">
                              <select
                                className="input-group-text h-100 p-2 m-0 phone-borders"
                                id="factoryPhoneCode"
                                name="factoryPhoneCode"
                                placeholder="1113534343"
                                onChange={formValidation.handleChange}
                                value={formValidation.values.factoryPhoneCode}
                                onBlur={formValidation.handleBlur}
                              >
                                {countriesMiddleEast.map((phoneItem) => (
                                  <option value={phoneItem.phoneCode}>
                                    {phoneItem.phoneCode}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <input
                              type="text"
                              className="form-control input-style phone-border"
                              id="factoryPhone"
                              name="factoryPhone"
                              placeholder="1113534343"
                              onChange={formValidation.handleChange}
                              value={formValidation.values.factoryPhone}
                              onBlur={formValidation.handleBlur}
                            />
                          </div>
                          {formValidation.errors.factoryPhone &&
                          formValidation.touched.factoryPhone ? (
                            <small className="form-text text-danger">
                              {formValidation.errors.factoryPhone}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group gap">
                          <label className="form-title">
                            Whatsapp Phone Number
                          </label>
                          <div className="input-group  h-100">
                            <div className="input-group-prepend">
                              <select
                                className="input-group-text h-100 p-2 m-0 phone-borders"
                                id="WhatsappPhoneCode"
                                name="WhatsappPhoneCode"
                                placeholder="1113534343"
                                onChange={formValidation.handleChange}
                                value={formValidation.values.WhatsappPhoneCode}
                                onBlur={formValidation.handleBlur}
                              >
                                {countriesMiddleEast.map((phoneItem) => (
                                  <option value={phoneItem.phoneCode}>
                                    {phoneItem.phoneCode}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <input
                              type="text"
                              className="form-control input-style phone-border"
                              id="WhatsappPhone"
                              name="WhatsappPhone"
                              placeholder="1113534343"
                              onChange={formValidation.handleChange}
                              value={formValidation.values.WhatsappPhone}
                              onBlur={formValidation.handleBlur}
                            />
                          </div>
                          {formValidation.errors.WhatsappPhone &&
                          formValidation.touched.WhatsappPhone ? (
                            <small className="form-text text-danger">
                              {formValidation.errors.WhatsappPhone}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group gap  ">
                        <label className="form-title">website</label>
                        <input
                          type="text"
                          className="form-control input-style "
                          id="website"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.website}
                        />
                        {formValidation.errors.website &&
                        formValidation.touched.website ? (
                          <small className="text-danger">
                            {formValidation.errors.website}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">Country</label>
                        <select
                          className="form-select form-control input-style"
                          onChange={formValidation.handleChange}
                          id="country"
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.country}
                        >
                          {countriesMiddleEast.map((countryItem) => (
                            <option value={countryItem.code}>
                              {countryItem.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">City</label>
                        <input
                          // type="text"
                          placeholder="Enter City"
                          className="form-control input-style"
                          id="city"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.city}
                        />
                        {formValidation.errors.city &&
                        formValidation.touched.city ? (
                          <small className="text-danger">
                            {formValidation.errors.city}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">sector</label>
                        <select
                          className="form-select form-control input-style"
                          onChange={
                            // setCountryVal(event.target.value);
                            formValidation.handleChange
                          }
                          id="sectorId"
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.sectorId}
                        >
                          {allSectors.map((item) => (
                            <option value={item?.id}>{item?.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">
                          Company Description
                          <span> * </span>
                        </label>
                        <textarea
                          className="form-control "
                          rows="5"
                          id="description"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.description}
                        ></textarea>
                        {formValidation.errors.description &&
                        formValidation.touched.description ? (
                          <small className="text-danger">
                            {formValidation.errors.description}
                          </small>
                        ) : (
                          ""
                        )}
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
                        navigate(`/`);
                      }}
                    >
                      Exit
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
