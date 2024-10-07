import { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  requiredStringMax255,
  otherTextAreaValidate,
  requiredDateValidate,
  textAreaValidate,
} from "utils/validationUtils";
import { userDetails } from "Context/userType";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import TextareaInput from "components/Forms/Shared/TextareaInput";
import UploadDocument from "components/Forms/Shared/UploadDocument";

import { packingConditionsArr } from "constants/packingConditionsArr";

import { useNavigate } from "react-router-dom";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedDash";

import useWorldCountries from "hooks/useWorldCountries";
import "./SourcingRequest.css";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import SpecialChar from "components/Forms/Shared/SpecialChar/SpecialChar";
import InputField from "components/Forms/Shared/InputField";
import SelectWithTextarea from "components/Forms/Shared/SelectWithTextarea";
import DateTimeInput from "components/Forms/Shared/DateTimeInput";
import useFormSubmission from "./hooks/useFormSubmission";

// import "./PurchasingOrder.css";
function SourcingRequest() {
  let navigate = useNavigate();
  const allCountries = useWorldCountries();

  let { currentUserData } = useContext(userDetails);
  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  let {
    submitForm,
    sourcingOfferAdded,
    submitDocs,
    dataSaved,
  } = useFormSubmission(setErrorMsg, setIsLoading);

  // ------------------------Form Validation
  let validationSchema = Yup.object().shape({
    productName: requiredStringMax255,

    quantity: requiredStringMax255,

    shippingConditions: Yup.string(),
    shippingConditionsOther: otherTextAreaValidate(
      "shippingConditions",
      "other"
    ),

    packingConditions: Yup.string(),
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),

    qualityConditions: Yup.string(),
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    deadline: requiredDateValidate,

    otherInfoRequest: textAreaValidate(),

    productDescription: requiredStringMax255,

    country: Yup.array().of(Yup.string()).nullable(),

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
    onSubmit: submit,
  });

  function submit(values) {
    // if data is not added yet
    if (!sourcingOfferAdded.status) {
      submitForm(values, selectedDocs);
    }
    // if textApi is added and selectedDocs is greater that 0
    // call media
    // this case means that error ouccured in meidaApi so i need only to call media api
    // else
    // if (privateLabelAdded.status && selectedDocs?.length > 0) {
    else if (selectedDocs?.length > 0) {
      submitDocs(sourcingOfferAdded.id, selectedDocs);
    } else {
      dataSaved();
    }
  }

  if (
    currentUserData?.importerVerified == "0" ||
    currentUserData?.importerEmailActivated == false
  ) {
    return <ImporterUnVerified />;
  }
  return (
    <div id="view" className="m-4 order-section  ">
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
            {errorMsg?.response && (
              <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                {errorMsg?.response}
              </div>
            )}

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
                vlaidationName={"qualityConditions"}
                textAreaOther={"qualityConditionsOther"}
                isRequired={false}
                title={"Quality Conditions"}
                array={qualityConditionsArr}
              />
            </div>

            <div className="col-4">
              <DateTimeInput
                isRequired={false}
                title={"Form Deadline"}
                formValidation={formValidation}
                vlaidationName={"deadline"}
              />
            </div>

            <div className="col-4">
              <div className="form-group">
                <label forhtml="country">Select Countries</label>

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
                  {allCountries.map((item) => (
                    <li>
                      <div className=" dropdown-item d-flex justify-content-start align-items-center width-drop">
                        <input
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
                  disabled={isLoading?.submitLoading}
                >
                  {isLoading?.submitLoading ? (
                    <i className="fas fa-spinner fa-spin px-2"></i>
                  ) : (
                    <>
                      <i className="fa-solid fa-plus"></i>
                      <p className="cursor">Add </p>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SourcingRequest;
