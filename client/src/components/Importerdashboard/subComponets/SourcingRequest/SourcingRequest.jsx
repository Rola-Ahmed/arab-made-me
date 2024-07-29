import { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "config.js";
import {
  requiredStringMax255,
  reqQualityValidate,
  otherTextAreaValidate,
  requiredDateValidate,
  textAreaValidate,
} from "utils/validationUtils";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { GlobalMsgContext } from "Context/globalMessage";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import TextareaInput from "components/Forms/Shared/TextareaInput";
import UploadDocument from "components/Forms/Shared/UploadDocument";

import { packingConditionsArr } from "constants/packingConditionsArr";

import { useNavigate } from "react-router-dom";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedDash";

import { countriesMiddleEast } from "constants/countries";
import "./SourcingRequest.css";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import SpecialChar from "components/Forms/Shared/SpecialChar/SpecialChar";
import InputField from "components/Forms/Shared/InputField";
import SelectWithTextarea from "components/Forms/Shared/SelectWithTextarea";
import DateTimeInput from "components/Forms/Shared/DateTimeInput";
import { paymentTypeArr } from "constants/paymentTypeArr";

// import "./PurchasingOrder.css";
function SourcingRequest() {
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let { setGlobalMsg } = useContext(GlobalMsgContext);

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);

  // ------------------------Form Validation
  let validationSchema = Yup.object().shape({
    productName: requiredStringMax255,

    quantity: reqQualityValidate,

    shippingConditions: Yup.string(),
    shippingConditionsOther: otherTextAreaValidate(
      "shippingConditions",
      "other"
    ),

    packingConditions: Yup.string(),
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),

    paymentType: Yup.string(),
    paymentTypeOther: otherTextAreaValidate("paymentType", "other"),

    qualityConditions: Yup.string(),
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    deadline: requiredDateValidate,

    otherInfoRequest: textAreaValidate(),

    productDescription: requiredStringMax255,

    country: Yup.array()
      .of(Yup.string())
      .nullable(),

    productCharacteristic: Yup.array().of(
      Yup.object().shape({
        keyword: Yup.string().max(50, "max legnth is  50"),
        value: Yup.string().max(50, "max legnth is  50"),
      })
    ),
  });

  let initialValues = {
    quantity: "", //requried
    productName: "", //requried

    shippingConditions: "", //optional,
    shippingConditionsOther: "",

    packingConditions: "", //optional
    packingConditionsOther: "",

    paymentType: "", //optional
    paymentTypeOther: "",

    qualityConditions: "", //optional
    qualityConditionsOther: "",

    deadline: "", //optional
    country: "", //

    productDescription: "", //requried

    otherInfoRequest: "", //optional

    productCharacteristic: [
      {
        keyword: "",
        value: "",
      },
    ],
  };

  let formValidation = useFormik({
    initialValues,

    validationSchema,
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    let data = {
      productName: values.productName,

      quantity: values.quantity,

      productDescription: values.productDescription,

      specialCharacteristics: {},
    };

    if (values.shippingConditions !== "") {
      data.shippingConditions = values.shippingConditions;
    }
    if (values.packingConditions !== "") {
      data.packingConditions =
        values.packingConditions === "other"
          ? values.packingConditionsOther
          : values.packingConditions;
    }
    if (values.paymentType !== "") {
      data.paymentTerms =
        values.paymentType == "other"
          ? values.paymentTypeOther
          : values.paymentType;
    }

    if (values.qualityConditions !== "") {
      data.qualityConditions =
        values.qualityConditions == "other"
          ? values.qualityConditionsOther
          : values.qualityConditions;
    }
    if (values.deadline !== "") {
      data.deadline = values.deadline;
    }

    if (values.country.length !== 0) {
      data.preferredCountries = values.country;
    }

    if (values.productDescription !== "") {
      data.productDescription = values.productDescription;
    }

    if (values.otherInfoRequest !== "") {
      data.otherInfoRequest = values.otherInfoRequest;
    }

    if (Object.keys(values.productCharacteristic).length != 0) {
      // create an object with the keyword property as the key and the value property as the value.
      const obj = Object.fromEntries(
        values.productCharacteristic.map((obj) => [obj.keyword, obj.value])
      );
      data.specialCharacteristics = obj;
    }

    try {
      setIsLoading(true);
      let config = {
        method: "post",
        url: `${baseUrl}/sourcingRequests/add`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setGlobalMsg("Your Sourcing Request has been successfully submitted");
        navigate(-1);
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response?.data?.message,
        }));
        window.scrollTo({ top: 390 });
      }
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          // case 200:
          //   setErrorMsg("Success (200).");
          //   break;
          // case 204:
          //   setErrorMsg("No Content (204).");
          //   break;
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
            window.scrollTo({ top: 390 });

            break;
          default:
            window.scrollTo({ top: 390 });

            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            // case message== error
            break;
        }
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: "An unexpected error occurred. Please try again later.",
        }));
      }
      setIsLoading(false);
      window.scrollTo({ top: 390 });
    }
  }

  if (
    currentUserData?.importerVerified == "0" ||
    currentUserData?.importerEmailActivated == false
  ) {
    return <ImporterUnVerified />;
  }
  console.log("formvalidation", formValidation);
  return (
    <div id="view" className="m-4 order-section  ">
      {/* <ToastContainer /> */}
      <form onSubmit={formValidation.handleSubmit} className="header w-100">
        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Add New Sourcing Request</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() =>
                  navigate("/importerdashboard/AllSourcingRequests")
                }
              >
                <p className="cursor">All Requests</p>
              </button>
            </div>
          </div>
        </div>

        {/* <section className="req-visit pt-0 pb-0 m-5 border-0"> */}
        {/* Grid  */}
        <div className="container add-product-dash">
          <div className="row row-container w-100 ">
            {errorMsg?.response ? (
              <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                {errorMsg?.response}
              </div>
            ) : (
              ""
            )}

            {/* <div className="title-text w-100 ">
                  <h5>Sourcing Request Details</h5>
                </div> */}

            {/* <div className="row row-container w-100 "> */}
            <div className="col-4">
              <InputField
                isRequired={true}
                title={"Product Name"}
                formValidation={formValidation}
                vlaidationName={"productName"}
              />
            </div>
            <div className="col-4">
              <InputField
                isRequired={true}
                title={"Quantity "}
                formValidation={formValidation}
                vlaidationName={"quantity"}
              />
            </div>

            <div className="col-4">
              <SelectWithTextarea
                formValidation={formValidation}
                vlaidationName={"shippingConditions"}
                textAreaOther={"shippingConditionsOther"}
                isRequired={false}
                title={"shipping conditions"}
                array={shippingConditionsArr}
              />
            </div>

            <div className="col-4">
              <SelectWithTextarea
                formValidation={formValidation}
                vlaidationName={"packingConditions"}
                textAreaOther={"packingConditionsOther"}
                isRequired={false}
                title={"Packing conditions"}
                array={packingConditionsArr}
              />
            </div>

            <div className="col-4">
              <SelectWithTextarea
                formValidation={formValidation}
                vlaidationName={"paymentType"}
                textAreaOther={"paymentTypeOther"}
                isRequired={false}
                title={"payment Term"}
                array={paymentTypeArr}
              />
            </div>

            <div className="col-4">
              <SelectWithTextarea
                formValidation={formValidation}
                vlaidationName={"qualityConditions"}
                textAreaOther={"qualityConditionsOther"}
                isRequired={false}
                title={"Quality Conditions"}
                array={qualityConditionsArr}
              />
            </div>

            {/*  */}
            <div className="col-4">
              <DateTimeInput
                isRequired={false}
                title={"Form Deadline"}
                formValidation={formValidation}
                vlaidationName={"deadline"}
              />
            </div>
            {/*  */}

            <div className="col-4">
              <div className="form-group">
                <label forhtml="country">Select Countries</label>

                {/*  */}
                <button
                  className="btn form-control dropdown-toggle w-100 text-center countries-drop d-flex "
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <p> Select Countries</p>
                  <i className="fa-solid fa-chevron-down text-end my-auto"></i>
                  {/* {Dropdown} */}
                </button>
                <ul className="dropdown-menu col-3 scroller">
                  {countriesMiddleEast.map((item) => (
                    <li>
                      <div className=" dropdown-item d-flex justify-content-start align-items-center width-drop">
                        <input
                          //   onClick={(e) => SelectedCountry(e)}
                          onChange={formValidation.handleChange}
                          className="form-check-input cursor me-3 "
                          type="checkbox"
                          name="country"
                          id="country"
                          value={item.code}
                        />
                        <label
                          className="form-check-label p-0 m-0"
                          htmlFor="country"
                        >
                          {item.name}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>

                {/*  */}
              </div>
            </div>

            {/* ---------------------------- */}
            <div className="col-12 ms-3 ">
              <div className="border-row row">
                <div>
                  <label className="pb-2">Product Characteristics</label>
                </div>

                <SpecialChar
                  formValidation={formValidation}
                  vlaidationName="productCharacteristic"
                />
              </div>
            </div>

            {/* ----------------------------------------- */}

            <TextareaInput
              vlaidationName="productDescription"
              formValidation={formValidation}
              isRequired={true}
              title="product Description"
            />

            <TextareaInput
              vlaidationName="otherInfoRequest"
              formValidation={formValidation}
              isRequired={false}
              title="Other Information"
            />

            <UploadDocument
              selectedDocs={selectedDocs}
              errorMsg={errorMsg}
              setSelectedDocs={setSelectedDocs}
              MediaName="docs"
              mediaMaxLen="3"
              meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
              setErrorMsg={setErrorMsg}
              title="Upload Document "
            />

            <div className="col-12">
              <div className="btn-container d-flex justify-content-center">
                {isLoading ? (
                  <button type="button" className="order-btn-2 px-5 ">
                    <i className="fas fa-spinner fa-spin px-2"></i>
                  </button>
                ) : (
                  <button
                    className="order-btn-2"
                    type="submit"
                    onClick={() => {
                      if (formValidation.isValid == false) {
                        const targetElement = document.getElementById(
                          Object.keys(formValidation.errors)?.[0]
                        );

                        if (targetElement) {
                          targetElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }

                        // Scroll to the target element
                      }
                    }}
                  >
                    <i className="fa-solid fa-plus"></i>
                    <p className="cursor">Add </p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SourcingRequest;
