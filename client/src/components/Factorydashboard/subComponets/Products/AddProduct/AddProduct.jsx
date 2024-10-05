import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./AddProduct.css";
// import { userDetails } from "Context/userType";
import LoadingProccess from "components/Shared/Dashboards/LoadingProccess";

import { useNavigate } from "react-router-dom";
import useFormSubmission from "./useFormSubmission";

import UploadDocument from "components/Forms/Shared/UploadDocument";
import TextareaInput from "components/Forms/Shared/TextareaInput";
import SpecialChar from "components/Forms/Shared/SpecialChar/SpecialChar";
import {
  requiredStringMax255,
  priceCurrency,
  textAreaValidate,
} from "utils/validationUtils";
import InputField from "components/Forms/Shared/InputField";

const uploadConfigs = [
  {
    mediaName: "images",
    maxLen: 3,
    accepts: ["png", "jpeg", "jpg"],
    title: "Upload Images",
  },
  {
    mediaName: "coverImage",
    maxLen: 1,
    accepts: ["png", "jpeg", "jpg"],
    title: "Upload cover Image *",
  },
];

export default function AddProduct() {
  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState({
    submitLoading: false,
    // pageLoading: true,
    // errorPageLoading: true,
  });

  const [selectedDocs, setSelectedDocs] = useState([]);
  let { submitForm, productAdded, submitDocs } = useFormSubmission(
    setErrorMsg,
    setIsLoading
  );

  let validationSchema = Yup.object().shape({
    name: requiredStringMax255,

    price: priceCurrency,

    hsnCode: Yup.string()
      .min(6, "Minimum  length is 6")
      .max(15, "Maximum 15  is legnth"),
    guarantee: textAreaValidate(),
    minOrderQuantity: requiredStringMax255,
    maxOrderQuantity: requiredStringMax255,

    description: requiredStringMax255,

    productCharacteristic: Yup.array().of(
      Yup.object().shape({
        keyword: Yup.string().max(50, "max legnth is  50"),
        value: Yup.string().max(50, "max legnth is  50"),
      })
    ),
  });

  let initialValues = {
    name: "",
    price: "",
    hsnCode: "",
    guarantee: "",
    minOrderQuantity: "",
    maxOrderQuantity: "",
    description: "",
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
    // validate,
    onSubmit: submit,
  });
  function submit(values) {
    // if data is not added yet
    if (!productAdded?.status) {
      submitForm(values, selectedDocs);
    }
    // if textApi is added and selectedDocs is greater that 0
    // call media
    // this case means that error ouccured in meidaApi so i need only to call media api
    // else
    // if (privateLabelAdded.status && selectedDocs?.length > 0) {
    else if (selectedDocs?.length > 0) {
      submitDocs(productAdded?.id, selectedDocs);
    }
  }

  const handleScrollToError = () => {
    if (formValidation.isValid == false) {
      const targetElement = document.getElementById(
        Object.keys(formValidation.errors)?.[0]
      );
      targetElement?.scrollIntoView({ behavior: "smooth", block: "start" });

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        const targetElement = document.getElementById("view");
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  return (
    <>
      <LoadingProccess show={isLoading?.submitLoading} />

      <div id="view" className="m-4 order-section  ">
        <div className="header w-100">
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Add New Product</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => navigate("/factorydashboard/AllFactoryProducts")}
              >
                <p className="cursor">All Products</p>
              </button>
            </div>
          </div>
        </div>
        {/* section 1 */}
        <form onSubmit={formValidation.handleSubmit} className="header w-100">
          {/* <form className="header w-100"> */}

          {/* ------------ */}
          <div className="container  add-product-dash">
            <div className="row row-container w-100 ">
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg.response}
                </div>
              )}
              <div className="col-4">
                <InputField
                  isRequired={true}
                  title={"Product Name"}
                  formValidation={formValidation}
                  vlaidationName={"name"}
                />
              </div>

              <div className="col-4">
                <InputField
                  isRequired={true}
                  title={"Price"}
                  formValidation={formValidation}
                  vlaidationName={"price"}
                />
              </div>

              <div className="col-4">
                <InputField
                  isRequired={true}
                  title={"hsn Code"}
                  formValidation={formValidation}
                  vlaidationName={"hsnCode"}
                />
              </div>

              <div className="col-4">
                <InputField
                  isRequired={false}
                  title={"guarantee"}
                  formValidation={formValidation}
                  vlaidationName={"guarantee"}
                />
              </div>

              <div className="col-4">
                <InputField
                  isRequired={true}
                  title={"min Order Quantity "}
                  formValidation={formValidation}
                  vlaidationName={"minOrderQuantity"}
                />
              </div>

              <div className="col-4">
                <InputField
                  isRequired={true}
                  title="Ability to Production"
                  formValidation={formValidation}
                  vlaidationName={"maxOrderQuantity"}
                />
              </div>

              {/* ---------------------------- */}
              <div className="col-12 ms-3 ">
                <div className="border-row row   add-prod">
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

              {uploadConfigs.map((media, index) => (
                <UploadDocument
                  key={index}
                  selectedDocs={selectedDocs}
                  errorMsg={errorMsg}
                  setSelectedDocs={setSelectedDocs}
                  MediaName={media.mediaName}
                  mediaMaxLen={media.maxLen}
                  meidaAcceptedExtensions={media.accepts} // Fixed typo
                  setErrorMsg={setErrorMsg}
                  title={media.title}
                />
              ))}

              <TextareaInput
                vlaidationName="description"
                formValidation={formValidation}
                isRequired={true}
                title="description"
              />

              <div className="col-12">
                <div className="btn-container d-flex justify-content-center">
                  <button
                    className="order-btn-2"
                    type="submit"
                    onClick={() => handleScrollToError()}
                    disabled={isLoading?.submitLoading}
                  >
                    {isLoading?.submitLoading ? (
                      <i className="fas fa-spinner fa-spin px-2"></i>
                    ) : (
                      <>
                        <i className="fa-solid fa-plus"></i>
                        <p className="cursor">Add product</p>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ------------ */}
        </form>
      </div>
    </>
  );
}
