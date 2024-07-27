import { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "config.js";
import { GlobalMsgContext } from "Context/globalMessage";
import useCategories from "hooks/useCategory";
import "./AddProduct.css";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import LoadingProccess from "components/Shared/Dashboards/LoadingProccess";

import { useNavigate } from "react-router-dom";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedDash";
import UploadDocument from "components/Forms/Shared/UploadDocument";
import TextareaInput from "components/Forms/Shared/TextareaInput";
import SpecialChar from "components/Forms/Shared/SpecialChar/SpecialChar";

export default function AddProduct() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let { setGlobalMsg } = useContext(GlobalMsgContext);
  let categories = useCategories();

  let navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);

  let [factoryDetails, setFactoryDetails] = useState();
  const [specialCharacteristicsArr, SetSpecialCharacteristicsArr] = useState(
    []
  );

  const [selectedDocs, setSelectedDocs] = useState([]);

  // get sectors and categrories

  async function fetchFactoryData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/${currentUserData.factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.factories);
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (currentUserData.factoryId !== undefined) {
      fetchFactoryData();
    }
  }, [currentUserData?.factoryId]);
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

    // guarantee\\\" is not allowed to be em

    guarantee: Yup.string().max(255, "max 255 is legnth"),
    minOrderQuantity: Yup.string()
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .required("Input Field is Required")
      .min(1, "Minimum  length is 1"),
    maxOrderQuantity: Yup.string()
      .matches(/^[0-9]+$/, "Input Field should contain numbers only")
      .min(1, "Maximum  length is 1"),
    categoryId: Yup.string().required("Input Field is Required"),
    sectorId: Yup.string().required("Input Field is Required"),

    description: Yup.string()
      .required(" Description is Requried")

      .max(255, "max legnth is 255"),

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
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

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
          name: values.name,

          categoryId: values.categoryId,
          sectorId: values.sectorId,

          description: values.description,
          price: values.price,
          hsnCode: values.hsnCode,
          minOrderQuantity: values.minOrderQuantity,

          specialCharacteristics: {},

          ...(values.city && { city: values.city }),
        };

        if (values.guarantee !== "") {
          data.guarantee = values.guarantee;
        }

        if (values.maxOrderQuantity !== "") {
          data.maxOrderQuantity = values.maxOrderQuantity;
        }

        if (Object.keys(values.productCharacteristic).length != 0) {
          // create an object with the keyword property as the key and the value property as the value.
          const obj = Object.fromEntries(
            values.productCharacteristic.map((obj) => [obj.keyword, obj.value])
          );
          data.specialCharacteristics = obj;
        }

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
          setIsLoading(false);
          const targetElement = document.getElementById("view");
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }

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

          setGlobalMsg("Product added Successfully");

          navigate("/factorydashboard/AllFactoryProducts");
        } else {
          setIsLoading(false);
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            response: response?.data?.message,
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
        // toast("Image Not Saved, please try again", {
        //   position: "top-center",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   draggable: true,
        //   theme: "colored",
        //   type: "error",
        // });
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
    if (factoryDetails && factoryDetails.length !== 0) {
      formValidation.setValues((prevValues) => ({
        ...prevValues,
        city: factoryDetails?.city || "",
        country: factoryDetails?.country || "",
      }));
    }
  }, [factoryDetails]);

  function addnewSepcialChar() {
    SetSpecialCharacteristicsArr((prevSections) => {
      // Ensure prevSections is an array
      const sectionsArray = Array.isArray(prevSections) ? prevSections : [];

      // Return the updated array with the new section
      return [...sectionsArray, specialCharacteristicsArr?.length];
    });
  }

  function removenewSepcialChar() {
    SetSpecialCharacteristicsArr((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections.pop(); // Remove the last item
      return updatedSections;
    });
  }

  // if (
  //   currentUserData?.factoryVerified == "0" ||
  //   currentUserData?.factoryEmailActivated == false
  // ) {
  //   return <FactoryUnVerified />;
  // }

  console.log("formValidation", formValidation, setErrorMsg);
  console.log("console trals");
  return (
    <>
      <LoadingProccess show={isLoading} />

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
                    <optgroup value="">
                      select
                      <option value="">select</option>
                    </optgroup>
                    {categories?.map((item) => (
                      <optgroup label={item?.name}>
                        <option value={item?.sector?.id}>
                          {item?.sector?.name}
                        </option>
                      </optgroup>
                    ))}
                  </select>
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
              <div className="col-12 ms-3 ">
                <div className="border-row row">
                  <div>
                    <label className="pb-2">Product Characteristics</label>
                  </div>

                  <SpecialChar formValidation={formValidation} />
                </div>
              </div>

              {/* ----------------------------------------- */}

              <UploadDocument
                selectedDocs={selectedDocs}
                errorMsg={errorMsg}
                setSelectedDocs={setSelectedDocs}
                MediaName="images"
                mediaMaxLen="3"
                meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
                setErrorMsg={setErrorMsg}
                title="Upload Images *"
              />

              <UploadDocument
                selectedDocs={selectedDocs}
                errorMsg={errorMsg}
                setSelectedDocs={setSelectedDocs}
                MediaName="coverImage"
                mediaMaxLen="3"
                meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                setErrorMsg={setErrorMsg}
                title="Upload coverImage *"
              />

              <TextareaInput
                vlaidationName="description"
                formValidation={formValidation}
                isRequired={true}
                title="description"
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
