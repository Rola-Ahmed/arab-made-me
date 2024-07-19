import { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import TimeLine from "../Shared/TimeLine/TimeLine";

import { baseUrl } from "config.js";
import {
  textAreaValidate,
  otherTextAreaValidate,
  requiredStringValidate,
  reqQualityValidate,
  requiredDateValidate,
} from "utils/validationUtils";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { GlobalMsgContext } from "Context/globalMessage";

import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "components/main/Header/Header";
import InputField from "components/Forms/Shared/InputField";
import SelectWithTextarea from "components/Forms/Shared/SelectWithTextarea";
import DateTimeInput from "components/Forms/Shared/DateTimeInput";
import SelectGroup from "components/Forms/Shared/SelectGroup";
import SelectOption from "components/Forms/Shared/SelectOption";

import { SupplyLocationArr } from "constants/SupplyLocationArr";
import { ShippingTypeSizeArr } from "constants/ShippingTypeSizeArr";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import { paymentTypeArr } from "constants/paymentTypeArr";

// import "./PurchasingOrder.css";
export default function AnswerQuotation() {
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);

  let { currentUserData } = useContext(userDetails);
  let { setGlobalMsg } = useContext(GlobalMsgContext);

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const sourcingRequestId = searchParams.get("sourcingRequestId");
  const quotationRequestId = searchParams.get("quotationRequestId");
  const specialManufacturingRequestId = searchParams.get(
    "specialManufacturingRequestId"
  );
  const productName = searchParams.get("productName");
  const productId = searchParams.get("productId");
  const importerId = searchParams.get("userId");

  // ------------------------Form Validation
  let validationSchema = Yup.object().shape({
    // from cilent
    requestedQuantity: reqQualityValidate,
    // avialabe qunaitiy for user
    minQuantity: reqQualityValidate,

    price: reqQualityValidate,

    discounts: Yup.string()
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    packingConditions: Yup.string(),
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),

    paymentType: Yup.string(),
    paymentTypeOther: otherTextAreaValidate("paymentType", "other"),

    qualityConditions: Yup.string().required("Input field is Required"),
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    ShippingTypeSize: requiredStringValidate,

    ShippingTypeSizeOther: otherTextAreaValidate("ShippingTypeSize", "other"),
    SupplyLocation: requiredStringValidate,

    shippingConditions: requiredStringValidate,
    shippingConditionsOther: otherTextAreaValidate(
      "shippingConditions",
      "other"
    ),

    deadline: requiredDateValidate,

    timeLine: Yup.array()
      .of(
        Yup.object().shape({
          date: requiredDateValidate,
          quantity: reqQualityValidate,
        })
      )
      .min("1", "minimum length is 1"),

    notes: textAreaValidate(),
  });

  let initialValues = {
    requestedQuantity: "1", //requried
    minQuantity: "", //requried
    price: "", //requried
    discounts: "", //optional

    shippingConditions: "", //required,
    shippingConditionsOther: "",
    packingConditions: "", //req
    paymentType: "", //req
    qualityConditions: "", //req
    country: "", //
    productDescription: "", //requried
    notes: "", //optional

    // productName: productName || "", //requried

    // Send only one of those ids:
    specialManufacturingRequestId: specialManufacturingRequestId || "",

    privateLabelingId: "",
    whiteLabelingId: "",
    sourcingRequestId: sourcingRequestId || "",
    quotationRequestId: quotationRequestId || "",
    productName: productName || "",
    importerId: importerId || "",

    qualityConditionsOther: "",
    packingConditionsOther: "",
    paymentTypeOther: "",
    deadline: "",
    ShippingTypeSize: "",
    ShippingTypeSizeOther: "",
    timeLine: [
      {
        date: "",
        quantity: "",
      },
    ],
  };

  let formValidation = useFormik({
    initialValues,

    validationSchema,
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    setIsLoading(true);

    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    let {
      importerId,
      productName,
      quantity,
      minQuantity,
      price,
      deadline,
      SupplyLocation,
      //
      qualityConditions,
      qualityConditionsOther,
      //
      paymentType,
      paymentTypeOther,
      //
      packingConditionsOther,
      packingConditions,
      //
      shippingConditions,
      shippingConditionsOther,
      //
      ShippingTypeSize,
      ShippingTypeSizeOther,
      //
      moreDetails,
      discounts,
      timeLine,
      notes,
    } = values;
    let data = {
      importerId,
      productName,
      price,
      quantity,
      minQuantity,
      deadline,
      timeLine,
      supplyLocation: SupplyLocation,

      qualityConditions:
        qualityConditions == "other"
          ? qualityConditionsOther
          : qualityConditions,

      shippingConditions:
        shippingConditions == "other"
          ? shippingConditionsOther
          : shippingConditions,

      packingConditions:
        packingConditions == "other"
          ? packingConditionsOther
          : packingConditions,

      shippingSize:
        ShippingTypeSize == "other" ? ShippingTypeSizeOther : ShippingTypeSize,

      paymentTerms: paymentType == "other" ? paymentTypeOther : paymentType,

      ...(moreDetails && { moreDetails }),
      ...(discounts && { discounts }),

      ...(notes && { notes }),
    };

    let addIdpath = "";

    if (values.privateLabelingId !== "") {
      data.privateLabelingId = values.privateLabelingId;
      addIdpath = "privateLabel";
    }

    if (values.sourcingRequestId !== "") {
      data.sourcingRequestId = values.sourcingRequestId;
      addIdpath = "sourcingRequest";
    }

    if (values.quotationRequestId !== "") {
      data.quotationRequestId = values.quotationRequestId;
      data.productId = productId;
      addIdpath = "rfq";
    }
    if (values.specialManufacturingRequestId !== "") {
      data.specialManufacturingRequestId = values.specialManufacturingRequestId;
      addIdpath = "spmf";
    }

    try {
      let config = {
        method: "post",
        url: `${baseUrl}/quotations/add/${addIdpath}`,

        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setGlobalMsg("Your Quotation has been successfully submitted");
        navigate(-1);
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response.data.message,
        }));

        const targetElement = document.getElementById("view");
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
      setIsLoading(false);
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
              // response: "User is not Unauthorized ",
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
      const targetElement = document.getElementById("view");
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }

  console.log("formValidation", formValidation);
  return (
    <>
      <Header title="Send Quotation " />
      <form onSubmit={formValidation.handleSubmit}>
        <section id="view" className="req-visit">
          {/* Grid  */}
          <div className="container container-req ">
            <div className="input-content ">
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}

              <div className="title-text w-100 ">
                <h5> Quotation Details</h5>
              </div>

              <div className="row row-container w-100 ">
                <div className="col-md-6 col-sm-12">
                  <InputField
                    isRequired={true}
                    title={"Total Quantity"}
                    formValidation={formValidation}
                    vlaidationName={"minQuantity"}
                  />
                </div>

                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    {/* <label class={"form-title"}> */}
                    <label>requested Quantity</label>
                    <input className="form-control " readonly />
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <InputField
                    isRequired={true}
                    title={"Price"}
                    formValidation={formValidation}
                    vlaidationName={"price"}
                  />
                </div>

                <div className="col-md-6 col-sm-12">
                  <InputField
                    isRequired={false}
                    title={"Discounts"}
                    formValidation={formValidation}
                    vlaidationName={"discounts"}
                  />
                </div>

                <div className="col-md-6 col-sm-12">
                  <DateTimeInput
                    isRequired={true}
                    title={"Form Deadline"}
                    formValidation={formValidation}
                    vlaidationName={"deadline"}
                  />
                </div>

                <div className="col-md-6 col-sm-12">
                  <SelectWithTextarea
                    formValidation={formValidation}
                    vlaidationName={"shippingConditions"}
                    textAreaOther={"shippingConditionsOther"}
                    isRequired={true}
                    title={"shipping conditions"}
                    array={shippingConditionsArr}
                  />
                </div>

                <div className="col-md-6 col-sm-12">
                  <SelectWithTextarea
                    formValidation={formValidation}
                    vlaidationName={"packingConditions"}
                    textAreaOther={"packingConditionsOther"}
                    isRequired={true}
                    title={"Packing condition"}
                    array={packingConditionsArr}
                  />
                </div>

                <div className="col-md-6 col-sm-12">
                  <SelectWithTextarea
                    formValidation={formValidation}
                    vlaidationName={"paymentType"}
                    textAreaOther={"paymentTypeOther"}
                    isRequired={true}
                    title={"payment Term"}
                    array={paymentTypeArr}
                  />
                </div>

                <div className="col-md-6 col-sm-12">
                  <SelectWithTextarea
                    formValidation={formValidation}
                    vlaidationName={"qualityConditions"}
                    textAreaOther={"qualityConditionsOther"}
                    isRequired={true}
                    title={"Quality Condition"}
                    array={qualityConditionsArr}
                  />
                </div>

                <div className="col-md-6 col-sm-12">
                  <SelectGroup
                    formValidation={formValidation}
                    vlaidationName="ShippingTypeSize"
                    textAreaOther={"ShippingTypeSizeOther"}
                    isRequired={true}
                    title={"Shipping Type and Size"}
                    array={ShippingTypeSizeArr}
                  />
                </div>

                <div className="col-md-6 col-sm-12">
                  <SelectOption
                    formValidation={formValidation}
                    vlaidationName={"SupplyLocation"}
                    isRequired={true}
                    title={"Supply Location"}
                    array={SupplyLocationArr}
                  />
                </div>
                <TimeLine
                  formValidation={formValidation}
                  vlaidationName={"timeLine"}
                />

                {/*  */}

                {/*  */}

                <div className="col-12">
                  <div className="form-group">
                    <label forhtml="notes">Other Information</label>
                    <textarea
                      type="email"
                      className="form-control"
                      id="notes"
                      name="notes"
                      placeholder="Conditions of delay"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.notes}
                    />
                    {formValidation.errors.notes &&
                    formValidation.touched.notes ? (
                      <small className="form-text text-danger">
                        {formValidation.errors.notes}
                      </small>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              <div className="action row">
                <div className="col-12">
                  {isLoading ? (
                    <button type="button" className="action-btn btn-1 w-100 ">
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

                          if (targetElement) {
                            targetElement.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }
                      }}
                    >
                      Send Quotation
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>

      {/* <Footer /> */}
    </>
  );
}
