import { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { userDetails } from "Context/userType";
import useCountries from "hooks/useCountries";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedDash";

import useFormSubmission from "./useFormSubmission";
import SuccessToast from "components/SuccessToast";

import { useNavigate } from "react-router-dom";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import { paymentTypeArr } from "constants/paymentTypeArr";

import UploadDocument from "components/Forms/Shared/UploadDocument";
import TextareaInput from "components/Forms/Shared/TextareaInput";
import SelectWithTextarea from "components/Forms/Shared/SelectWithTextarea";

import useCategories from "hooks/useCategory";

import {
  requiredStringMax255,
  reqQualityValidate,
  otherTextAreaValidate,
  requiredStringValidate,
} from "utils/validationUtils";
import { fetchFactoryProducts2 } from "Services/factory";
import InputField from "components/Forms/Shared/InputField";
import FormVlaidtionError from "components/Forms/Shared/FormVlaidtionError";

export default function AddOffer() {
  let { currentUserData } = useContext(userDetails);
  let categories = useCategories();
  const countriesMiddleEast = useCountries();
  let navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState();
  let [allFactoryProducts, setFactoryProducts] = useState();
  const [isLoading, setIsLoading] = useState({
    submitLoading: false,
    // pageLoading: true,
    // errorPageLoading: true,
  });

  let { submitForm, sourcingOfferAdded, submitDocs } = useFormSubmission(
    setErrorMsg,
    setIsLoading
  );

  useEffect(() => {
    getFactoryProduct();
  }, [currentUserData?.factoryId]);

  const getFactoryProduct = async () => {
    let result = await fetchFactoryProducts2(currentUserData?.factoryId, {});

    if (result?.success) {
      setFactoryProducts(result?.data?.products);
    }
  };

  let validationSchema = Yup.object().shape({
    productName: requiredStringMax255,
    // country: Yup.array().of(Yup.string()).nullable(),
    country: Yup.array().of(Yup.string()).nullable(),
    // preferredCountries: Yup.array().of(Yup.string()).nullable(),

    price: reqQualityValidate,

    //   HSN (Harmonized System of Nomenclature) code field i
    productHSNCode: requiredStringMax255,

    quantity: reqQualityValidate,

    productDescription: requiredStringMax255,

    qualityConditions: requiredStringValidate,
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    shippingConditions: requiredStringValidate,
    shippingConditionsOther: otherTextAreaValidate(
      "shippingConditions",
      "other"
    ),

    packingConditions: requiredStringValidate,
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),

    paymentType: requiredStringValidate,
    paymentTypeOther: otherTextAreaValidate("paymentType", "other"),
  });

  let formValidation = useFormik({
    initialValues: {
      productName: "", //req
      price: "", //req
      productDescription: "", //requried
      productHSNCode: "", //optional
      quantity: "", //req
      qualityConditions: "", //optional
      qualityConditionsOther: "",

      shippingConditions: "", //optional
      shippingConditionsOther: "",

      packingConditions: "", //optional
      packingConditionsOther: "",

      paymentType: "", //optional
      paymentTypeOther: "",

      productId: "", //optional
      categoryId: "", //optioal
      country: [],
      // preferredCountries: [],
    },

    validationSchema,
    // validate,
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
      SuccessToast("Your sourcing offer Form has been successfully submitted");

      navigate("/factorydashboard/AllFactoryOffers");
    }
  }
  useEffect(() => {
    if (categories?.length !== 0) {
      formValidation.setValues({
        ...formValidation.values,
        categoryId: categories?.[0]?.id || "",
      });
    }
  }, [categories]);

  // ----------  add imegs----------------------
  const [selectedDocs, setSelectedDocs] = useState([]);

  // will use again
  // if (
  //   currentUserData?.factoryVerified == "0" ||
  //   currentUserData?.factoryEmailActivated == false
  // ) {
  //   return <FactoryUnVerified />;
  // }

  return (
    <>
      {currentUserData.factoryVerified === "0" ||
        (!currentUserData.factoryEmailActivated && <FactoryUnVerified />)}

      <div className="m-4 order-section" id="view">
        {/* section 1 */}
        <form onSubmit={formValidation.handleSubmit} className="header w-100">
          {/* <form className="header w-100"> */}
          <div>
            <div className=" d-flex justify-content-between align-items-center ">
              <h2>Add New Offer</h2>

              <div className="btn-container">
                <button
                  type="button"
                  className="order-btn-1"
                  onClick={() => navigate("/factorydashboard/AllFactoryOffers")}
                >
                  <p className="cursor">All Offers</p>
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
                  formValidation={formValidation}
                  vlaidationName={"productName"}
                  title=" Product Name"
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
                  vlaidationName={"productHSNCode"}
                />
              </div>

              <div className="col-4">
                <InputField
                  isRequired={false}
                  title={"Quantity"}
                  formValidation={formValidation}
                  vlaidationName={"quantity"}
                />
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>
                    Category <span className="">*</span>
                  </label>
                  <select
                    className="form-select form-control"
                    onChange={formValidation.handleChange}
                    id="categoryId"
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.categoryId}
                  >
                    {categories?.map((item) => (
                      <option value={item?.id}>{item?.name}</option>
                    ))}

                   
                  </select>
                  <FormVlaidtionError
                      formValidation={formValidation}
                      vlaidationName="categoryId"
                    />
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>Products</label>
                  <select
                    className="form-select form-control"
                    onChange={formValidation.handleChange}
                    id="productId"
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.productId}
                  >
                    <option value="">Select Product</option>
                    {allFactoryProducts?.map((item) => (
                      <option value={item?.id}>{item?.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label forhtml="country">Select preferred Countries</label>

                  {/*  */}
                  <button
                    className="btn  dropdown-toggle w-100 text-start select-countries "
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Exporting Countires
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
                  vlaidationName={"qualityConditions"}
                  textAreaOther={"qualityConditionsOther"}
                  isRequired={false}
                  title={"Quality Conditions"}
                  array={qualityConditionsArr}
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
                  vlaidationName={"packingConditions"}
                  textAreaOther={"packingConditionsOther"}
                  isRequired={true}
                  title={"Packing conditions"}
                  array={packingConditionsArr}
                />
              </div>

              <UploadDocument
                selectedDocs={selectedDocs}
                errorMsg={errorMsg}
                setSelectedDocs={setSelectedDocs}
                MediaName="images"
                mediaMaxLen="8"
                meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                setErrorMsg={setErrorMsg}
                title="Upload Images "
              />

              <TextareaInput
                vlaidationName="productDescription"
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
                      className="order-btn-2 submitButton"
                      type="submit"
                      onClick={() => {
                        if (formValidation.isValid == false) {
                          const targetElement = document.getElementById(
                            Object.keys(formValidation.errors)?.[0]
                          );

                          // Scroll to the target element
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
                      <p>Add Offer</p>
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
