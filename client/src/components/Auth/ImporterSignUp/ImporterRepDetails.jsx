import React, { useState, useContext, useEffect } from "react";

import { awaitImg, nextImg, checkedImg } from "constants/Images";

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { baseUrl } from "config.js";

import * as Yup from "yup";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { countriesMiddleEast } from "constants/countries";

export default function ImporterRepDetails() {
  let { isLogin } = useContext(UserToken);
  let { setCurrentUserData } = useContext(userDetails);

  document.title = "Buyer Registration";
  useEffect(() => {
    if (!isLogin) {
      navigate(`/signIn/buyerRegistration/LegalDocuments`);
    }

    // }
  }, [isLogin]);

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [allSectors, setAllSectors] = useState([]);

  let phoneValidation = Yup.string()
    .required("Input Field is Required")
    .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(6, "min length is 6")
    .max(15, "max length is 15");

  let validationSchema = Yup.object().shape({
    // userType: Yup.string(),

    repName: Yup.string()

      .max(50, "max length is 50")
      .required("Input field is Required"),

    importerName: Yup.string()

      .max(50, "max length is 50")
      .required("Input field is Required"),

    repEmail: Yup.string()
      .email("Invalid email")
      .required("Input Field is Required")

      .max(255, "max length is 255"),

    repPhone: phoneValidation,

    WhatsappPhone: Yup.string()
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .min(6, "min length is 6")
      .max(15, "max length is 15"),

    commercialRegisterationNumber: Yup.string()
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .min(8, "min length is 8")
      .max(16, "max length is 16"),

    website: Yup.string().matches(
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}([/?#]\S*)?$/,
      "Invalid URL"
    ),

    address: Yup.string()
    .max(255, "max length is 255"),

    description: Yup.string()
      .required("Input Field is Required")

      .max(255, "max legnth is 255"),
  });

  let formValidation = useFormik({
    initialValues: {
      repName: "",
      importerName: "",
      repEmail: "",
      repPhone: "",
      repPhoneCode: countriesMiddleEast?.[0].phoneCode,

      WhatsappPhone: "",
      WhatsappPhoneCode: countriesMiddleEast?.[0].phoneCode,

      commercialRegisterationNumber: "",
      description: "",

      sectorId: "",

      website: "",

      country: countriesMiddleEast?.[0].code,
      address: "",

      allowEmailNotification: "false",
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
      // ;
      let data = {
        name: values.importerName,
        repName: values.repName,
        repPhone: `${values.repPhoneCode}${values.repPhone}`,
        repEmail: values.repEmail,
        description: values.description,
        country: values.country,
        sectorId: values.sectorId,
        allowEmailNotification: values.allowEmailNotification,
        socialLinks: {},
      };

      if (values.address !== "") {
        data.address = [values.address];
      }

      if (values.website !== "") {
        data.website = values.website;
      }

      if (values.commercialRegisterationNumber !== "") {
        data.commercialRegisterationNumber =
          values.commercialRegisterationNumber;
      }

      if (values.WhatsappPhone !== "")
        data.socialLinks[
          "whatsapp"
        ] = `${values.WhatsappPhoneCode}${values.WhatsappPhone}`;

      let config = {
        method: "post",
        url: `${baseUrl}/importers/add`,

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

      if (response?.data?.message === "done") {
        navigate("/buyerRegistration/LegalDocuments");
        setCurrentUserData((prevUserData) => ({
          ...prevUserData,
          importerId: response?.data?.importer?.id,
        }));
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
      if (error.response) {
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
              response: error?.response?.data?.message,
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
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;

          //  429 Too Many Requests
          // The user has sent too many requests in a given amount of time ("rate limiting").
          case 429:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: " Too Many Requests , Please try again later.",
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
      });
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/sectors?size=10`);

        if (response.data.message === "done") {
          setAllSectors(response.data.sectors);
        }
      } catch (error) {}
    };

    fetchData(); // Call the asynchronous function
  }, []);

  return (
    <section id="view" className="register-msg ">
      <div className=" container ">
        <div className=" cont-1 d-flex justify-content-center align-items-center mx-auto  ">
          <div className=" sub-cont-buyer w-100">
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
                <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                <div className="img-cont">
                  <img src={awaitImg} alt="" />
                </div>

                <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
              </div>
              <p className="text-cont text-center active">
                Representive Information
              </p>
            </div>
            {/*  */}
            {/*  */}
            <div className=" text-check ">
              <div className="  timeline-reg d-flex">
                <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                <div className="img-cont me-5">
                  <img src={nextImg} alt="" />
                </div>
              </div>
              <p className="text-cont text-end">Legal Documents</p>
            </div>
            {/*  */}
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
                          Buyer Name <span className="text-danger">*</span>
                        </label>

                        <input
                          type="text"
                          className="form-control input-style"
                          placeholder="Enter Buyer Name"
                          id="importerName"
                          onChange={formValidation.handleChange}
                          onBlur={formValidation.handleBlur}
                          value={formValidation.values.importerName}
                        />
                        {formValidation.errors.importerName &&
                        formValidation.touched.importerName ? (
                          <small className="text-danger">
                            {formValidation.errors.importerName}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">
                        Representive full Name*
                      </label>
                      <input
                        type="text"
                        className="form-control input-style"
                        id="repName"
                        name="repName"
                        placeholder="Enter full Name"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.repName}
                      />
                      {formValidation.errors.repName &&
                      formValidation.touched.repName ? (
                        <small className="text-danger">
                          {formValidation.errors.repName}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title"> Representive Email*</label>
                      <input
                        type="text"
                        className="form-control input-style"
                        id="repEmail"
                        name="repEmail"
                        placeholder="enter Representive Email"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.repEmail}
                      />

                      {formValidation.errors.repEmail &&
                      formValidation.touched.repEmail ? (
                        <small className="text-danger">
                          {formValidation.errors.repEmail}
                        </small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  {/* ----------------------- */}
                  <div className="col-12">
                    <div className="grid-gap-col">
                      <div className="form-group gap">
                        <label className="form-title">
                          Representive Phone Number*
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
                            className="form-control input-style phone-border"
                            id="repPhone"
                            name="repPhone"
                            placeholder="1113534343"
                            onChange={formValidation.handleChange}
                            value={formValidation.values.repPhone}
                            onBlur={formValidation.handleBlur}
                          />
                        </div>
                        {formValidation.errors.repPhone &&
                        formValidation.touched.repPhone ? (
                          <small className="form-text text-danger">
                            {formValidation.errors.repPhone}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  {/* ---------------------- */}
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
                    <div className="form-group gap">
                      <label className="form-title">website</label>
                      <input
                        type="text"
                        className="form-control input-style"
                        id="website"
                        placeholder="https://...."
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

                  {/*  */}

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">
                        commercial Registeration Number
                      </label>
                      <input
                        type="text"
                        className="form-control input-style"
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
                      <label className="form-title">address</label>
                      <input
                        type="text"
                        className="form-control input-style"
                        id="address"
                        placeholder="Enter Address"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.address}
                      />
                      {formValidation.errors.address &&
                      formValidation.touched.address ? (
                        <small className="text-danger">
                          {formValidation.errors.address}
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
                        {allSectors?.map((item) => (
                          <option value={item?.id}>{item?.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-12">
                    {/* <div className="d-flex justify-content-between align-items-center "> */}
                    <div className="form-group gap m-0 p-0">
                      <label className="form-title">
                        Allow Email Notifications
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input switch-input cursor form-select form-control input-style"
                        type="checkbox"
                        id="allowEmailNotification"
                        onChange={formValidation.handleChange}
                        onBlur={formValidation.handleBlur}
                        value={formValidation.values.allowEmailNotification}
                      />
                      {/* </div> */}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group gap">
                      <label className="form-title">
                        Buyer Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control "
                        rows="4"
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
  );
}
