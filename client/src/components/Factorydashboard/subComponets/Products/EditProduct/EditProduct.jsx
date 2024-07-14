import React, { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate, useParams } from "react-router-dom";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedDash";

export default function EditProduct() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let { productId } = useParams();
  let navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState();
  const [productDetails, setProductDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);

  let [allCategories, setAllCategories] = useState();

  const [selectedDocs, setSelectedDocs] = useState([]);

  // get sectors and categrories
  async function GetCategories() {
    let config = {
      method: "get",

      url: `${baseUrl}/categories?include=sector`,
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

  useEffect(() => {
    GetCategories();
  }, []);
  async function fetchProductData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/products/${productId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setProductDetails(response.data.products);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (productId !== undefined) {
      fetchProductData();
    }
  }, [productId]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  let validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Input Field is Required")
      
      .max(255, "max 255 legnth"),

    price: Yup.string()
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .required("Price is required")
      .min(1, "Minimum price length must  be greater than 1"),

    //   HSN (Harmonized System of Nomenclature) code field i
    hsnCode: Yup.string()
      .required("Input Field is Required")
      .min(6, "Minimum  length is 6")
      .max(15, "Maximum 15  is legnth"),

    //   SKU (Stock Keeping Unit)
    sku: Yup.string()
      .required("Input Field is Required")
      .min(6, "Minimum  length is 6")
      .max(15, "Maximum 15  is legnth"),

    // guarantee\\\" is not allowed to be em

    guarantee: Yup.string()
      .max(255, "max 255 is legnth"),
    minOrderQuantity: Yup.string()
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .required("Input Field is Required")
      .min(1, "Minimum  length is 1"),
    maxOrderQuantity: Yup.string()
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .min(1, "Maximum  length is 1"),

    description: Yup.string()
      .required(" Description is Requried")

      .max(255, "max legnth is 255"),

    specialCharKeyWord: Yup.string()
      // .required("Input field is Required")
      
      .max(50, "max legnth is 50"),

    specialCharDesc: Yup.string().when("specialCharKeyWord", {
      is: (schema) => !!schema,
      then: (schema) =>
        schema
          .required("Input field is Required")
          .max(50, "max length is 50"),
      otherwise: (schema) => schema.nullable(),
    }),
    specialCharacteristicsArr: Yup.array().of(
      Yup.object().shape({
        specialCharKeyWord: Yup.string()
          // .required("Input field is Required")
          // 
          .max(50, "max legnth is 50"),
        specialCharDesc: Yup.string()
          // .required("Input field is Required")
          // 
          .max(50, "max legnth is 50"),
      })
    ),

    friends: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
      })
    ),
  });

  let initialValues = {
    name: productDetails?.name || "",

    price: productDetails?.price || "",
    hsnCode: productDetails?.hsnCode || "",
    sku: productDetails?.sku || "",
    guarantee: productDetails?.guarantee || "",
    minOrderQuantity: productDetails?.minOrderQuantity || "",
    maxOrderQuantity: productDetails?.maxOrderQuantity || "",
    description: productDetails?.description || "",

    //   coverImage: null,
    //   images: null,

    categoryId: productDetails?.categoryId || "",
    sectorId: productDetails?.sectorId || "",

    specialCharacteristicsArr:
      productDetails?.specialCharacteristics &&
      Object.keys(productDetails.specialCharacteristics).length !== 0
        ? // [productDetails.specialCharacteristics]
          Object.entries(productDetails.specialCharacteristics).map(
            ([key, value], index) => ({
              specialCharKeyWord: key,
              specialCharDesc: value,
            })
          )
        : [],
  };

  let formValidation = useFormik({
    initialValues,

    validationSchema,
    // validate,
    onSubmit: submitForm,
  });

  let [productAdded, setProductAdded] = useState(false);
  let [productID, setProductID] = useState();

  async function submitForm(values) {
    setIsLoading(true);

    const existingImageIndex = selectedDocs?.some(
      (item) => item?.keyWord === "coverImage"
    );

    // The "coverImage" does not exist in the selectedDocs array
    if (!existingImageIndex) {
      setIsLoading(false);

      // The "coverImage" exists in the selectedDocs array
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        message: "Cover image is required",
      }));
      const targetElement = document.getElementById("view");
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return setIsLoading(false);
    }

    // clear error message
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    // check if the product already is added or no
    if (!productAdded) {
      try {
        let data = {
          country: values.country,
          city: values.city,
          name: values.name,

          categoryId: values.categoryId,
          sectorId: values.sectorId,

          description: values.description,
          price: values.price,
          hsnCode: values.hsnCode,
          sku: values.sku,
          minOrderQuantity: values.minOrderQuantity,

          specialCharacteristics: {},
        };

        if (values.guarantee !== "") {
          data.guarantee = values.guarantee;
        }

        if (values.maxOrderQuantity !== "") {
          data.maxOrderQuantity = values.maxOrderQuantity;
        }

        // if (specialCharacteristicsArr?.length > 0) {
        //   specialCharacteristicsArr.forEach((index) => {
        //     const key = values[`specialCharKeyWord${index}`];
        //     const desc = values[`specialCharDesc${index}`];
        //     data.specialCharacteristics[key] = desc;
        //   });
        // }

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${baseUrl}/products/add`,

          headers: {
            authorization: isLogin,
          },
          data: data,
        };

        const response = await axios.request(config);

        if (response.data.message == "done") {
          setErrorMsg((previousState) => {
            const { message, ...rest } = previousState;
            return rest;
          });
          setProductID(response.data.product.id);
          setProductAdded(true);
          setIsLoading(true);

          updateCoverImage(response.data.product.id);
        } else {
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            message: response.data.message,
          }));
          return;
        }

        const targetElement = document.getElementById("view");
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setIsLoading(false);
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
                  // "Forbidden, You do not have permission to access this resource.",
                  // error?.response?.data?.message,
                  "factory is not verified Yet or factory representive Email is not activated",
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
        } else {
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            message: "An unexpected error occurred. Please try again later.",
          }));
        }

        // setErrorMsg((prevErrors) => ({
        //   ...prevErrors,
        //   message: error.response.data.errorMessage,
        // }));
        // return;
      }
    }

    if (productAdded && selectedDocs?.length > 0) {
      setIsLoading(true);
      updateCoverImage(productID);
    }
  }

  function updateCoverImage(productId) {
    // e.preventDefault();

    const data = new FormData();

    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

    const config = {
      method: "put",
      url: `${baseUrl}/products/uploadMedia/${productId}`,
      headers: {
        Authorization: isLogin,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.message == "done") {
          setIsLoading(true);

          localStorage.setItem(
            "ToFactoryDahboard",
            "Product added Successfully"
          );

          navigate("/factorydashboard/AllFactoryProducts");
        } else {
          setIsLoading(false);
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            response: response?.data?.message,
          }));
          const targetElement = document.getElementById("view");
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      })

      .catch((error) => {
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
        } else {
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            message: "An unexpected error occurred. Please try again later.",
          }));
        }
      });
  }

  useEffect(() => {
    if (productDetails && productDetails.length !== 0) {
      formValidation.setValues(initialValues);
    }
  }, [productDetails]);

  function removeSelectedDoc(docId, keyWordDoc) {
    // when removing
    setSelectedDocs((prevValue) =>
      prevValue?.filter(
        (doc) => !(doc?.pdfFile?.name === docId && doc?.keyWord === keyWordDoc)
      )
    );
  }

  if (
    currentUserData?.factoryVerified == "0" ||
    currentUserData?.factoryEmailActivated == false
  ) {
    return <FactoryUnVerified />;
  }

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

  return (
    <>
      <div id="view" className="m-4 order-section  ">
        <ToastContainer />
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
              {errorMsg?.message && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg.message}
                </div>
              )}
              <div className="col-4">
                <div className="form-group">
                  <label>
                    Product Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    id="name"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.name}
                  />
                  {formValidation.errors.name && formValidation.touched.name ? (
                    <small className="text-danger">
                      {formValidation.errors.name}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>Sector</label>

                  <select
                    className="form-select form-control py-2"
                    onChange={formValidation.handleChange}
                    id="sectorId"
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.sectorId}
                    onClick={(e) => {
                      let selectedProductName = "";
                      allCategories.find(
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
                    {allCategories?.map((item) => (
                      // <option value={item?.id}>{item?.name}</option>

                      <optgroup label={item?.name}>
                        <option value={item?.sector?.id}>
                          {item?.sector?.name}
                        </option>
                      </optgroup>
                    ))}
                  </select>

                  {/* <div class="dropdown">
                    <label for="nestedDropdown">Nested Dropdown:</label>
                    <select id="nestedDropdown">
                      <optgroup label="Option 1">
                        <option value="subOption1">Sub Option 1</option>
                        <option value="subOption2">Sub Option 2</option>
                      </optgroup>
                      <optgroup label="Option 2">
                        <option value="subOption3">Sub Option 3</option>
                        <option value="subOption4">Sub Option 4</option>
                      </optgroup>
                      <optgroup label="Option 3">
                        <option value="subOption5">Sub Option 5</option>
                        <option value="subOption6">Sub Option 6</option>
                      </optgroup>
                    </select>
                  </div> */}
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>
                    Price <span className="text-danger">*</span>
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
                    hsn Code <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    id="hsnCode"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.hsnCode}
                  />
                  {formValidation.errors.hsnCode &&
                  formValidation.touched.hsnCode ? (
                    <small className="text-danger">
                      {formValidation.errors.hsnCode}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>
                    Sku <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    id="sku"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.sku}
                  />
                  {formValidation.errors.sku && formValidation.touched.sku ? (
                    <small className="text-danger">
                      {formValidation.errors.sku}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>guarantee </label>
                  <input
                    className="form-control"
                    id="guarantee"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.guarantee}
                  />
                  {formValidation.errors.guarantee &&
                  formValidation.touched.guarantee ? (
                    <small className="text-danger">
                      {formValidation.errors.guarantee}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>
                    min Order Quantity <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    id="minOrderQuantity"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.minOrderQuantity}
                  />
                  {formValidation.errors.minOrderQuantity &&
                  formValidation.touched.minOrderQuantity ? (
                    <small className="text-danger">
                      {formValidation.errors.minOrderQuantity}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>Max Order Quantity </label>
                  <input
                    className="form-control"
                    id="maxOrderQuantity"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.maxOrderQuantity}
                  />
                  {formValidation.errors.maxOrderQuantity &&
                  formValidation.touched.maxOrderQuantity ? (
                    <small className="text-danger">
                      {formValidation.errors.maxOrderQuantity}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* ---------------------------- */}

              <div className="col-12 ">
                {/* <div className="form-group form-control "> */}
                <div className="form-group form-control ">
                  <div className="form-group timeline-container ">
                    {/* <label> Timeline</label> */}

                    <label forhtml="">
                      Product Characteristics
                      {
                        formValidation?.values?.specialCharacteristicsArr[0]
                          ?.specialCharKeyWord
                      }
                    </label>

                    {formValidation?.values?.specialCharacteristicsArr?.length >
                    0
                      ? formValidation?.values?.specialCharacteristicsArr?.map(
                          (dateSection, index) => (
                            <>
                              <div className="  timeline form-control checked d-flex justify-content-between align-content-center ">
                                <div className="row w-100 ">
                                  <div className="form-group  col-6 col-6-50  ">
                                    <label forhtml="specialCharKeyWord">
                                      Keyword {index + 1}*
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      onChange={formValidation.handleChange}
                                      onBlur={formValidation.handleBlur}
                                      id={
                                        formValidation.values
                                          .specialCharacteristicsArr[index]
                                          ?.specialCharKeyWord
                                      }
                                      value={
                                        formValidation.values
                                          .specialCharacteristicsArr[index]
                                          ?.specialCharKeyWord
                                      }
                                    />
                                    {formValidation.errors[
                                      `specialCharKeyWord${index}`
                                    ] &&
                                    formValidation.touched[
                                      `specialCharKeyWord${index}`
                                    ] ? (
                                      <small className="form-text text-danger">
                                        {
                                          formValidation.errors[
                                            `specialCharKeyWord${index}`
                                          ]
                                        }
                                      </small>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div
                                    className={`form-group    ${
                                      formValidation?.specialCharacteristicsArr
                                        ?.length -
                                        1 ===
                                      index
                                        ? "col-5"
                                        : " col-6 col-6-50 "
                                    }`}
                                  >
                                    <label forhtml="specialCharDesc">
                                      description {index + 1}*
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id={`specialCharDesc${index}`}
                                      placeholder="Enter Quantity"
                                      onChange={formValidation.handleChange}
                                      onBlur={formValidation.handleBlur}
                                      value={
                                        formValidation.values[
                                          `specialCharDesc${index}`
                                        ]
                                      }
                                    />
                                    {formValidation.errors[
                                      `specialCharDesc${index}`
                                    ] &&
                                    formValidation.touched[
                                      `specialCharDesc${index}`
                                    ] ? (
                                      <small className="form-text text-danger">
                                        {
                                          formValidation.errors[
                                            `specialCharDesc${index}`
                                          ]
                                        }
                                      </small>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  {formValidation?.specialCharacteristicsArr
                                    ?.length -
                                    1 ===
                                  index ? (
                                    <div className=" col-1 h-100 justify-content-center align-items-center d-flex   pt-4">
                                      <i
                                        class=" cursor fa-solid fa-minus text-white px-3 py-2"
                                        // onClick={() => removenewSepcialChar()}
                                      ></i>
                                      {/* {dateSection} */}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </>
                          )
                        )
                      : ""}

                    {formValidation?.specialCharacteristicsArr?.length < 4 ? (
                      <div className="action ">
                        <div
                          className="cursor"
                          // onClick={() => addnewSepcialChar()}
                        >
                          <button className="action-btn btn-1 " type="button">
                            add
                          </button>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              {/* ----------------------------------------- */}
              <div className="col-12">
                <div className="form-group gap">
                  <label className="form-title">Upload Images </label>
                  <label
                    className="mb-0 drop-drag-area  p-5 text-center cursor w-100 "
                    htmlFor="imagesInput"
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = e?.dataTransfer?.files;
                      if (files && files.length > 0) {
                        handleMultiMediaValidation(files?.[0], "images");
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
                        handleMultiMediaValidation(files?.[0], "images");
                      }
                    }}
                  >
                    Drag and drop files here or click to select files
                    <input
                      type="file"
                      id="imagesInput"
                      // className="d-none"
                      hidden
                      onChange={(e) => {
                        const files = e.target.files;

                        if (files && files?.length > 0) {
                          handleMultiMediaValidation(files?.[0], "images");
                        }
                      }}
                      multiple
                    />
                  </label>
                  <small className="form-text small-note">
                    Only pdf, png, jpeg, and jpg are allowed. A maximum of 3
                    pictures is permitted.
                  </small>

                  <small className="text-danger">{errorMsg?.images}</small>

                  {/* <div className=" row w-100 "> */}
                  {selectedDocs.map(
                    (item, index) =>
                      // <div className="col-12">
                      item.keyWord === "images" && (
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
                                      "images",
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

              {/* ------------------------------------------ */}

              <div className="col-12">
                <div className="form-group gap">
                  <label className="form-title">
                    Upload coverImage <span className="text-danger">*</span>
                  </label>
                  <label
                    className="mb-0 drop-drag-area  p-5 text-center cursor w-100 "
                    htmlFor="coverImageInput"
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = e?.dataTransfer?.files;
                      if (files && files.length > 0) {
                        handleMultiMediaValidation(files?.[0], "coverImage");
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
                        handleMultiMediaValidation(files?.[0], "coverImage");
                      }
                    }}
                  >
                    Drag and drop files here or click to select files
                    <input
                      type="file"
                      id="coverImageInput"
                      // className="d-none"
                      hidden
                      onChange={(e) => {
                        const files = e.target.files;

                        if (files && files?.length > 0) {
                          handleMultiMediaValidation(files?.[0], "coverImage");
                        }
                      }}
                      multiple
                    />
                  </label>
                  <small className="form-text small-note">
                    Only pdf, png, jpeg, and jpg are allowed. A maximum of 3
                    pictures is permitted.
                  </small>

                  <small className="text-danger">{errorMsg?.coverImage}</small>

                  {/* <div className=" row w-100 "> */}
                  {selectedDocs.map(
                    (item, index) =>
                      // <div className="col-12">
                      item.keyWord === "coverImage" && (
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
                                      "coverImage",
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
              {/* ------------------------------------------ */}

              <div className="col-12">
                <div className="form-group">
                  <label>
                    description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
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

                          // Scroll to the target element
                          targetElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
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
