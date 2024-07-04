import React, { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { countriesMiddleEast } from "constants/countries";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerifiedDash/FactoryUnVerifiedDash";
import { GlobalMsgContext } from "Context/globalMessage";

import { useNavigate } from "react-router-dom";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";

export default function AddSourcingOffer() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let [productAdded, setProductAdded] = useState({ status: false, id: "" });
  let { setGlobalMsg } = useContext(GlobalMsgContext);

  let navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState();
  let [allCategories, setAllCategories] = useState();
  let [allFactoryProducts, setFactoryProducts] = useState();
  const [isLoading, setIsLoading] = useState(false);

  //   get  and categrories
  useEffect(() => {
    GetCategories();
  }, []);

  useEffect(() => {
    getFactoryProduct();
  }, [currentUserData?.factoryId]);

  async function GetCategories() {
    let config = {
      method: "get",

      url: `${baseUrl}/categories`,

      headers: {
        authorization: isLogin,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.message == "done") {
          setAllCategories(response?.data?.categories);
        } else {
          //   setErrorMsg((prevErrors) => ({
          //     ...prevErrors,
          //     message: response.data.message,
          //   }));
        }
      })
      .catch((error) => {});
  }
  const getFactoryProduct = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/factories/products/${currentUserData?.factoryId}`
      );

      setFactoryProducts(response.data.products);
    } catch (error) {}
  };

  let validationSchema = Yup.object().shape({
    productName: Yup.string()
      .required("Input Field is Required")
      .min(3, "min 3 legnth")
      .max(255, "max 255 legnth"),
    // country: Yup.array().of(Yup.string()).nullable(),
    country: Yup.array().of(Yup.string()).nullable(),

    price: Yup.number("Input Field  must contain numbers only")
      .typeError("Price must be a number")
      .required("Input Field  is required")
      .integer("Input Field  must contain numbers only")
      .positive("Input Field  must contain positive numbers")
      .min(1, "Minimum price length must  be greater than 1")
      .test(
        "is-number",
        "Input Field must contain numbers only",
        (value) => !isNaN(value)
      ),

    //   HSN (Harmonized System of Nomenclature) code field i
    productHSNCode: Yup.string()
      .required("Input Field is Required")
      .min(6, "Minimum  length is 6")
      .max(15, "Maximum 15  is legnth"),

    quantity: Yup.string()
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .required("Input Field is Required")
      .min(1, "Minimum  length is 1"),

    productDescription: Yup.string()
      .required(" productDescription is Requried")

      //
      .max(255, "max legnth is 255"),

    qualityConditions: Yup.string(),
    qualityConditionsOther: Yup.string().when("qualityConditions", {
      is: "other",
      then: (schema) =>
        schema

          .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    packingConditions: Yup.string(),
    packingConditionsOther: Yup.string().when("packingConditions", {
      is: "other",
      then: (schema) =>
        schema

          .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    paymentType: Yup.string(),
    paymentTypeOther: Yup.string().when("paymentType", {
      is: "other",
      then: (schema) =>
        schema

          .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    deliveryTerms: Yup.string(),
    deliveryTermsOther: Yup.string().when("deliveryTerms", {
      is: "other",
      then: (schema) =>
        schema

          .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),
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
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    setIsLoading(true);

    // clear error message
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    // check if the product already is added or no
    if (!productAdded.status) {
      try {
        let data = {
          price: values.price,
          productName: values.productName,
          productDescription: values.productDescription,
          quantity: values.quantity,
          categoryId: values.categoryId,
        };

        if (values.productHSNCode !== "") {
          data.productHSNCode = values.productHSNCode;
        }
        if (values.country.length !== 0) {
          data.preferredCountries = values.country;
        }
        if (values.productId !== "") {
          data.productId = values.productId;
        }
        if (values.shippingConditions !== "") {
          data.shippingConditions = values.shippingConditions;
        }
        if (values.paymentType !== "") {
          data.paymentTerms =
            values.paymentType == "other"
              ? values.paymentTypeOther
              : values.paymentType;
        }

        if (values.packingConditions !== "") {
          data.packingConditions =
            values.packingConditions === "other"
              ? values.packingConditionsOther
              : values.packingConditions;
        }

        if (values.deliveryTerms !== "") {
          data.deliveryTerms =
            values.deliveryTerms === "other"
              ? values.deliveryTermsOther
              : values.deliveryTerms;
        }
        if (values.qualityConditions !== "") {
          data.qualityConditions =
            values.qualityConditions === "other"
              ? values.qualityConditionsOther
              : values.qualityConditions;
        }

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${baseUrl}/sourcingOffers/add`,

          headers: {
            authorization: isLogin,
          },
          data: data,
        };

        const response = await axios.request(config);

        if (response.data.message == "done") {
          setIsLoading(true);

          setProductAdded({
            status: true,
            id: response.data.sourcingOffer.id,
          });

          // setProductID(response.data.sourcingOffer.id);

          setErrorMsg((previousState) => {
            const { message, ...rest } = previousState;
            return rest;
          });

          if (selectedDocs?.length > 0) {
            await SubmitDocs(response.data.sourcingOffer.id);
          } else {
            localStorage.setItem(
              "ToFactoryDahboard",
              "Your sourcing offer Form has been successfully submitted"
            );
            navigate("/factorydashboard/AllFactoryOffers");
          }
        } else {
          setIsLoading(false);

          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            message: response.data.message,
          }));
          return;
        }
      } catch (error) {
        setIsLoading(false);

        if (error.response && error.response.status) {
          const statusCode = error.response.status;
          switch (statusCode) {
            case 400:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message: error?.response?.data?.errorMessage,
              }));
              break;
            case 401:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message: "User is not Unauthorized ",
              }));
              break;
            case 403:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message:
                  "Forbidden, You do not have permission to access this resource.",
              }));
              break;
            case 404:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message:
                  "Not Found (404). The requested resource was not found.",
              }));
              break;

            case 500:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message: error?.response?.data?.errorMessage,
              }));
              break;

            //  429 Too Many Requests
            // The user has sent too many requests in a given amount of time ("rate limiting").
            case 429:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message: " Too Many Requests , Please try again later.",
              }));
              break;
            case 402:
              // 402
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message: error?.response?.data?.message,
              }));
              break;
            default:
              // case message== error
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message: error?.response?.data?.errorMessage,
              }));
              break;
          }
        }
      }
    }

    if (productAdded.status && selectedDocs?.length > 0) {
      SubmitDocs(productAdded.id);
      // updateCoverImage(productID);
    } else {
      localStorage.setItem(
        "ToFactoryDahboard",
        "Your sourcing offer Form has been successfully submitted"
      );
      navigate("/factorydashboard/AllFactoryOffers");
    }
  }

  function SubmitDocs(productId) {
    setIsLoading(true);

    const data = new FormData();

    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

    const config = {
      method: "put",
      url: `${baseUrl}/sourcingOffers/uploadMedia/${productId}`,
      headers: {
        Authorization: isLogin,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.message == "done") {
          // toast("Product added Successfully", {
          //   position: "top-center",
          //   autoClose: 5000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   //pauseOnHover: true,
          //   draggable: true,
          //   theme: "colored",
          //   type: "success",
          // });

          // localStorage("")
          localStorage.setItem(
            "ToFactoryDahboard",
            "Your sourcing offer Form has been successfully submitted"
          );
          navigate("/factorydashboard/AllFactoryOffers");
        } else {
          setIsLoading(false);

          setIsLoading(false);
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            message: response?.data?.message,
          }));
          const targetElement = document.getElementById("view");
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);
        const targetElement = document.getElementById("view");
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

        if (error.response) {
          const statusCode = error.response.status;
          switch (statusCode) {
            case 400:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message: error?.response?.data?.errorMessage,
              }));
              break;
            case 401:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message: "User is not Unauthorized ",
              }));
              break;
            case 403:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message:
                  "Forbidden, You do not have permission to access this resource.",
              }));
              break;
            case 404:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message:
                  "Not Found (404). The requested resource was not found.",
              }));
              break;

            case 500:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message: error?.response?.data?.errorMessage,
              }));
              break;

            //  429 Too Many Requests
            // The user has sent too many requests in a given amount of time ("rate limiting").
            case 429:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message: " Too Many Requests , Please try again later.",
              }));
              break;
            case 402:
              // 402
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message: error?.response?.data?.message,
              }));
              break;
            default:
              // case message== error
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                message: error?.response?.data?.errorMessage,
              }));
              break;
          }
        }
      });
  }

  useEffect(() => {
    if (allCategories?.length !== 0) {
      formValidation.setValues({
        ...formValidation.values,
        categoryId: allCategories?.[0]?.id || "",
      });
    }
  }, [allCategories]);

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
    const count = selectedDocs?.filter(
      (item) => item?.keyWord === "docs"
    )?.length;

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
        <ToastContainer />
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
              {errorMsg?.message && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg.message}
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
                    {allCategories?.map((item) => (
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
                  <label>Quality Conditions</label>

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
                  {isLoading ? (
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
                          targetElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
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
