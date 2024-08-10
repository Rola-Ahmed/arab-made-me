import { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useCategories from "hooks/useCategory";
import "./AddProduct.css";
import { userDetails } from "Context/userType";
import LoadingProccess from "components/Shared/Dashboards/LoadingProccess";

import { useNavigate } from "react-router-dom";
import useFormSubmission from "./useFormSubmission";

import UploadDocument from "components/Forms/Shared/UploadDocument";
import TextareaInput from "components/Forms/Shared/TextareaInput";
import SpecialChar from "components/Forms/Shared/SpecialChar/SpecialChar";
import {
  requiredStringMax255,
  reqQualityValidate,
  textAreaValidate,
} from "utils/validationUtils";
import { fetchOneFactory } from "Services/factory";
import InputField from "components/Forms/Shared/InputField";
import FormVlaidtionError from "components/Forms/Shared/FormVlaidtionError";
export default function AddProduct() {
  let { currentUserData } = useContext(userDetails);
  let categories = useCategories();

  let navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState({
    submitLoading: false,
    // pageLoading: true,
    // errorPageLoading: true,
  });

  let [factoryDetails, setFactoryDetails] = useState();
  const [selectedDocs, setSelectedDocs] = useState([]);
  let { submitForm, productAdded, submitDocs } = useFormSubmission(
    setErrorMsg,
    setIsLoading
  );

  // get sectors and categrories

  async function fetchFactoryData() {
    let result = await fetchOneFactory(currentUserData.factoryId);
    if (result?.success) {
      setFactoryDetails(result?.data?.factories);
    }
  }
  useEffect(() => {
    if (currentUserData.factoryId !== undefined) {
      fetchFactoryData();
    }
  }, [currentUserData?.factoryId]);

  let validationSchema = Yup.object().shape({
    name: requiredStringMax255,

    price: reqQualityValidate,

    hsnCode: Yup.string()
      .required("Input Field is Required")
      .min(6, "Minimum  length is 6")
      .max(15, "Maximum 15  is legnth"),
    guarantee: textAreaValidate(),
    minOrderQuantity: reqQualityValidate,
    maxOrderQuantity: reqQualityValidate,
    categoryId: Yup.string().required("Input Field is Required"),
    // sectorId: Yup.string().required("Input Field is Required"),

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

    categoryId: "",
    sectorId: "",
    city: factoryDetails?.city || "",
    country: factoryDetails?.country || "",

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

  useEffect(() => {
    if (factoryDetails && factoryDetails.length !== 0) {
      formValidation.setValues((prevValues) => ({
        ...prevValues,
        city: factoryDetails?.city || "",
        country: factoryDetails?.country || "",
      }));
    }
  }, [factoryDetails]);

  return (
    <>
      <LoadingProccess show={isLoading?.submitLoading} />

      <div id="view" className="m-4 order-section  ">
        {/* section 1 */}
        <form onSubmit={formValidation.handleSubmit} className="header w-100">
          {/* <form className="header w-100"> */}
          <div>
            <div className=" d-flex justify-content-between align-items-center ">
              <h2>Add New Product</h2>

              <div className="btn-container">
                <button
                  type="button"
                  className="order-btn-1"
                  onClick={() =>
                    navigate("/factorydashboard/AllFactoryProducts")
                  }
                >
                  <p className="cursor">All Products</p>
                </button>
              </div>
            </div>
          </div>

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
                <div className="form-group">
                  <label>Sector *</label>

                  <select
                    className="form-select form-control py-2"
                    onChange={formValidation.handleChange}
                    id="sectorId"
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.sectorId}
                    onClick={(e) => {
                      let selectedProductName = "";
                      categories?.find(
                        (item) =>
                          item.sectorId == e.target.value
                            ? (selectedProductName = item.id)
                            : ""
                        // )
                      );

                      formValidation.setFieldValue(
                        "categoryId",
                        selectedProductName
                      ); // Assuming 'productName' is the field name for product name
                    }}
                  >
                    <option value="">select</option>
                    {categories?.map((item) => (
                      <optgroup label={item?.name}>
                        <option value={item?.sector?.id}>
                          {item?.sector?.name}
                        </option>
                      </optgroup>
                    ))}
                  </select>

                  <FormVlaidtionError
                    formValidation={formValidation}
                    vlaidationName={"categoryId"}
                  />
                </div>
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
                  isRequired={true}
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
                  title={"Max Order Quantity "}
                  formValidation={formValidation}
                  vlaidationName={"maxOrderQuantity"}
                />
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

              <UploadDocument
                selectedDocs={selectedDocs}
                errorMsg={errorMsg}
                setSelectedDocs={setSelectedDocs}
                MediaName="images"
                mediaMaxLen="3"
                meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                setErrorMsg={setErrorMsg}
                title="Upload Images"
              />

              <UploadDocument
                selectedDocs={selectedDocs}
                errorMsg={errorMsg}
                setSelectedDocs={setSelectedDocs}
                MediaName="coverImage"
                mediaMaxLen="1"
                meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                setErrorMsg={setErrorMsg}
                title="Upload cover Image *"
              />

              <TextareaInput
                vlaidationName="description"
                formValidation={formValidation}
                isRequired={true}
                title="description"
              />

              <div className="col-12">
                <div className="btn-container d-flex justify-content-center">
                  {isLoading?.submitLoading ? (
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
                              block: "start",
                            });
                          } else {
                            const targetElement = document.getElementById(
                              "view"
                            );
                            targetElement.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                        }
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                      <p className="cursor">Add product</p>
                    </button>
                  )}
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
