import { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "config.js";

import { userDetails } from "Context/userType";
import { countriesMiddleEast } from "constants/countries";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedDash";

import useFormSubmission from "./useFormSubmission";
import SuccessToast from "components/SuccessToast";

import { useNavigate } from "react-router-dom";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import useCategories from "hooks/useCategory";

import {
  requiredStringMax255,
  reqQualityValidate,
  otherTextAreaValidate,
} from "utils/validationUtils";

export default function AddSourcingOffer() {
  let { currentUserData } = useContext(userDetails);
  let categories = useCategories();

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
    try {
      const response = await axios.get(
        `${baseUrl}/factories/products/${currentUserData?.factoryId}`
      );

      setFactoryProducts(response.data.products);
    } catch (error) {}
  };

  let validationSchema = Yup.object().shape({
    productName: requiredStringMax255,
    // country: Yup.array().of(Yup.string()).nullable(),
    country: Yup.array()
      .of(Yup.string())
      .nullable(),

    price: reqQualityValidate,

    //   HSN (Harmonized System of Nomenclature) code field i
    productHSNCode: Yup.string()
      .required("Input Field is Required")
      .min(6, "Minimum  length is 6")
      .max(15, "Maximum 15  is legnth"),

    quantity: reqQualityValidate,

    productDescription: requiredStringMax255,

    qualityConditions: Yup.string(),
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    packingConditions: Yup.string(),
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),

    paymentType: Yup.string(),
    paymentTypeOther: otherTextAreaValidate("paymentType", "other"),

    deliveryTerms: Yup.string(),
    deliveryTermsOther: otherTextAreaValidate("deliveryTerms", "other"),
  });

  let formValidation = useFormik({
    initialValues: {
      productName: "", //req
      price: "", //req
      productDescription: "", //requried
      productHSNCode: "", //optional
      quantity: "", //req
      qualityConditions: "", //optional
      shippingConditions: "", //optional
      packingConditions: "", //optional
      paymentTerms: "", //optional

      deliveryTerms: "", //optional
      productId: "", //optional
      categoryId: "", //optioal
      country: "",
      preferredCountries: "",
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
  const [selectedDocs, setSelectedDocs] = useState([
    // {
    //   pdfName: null,
    //   pdfFile: null,
    // },
  ]);

  function removeSelectedDoc(docId, keyWordDoc) {
    // when removing
    setSelectedDocs((prevValue) =>
      prevValue?.filter(
        (doc) => !(doc?.pdfFile?.name === docId && doc?.keyWord === keyWordDoc)
      )
    );
  }

  //
  function handleMultiMediaValidation(e, keyWordDoc) {
    const count = selectedDocs?.filter((item) => item?.keyWord === "docs")
      ?.length;

    if (count >= 3) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: `Max length is 3`,
      }));
      return;
    }
    // clear error message
    setErrorMsg((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[keyWordDoc];
      return newErrors;
    });
    const acceptedExtensions = ["png", "jpeg", "jpg"];
    const fileType = e.type;

    const isAcceptedType = acceptedExtensions?.some((extension) =>
      fileType?.toLowerCase()?.includes(extension?.toLowerCase())
    );

    if (!isAcceptedType) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]:
          // "Invalid file format. Only pdf, png, jpeg, jpg, mp4 allowed"
          `Invalid file format. Only ${acceptedExtensions.join(
            ", "
          )} are allowed`,
      }));
      return;
    }

    const mediaNameExists = selectedDocs?.some(
      (item) => item?.pdfFile?.name === e?.name && item?.keyWord === keyWordDoc
    );

    // if image aleady exisit
    if (mediaNameExists) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: "Media already exists",
      }));
      return;
    } else {
    }

    let updatedDocs = [...selectedDocs];

    // Image loaded successfully
    const reader = new FileReader();
    reader.onloadend = () => {
      updatedDocs.push({
        keyWord: keyWordDoc,
        pdfFile: e,
        imageReaderURL: reader.result,
        onprogress: 100,
      });

      setSelectedDocs(updatedDocs);
      const coverImgInput = document?.getElementById("coverimginput");
      if (coverImgInput) {
        coverImgInput.value = "";
      }
    };

    reader.onprogress = (event) => {
      // Calculate and show the loading percentage
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;

        // if (updatedDocs.length > 0) {
        //   // Adding a new attribute to the last object
        //   // updatedDocs[updatedDocs.length - 1].onprogress = percentage?.toFixed(0);
        //   // setSelectedDocs([...updatedDocs]);

        //   // setSelectedDocs((prevDocs) => {
        //   //   const updatedDocs = [...prevDocs];
        //   //   if (updatedDocs.length > 0) {
        //   //     updatedDocs[updatedDocs.length - 1].onprogress = percentage?.toFixed(0);
        //   //   }
        //   //   return updatedDocs;
        //   // });
        // }
        // setimgloadin(percentage);
      }
    };

    reader.onerror = () => {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: "Error loading image",
      }));
    };

    reader.readAsDataURL(e);
  }

  if (
    currentUserData?.factoryVerified == "0" ||
    currentUserData?.factoryEmailActivated == false
  ) {
    return <FactoryUnVerified />;
  }
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
                <div className="form-group">
                  <label>
                    Product Name <span className="">*</span>
                  </label>
                  <input
                    className="form-control"
                    id="productName"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.productName}
                  />
                  {formValidation.errors.productName &&
                  formValidation.touched.productName ? (
                    <small className="text-danger">
                      {formValidation.errors.productName}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>
                    Price <span className="">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control text-dark"
                    id="price"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.price}
                  />
                  {formValidation.errors.price &&
                  formValidation.touched.price ? (
                    <small className="text-danger">
                      {formValidation.errors.price}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>
                    hsn Code <span className="">*</span>
                  </label>
                  <input
                    className="form-control"
                    id="productHSNCode"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.productHSNCode}
                  />
                  {formValidation.errors.productHSNCode &&
                  formValidation.touched.productHSNCode ? (
                    <small className="text-danger">
                      {formValidation.errors.productHSNCode}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>
                    Quantity <span className="">*</span>
                  </label>
                  <input
                    className="form-control"
                    id="quantity"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.quantity}
                  />
                  {formValidation.errors.quantity &&
                  formValidation.touched.quantity ? (
                    <small className="text-danger">
                      {formValidation.errors.quantity}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
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
                  <label forhtml="country">Select Countries</label>

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
                <div className="form-group">
                  <label htmlFor="shippingConditions">
                    shipping conditions
                  </label>
                  <select
                    id="shippingConditions"
                    name="shippingConditions"
                    className="form-select form-control"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.shippingConditions}
                  >
                    {shippingConditionsArr.map((item) => (
                      <option value={item?.value}>{item?.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label htmlFor="qualityConditions">Quality Conditions</label>

                  <select
                    className="form-select form-control"
                    id="qualityConditions"
                    name="qualityConditions"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.qualityConditions}
                  >
                    {qualityConditionsArr.map((item) => (
                      <option value={item?.value}>{item?.name}</option>
                    ))}
                  </select>

                  {formValidation.values.qualityConditions == "other" ? (
                    <textarea
                      className="form-control w-100 "
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.qualityConditionsOther}
                      id="qualityConditionsOther"
                      name="qualityConditionsOther"
                      rows="3"
                      placeholder="enter more details"
                    ></textarea>
                  ) : (
                    ""
                  )}

                  {formValidation.errors.qualityConditionsOther &&
                  formValidation.touched.qualityConditionsOther ? (
                    <small className="form-text text-danger">
                      {formValidation.errors.qualityConditionsOther}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label htmlFor="paymentType">payment Term</label>

                  <select
                    className="form-select form-control"
                    id="paymentType"
                    name="paymentType"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.paymentType}
                  >
                    <option value="advancePayment">
                      Advance payment on order
                    </option>
                    <option value="immediateCreditCardCharge">
                      The credit card will be charged immediately after the
                      order
                    </option>
                    <option value="immediateInvoicePayment">
                      Payable immediately upon issuance of the invoice
                    </option>
                    <option value="payableWithin14Days">
                      Payable within 14 days
                    </option>

                    <option value="other">Other Payment Terms</option>
                  </select>
                  {formValidation.values.paymentType == "other" ? (
                    <textarea
                      className="form-control w-100 "
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.paymentTypeOther}
                      id="paymentTypeOther"
                      name="paymentTypeOther"
                      rows="3"
                      placeholder="enter more details"
                    ></textarea>
                  ) : (
                    ""
                  )}

                  {formValidation.errors.paymentTypeOther &&
                  formValidation.touched.paymentTypeOther ? (
                    <small className="form-text text-danger">
                      {formValidation.errors.paymentTypeOther}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label htmlFor="deliveryTerms">delivery Terms</label>
                  <select
                    id="deliveryTerms"
                    name="deliveryTerms"
                    className="form-select form-control"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.deliveryTerms}
                  >
                    <option value="">Select delivery Terms</option>
                    <option value="standard">Standard Delivery</option>
                    <option value="expedited">Expedited Delivery</option>
                    <option value="express">Express Delivery</option>
                    <option value="other">other</option>
                  </select>
                  {formValidation.values.deliveryTerms == "other" ? (
                    <textarea
                      className="form-control w-100 "
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.deliveryTermsOther}
                      id="deliveryTermsOther"
                      name="deliveryTermsOther"
                      rows="3"
                      placeholder="enter more details"
                    ></textarea>
                  ) : (
                    ""
                  )}

                  {formValidation.errors.deliveryTermsOther &&
                  formValidation.touched.deliveryTermsOther ? (
                    <small className="form-text text-danger">
                      {formValidation.errors.deliveryTermsOther}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label htmlFor="packingConditions">Packing condition</label>
                  <select
                    id="packingConditions"
                    name="packingConditions"
                    className="form-select form-control"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.packingConditions}
                  >
                    <option value="">Select Packing Condition</option>

                    {packingConditionsArr.map((item) => (
                      <option value={item?.value}>{item?.name}</option>
                    ))}
                  </select>

                  {formValidation.values.packingConditions == "other" ? (
                    <textarea
                      className="form-control w-100 "
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.packingConditionsOther}
                      id="packingConditionsOther"
                      name="packingConditionsOther"
                      rows="3"
                      placeholder="enter more details"
                    ></textarea>
                  ) : (
                    ""
                  )}

                  {formValidation.errors.packingConditionsOther &&
                  formValidation.touched.packingConditionsOther ? (
                    <small className="form-text text-danger">
                      {formValidation.errors.packingConditionsOther}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="form-group gap">
                  <label className="form-title">Upload Document </label>
                  <label
                    className="mb-0 drop-drag-area  p-5 text-center cursor w-100 "
                    htmlFor="coverimginput"
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = e?.dataTransfer?.files;
                      if (files && files.length > 0) {
                        handleMultiMediaValidation(files?.[0], "docs");
                      }

                      e.target.classList.remove("highlight");
                    }}
                    onDragOver={(e) => {
                      e.target.classList.add("highlight");

                      e.preventDefault();
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.target.classList.remove("highlight");
                    }}
                    onChange={(e) => {
                      const files = e.target.files;

                      if (files && files?.length > 0) {
                        handleMultiMediaValidation(files?.[0], "docs");
                      }
                    }}
                  >
                    Drag and drop files here or click to select files
                    <input
                      type="file"
                      id="coverimginput"
                      // className="d-none"
                      hidden
                      onChange={(e) => {
                        const files = e.target.files;

                        if (files && files?.length > 0) {
                          handleMultiMediaValidation(files?.[0], "docs");
                        }
                      }}
                      multiple
                    />
                  </label>
                  <small className="form-text small-note">
                    Only pdf, png, jpeg, and jpg are allowed. A maximum of 3
                    pictures is permitted.
                  </small>

                  <small className="text-danger">{errorMsg?.docs}</small>

                  {/* <div className=" row w-100 "> */}
                  {selectedDocs.map(
                    (item, index) =>
                      // <div className="col-12">
                      item.keyWord === "docs" && (
                        <div key={index} className="col-12 img-uploaded">
                          <div className="d-flex justify-content-between align-items-center  img-cont-file">
                            {/* <div> */}

                            <div className="d-flex justify-content-start align-items-center ">
                              <img
                                // src={item.imageReaderURL}
                                src={item.imageReaderURL}
                                className="image-upload-file me-3"
                              />
                            </div>

                            <div className="w-100">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <p>{item?.pdfFile?.name}</p>
                                  <p className="">
                                    {(item?.pdfFile?.size / 1024)?.toFixed(2)}
                                    KB
                                  </p>
                                  {/* {imgloadin} */}
                                </div>

                                <div
                                  onClick={() =>
                                    removeSelectedDoc(
                                      item?.pdfFile?.name,
                                      "docs",
                                      index
                                    )
                                  }
                                  className="cursor"
                                >
                                  <i className="fa-solid fa-trash-can"></i>
                                </div>
                              </div>

                              <div className="d-flex  align-items-center">
                                <progress
                                  className="w-100"
                                  id="progressBar"
                                  max="100"
                                  value={item?.onprogress || 0}
                                  // value="30"
                                  imgloadin
                                ></progress>
                                {item?.onprogress}%
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    // </div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label>
                    description <span className="text-danger fw-bolder">*</span>
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="productDescription"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.productDescription}
                  ></textarea>
                  {formValidation.errors.productDescription &&
                  formValidation.touched.productDescription ? (
                    <small className="text-danger">
                      {formValidation.errors.productDescription}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>
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
