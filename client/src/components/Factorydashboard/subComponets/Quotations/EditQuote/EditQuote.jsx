import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// auth
import { baseUrl } from "config.js";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { GlobalMsgContext } from "Context/globalMessage";

// verififcation
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerifiedDash/FactoryUnVerifiedDash";

// constant
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { paymentTypeArr } from "constants/paymentTypeArr";
import { packingConditionsArr } from "constants/packingConditionsArr";

// functions
import { formattedDateValidate } from "utils/validationUtils";
import { errorHandler } from "utils/errorHandler";
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";

export default function EditQuote() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);
  // console.log("pathname", pathname);

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let { setGlobalMsg } = useContext(GlobalMsgContext);

  let { quoteId } = useParams();
  let navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState();
  const [apiDetails, setApiDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDocs, setSelectedDocs] = useState([]);

  // get sectors and categrories

  async function fetchRequestData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/quotations/${quoteId}`,
      };

      const response = await axios.request(config);
      if (response.data.message == "done") {
        setApiDetails(response.data.quotations);
        // setSelectedDocs(response.data.quotations?.docs)
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (quoteId !== undefined) {
      fetchRequestData();
    }
  }, [quoteId]);

  let validationSchema = Yup.object().shape({
    discounts: Yup.string()
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    minQuantity: Yup.string()
      .required("Input field is Required")
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    notes: Yup.string()
      .required(" Description is Requried")
      .max(255, "max legnth is 255"),

    price: Yup.string()
      .required("Input field is Required")
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    qualityConditions: Yup.string(),
    qualityConditionsOther: Yup.string().when("qualityConditions", {
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

    packingConditions: Yup.string(),
    packingConditionsOther: Yup.string().when("packingConditions", {
      is: "other",
      then: (schema) =>
        schema
          .max(255, "max legnth is 255")
          .required("Input field is Required"),
      otherwise: (schema) => schema.nullable(),
    }),

    startDeliveryDate: Yup.date().min(formattedDateValidate, "Invalid Date"),
    endDeliveryDate: Yup.date().min(formattedDateValidate, "Invalid Date"),
  });

  let initialValues = {
    price: apiDetails?.price || "",
    discounts: apiDetails?.discounts || 0,

    minQuantity: apiDetails?.minQuantity || "",

    // qualityConditions: apiDetails?.qualityConditions || "",
    // qualityConditionsOther:"",
    // paymentType: apiDetails?.paymentTerms || "",
    // paymentTypeOther:""
    // packingConditions: apiDetails?.packingConditions, //req

    shippingConditions: apiDetails?.shippingConditions || "",

    notes: apiDetails?.notes || "",

    //  cant be edited => it depends on the name saved in product is && its used in filtering data
    // productName: apiDetails?.productName || "",

    startDeliveryDate: apiDetails?.timeForDelivery?.start || "",
    endDeliveryDate: apiDetails?.timeForDelivery?.end || "",
  };

  let formValidation = useFormik({
    initialValues,
    validationSchema,
    // validate,
    // onSubmit: submitForm,
    onSubmit: newNn,
  });

  function newNn(textValue) {
    setIsLoading(true);

    // clear error message
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    // text daTA
    let data = {
      minQuantity: textValue.minQuantity,
      price: textValue.price,

      qualityConditions:
        textValue.qualityConditions == "other"
          ? textValue.qualityConditionsOther
          : textValue.qualityConditions,

      shippingConditions: textValue.shippingConditions,

      packingConditions:
        textValue.packingConditions === "other"
          ? textValue.packingConditionsOther
          : textValue.packingConditions,

      paymentTerms:
        textValue.paymentType == "other"
          ? textValue.paymentTypeOther
          : textValue.paymentType,

      // timeForDelivery: apiDetails?.timeForDelivery,
      notes: textValue.notes,
      // discounts : textValue.discounts,
      timeForDelivery: {
        start: textValue.startDeliveryDate,
        end: textValue.endDeliveryDate,
      },
      discounts: textValue.discounts,
    };
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${baseUrl}/quotations/${apiDetails?.id}`,

      headers: {
        authorization: isLogin,
      },
      data: data,
    };

    // media data
    const mediaData = new FormData();

    selectedDocs?.map((item) => mediaData.append(item.keyWord, item.pdfFile));

    const mediaConfig = {
      method: "put",
      url: `${baseUrl}/quotations/uploadMedia/${apiDetails?.id}`,
      headers: {
        Authorization: isLogin,
      },
      data: mediaData,
    };

    axios
      .all([
        axios(config),
        // axios(mediaConfig),
      ])
      .then(
        axios.spread((response1, response2) => {
          const dataFromAPI1 = response1.data;
          // const dataFromAPI2 = response2.data;

          // Handle responses from both APIs
          console.log("Data from API 1:", dataFromAPI1);
          // console.log("Data from API 2:", dataFromAPI2);

          if (
            response1.data.message == "done"
            // &&
            // response2.data.message == "done"
          ) {
            // console.log("response.data", response.data);
            setErrorMsg((previousState) => {
              const { message, ...rest } = previousState;
              return rest;
            });
            setIsLoading(true);
            setGlobalMsg("Quotation is updated Successfully");

            navigate(-2);
          } else {
            setIsLoading(false);
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              message: response1.data.message,
            }));
            // return;
          }
          const targetElement = document.getElementById("view");
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // setIsLoading(false);
        })
      )
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
        console.log("error", error);

        setIsLoading(false);

        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          message: errorHandler(error),
        }));
        const targetElement = document.getElementById("view");
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
  }

  useEffect(() => {
    if (apiDetails && apiDetails.length !== 0) {
      // quality
      const matchingItem = qualityConditionsArr?.find(
        (item) => item.value === apiDetails?.qualityConditions
      );
      let nameIfValueIsTrue = {
        qualityConditions: apiDetails?.qualityConditions || "",
        qualityConditionsOther: "",
      };

      if (!matchingItem) {
        nameIfValueIsTrue = {
          qualityConditions: "other",
          qualityConditionsOther: apiDetails?.qualityConditions || "",
        };
      }

      // check if payment value is set to a option "value" || or option others
      // if option others: then set paymentType value to "other" && set paymentTypeOther to the paymentType value that is coming from the database
      const initalPaymentType = paymentTypeArr?.find(
        (item) => item.value === apiDetails?.paymentType
      );
      let paymentVal = {
        // if packging condition is null   || value is not selection on option "others"

        paymentType: apiDetails?.paymentType || "",
        paymentTypeOther: "",
      };
      if (!initalPaymentType) {
        // means that data is selected to option others

        paymentVal = {
          paymentType: "other",
          paymentTypeOther: apiDetails?.paymentTerms || "",
        };
      }

      // packing condition
      const initalPackingConditions = packingConditionsArr?.find(
        (item) => item.value === apiDetails?.packingConditions
      );
      let PackingCondVal = {
        // if packging condition is null   || value is not selection on option "others"
        packingConditions: apiDetails?.packingConditions || "",
        packingConditionsOther: "",
      };
      if (!initalPackingConditions) {
        // means that data is selected to option others
        PackingCondVal = {
          packingConditions: "other",
          packingConditionsOther: apiDetails?.packingConditions || "",
        };
      }
      initialValues = {
        ...initialValues,
        ...PackingCondVal,
        ...paymentVal,
        ...nameIfValueIsTrue,
      };

      formValidation.setValues(initialValues);
    }
  }, [apiDetails]);

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

  // Remove unwanted image
  function removeSelectedDoc(indexToRemove) {
    // let updatedDocs = [...selectedDocs];
    // updatedDocs.splice(index, 1);

    // return updatedDocs;

    setSelectedDocs((prevSelectedDocs) => {
      // Create a new array without the item at the specified index
      const updatedSelectedDocs = [
        ...prevSelectedDocs.slice(0, indexToRemove),
        ...prevSelectedDocs.slice(indexToRemove + 1),
      ];
      return updatedSelectedDocs;
    });
  }

  return (
    <div id="view" className="m-4 order-section  ">
      <SubPageUtility
        currentPage="More Details"
        PrevPage="Private Label Details"
      />
      <ToastContainer />
      {/* section 1 */}
      <form onSubmit={formValidation.handleSubmit} className="header w-100">
        {/* <form className="header w-100"> */}
        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Edit Quotation</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => navigate("/factorydashboard/quotations")}
              >
                <p className="cursor">All Quotations</p>
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
                <label forhtml="minQuantity">
                  minQuantity <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="minQuantity"
                  name="minQuantity"
                  placeholder="Enter minQuantity"
                  onChange={formValidation.handleChange}
                  onBlur={formValidation.handleBlur}
                  value={formValidation.values.minQuantity}
                />
                {formValidation.errors.minQuantity &&
                formValidation.touched.minQuantity ? (
                  <small className="form-text text-danger">
                    {formValidation.errors.minQuantity}
                  </small>
                ) : (
                  ""
                )}
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
                {formValidation.errors.price && formValidation.touched.price ? (
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
                <label>Discounts</label>
                <input
                  className="form-control"
                  id="discounts"
                  onChange={formValidation.handleChange}
                  onBlur={formValidation.handleBlur}
                  value={formValidation.values.discounts}
                />
                {formValidation.errors.discounts &&
                formValidation.touched.discounts ? (
                  <small className="text-danger">
                    {formValidation.errors.discounts}
                  </small>
                ) : (
                  ""
                )}
              </div>
            </div>

            {/* ---------------------------- */}

            <div className="col-4">
              <div className="form-group">
                <label htmlFor="qualityConditions">
                  Quality Conditions <span className="text-danger">*</span>
                </label>

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
                <label htmlFor="paymentType">
                  payment Term <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select form-control"
                  id="paymentType"
                  name="paymentType"
                  onChange={formValidation.handleChange}
                  onBlur={formValidation.handleBlur}
                  value={formValidation.values.paymentType}
                >
                  {paymentTypeArr.map((item) => (
                    <option value={item?.value}>{item?.name}</option>
                  ))}
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
                <label htmlFor="packingConditions">
                  Packing condition <span className="text-danger">*</span>
                </label>
                <select
                  id="packingConditions"
                  name="packingConditions"
                  className="form-select form-control"
                  onChange={formValidation.handleChange}
                  onBlur={formValidation.handleBlur}
                  value={formValidation.values.packingConditions}
                >
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

            <div className="col-4">
              <div className="form-group">
                <label htmlFor="shippingConditions">shipping conditions</label>
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

            {/*  */}
            <div className="col-4">
              <div className="form-group">
                <label forhtml="startDeliveryDate">Start Deadline</label>
                <input
                  type="datetime-local"
                  className="form-control d-block"
                  id="startDeliveryDate"
                  name="startDeliveryDate"
                  onChange={formValidation.handleChange}
                  onBlur={formValidation.handleBlur}
                  value={formValidation.values.startDeliveryDate}
                />
                {formValidation.errors.startDeliveryDate &&
                formValidation.touched.startDeliveryDate ? (
                  <small className="form-text text-danger">
                    {formValidation.errors.startDeliveryDate}
                  </small>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="col-4">
              <div className="form-group">
                <label forhtml="endDeliveryDate">end Deadline</label>
                <input
                  type="datetime-local"
                  className="form-control d-block"
                  id="endDeliveryDate"
                  name="endDeliveryDate"
                  onChange={formValidation.handleChange}
                  onBlur={formValidation.handleBlur}
                  value={formValidation.values.endDeliveryDate}
                />
                {formValidation.errors.endDeliveryDate &&
                formValidation.touched.endDeliveryDate ? (
                  <small className="form-text text-danger">
                    {formValidation.errors.endDeliveryDate}
                  </small>
                ) : (
                  ""
                )}
              </div>
            </div>

            {/*  */}
            {/* ----------------------------------------- */}

            {/* ------------------------------------------ */}

            <div className="col-12">
              <div className="form-group">
                <label>
                  More Details <span className="text-danger">*</span>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="notes"
                  onChange={formValidation.handleChange}
                  onBlur={formValidation.handleBlur}
                  value={formValidation.values.notes}
                ></textarea>
                {formValidation.errors.notes && formValidation.touched.notes ? (
                  <small className="text-danger">
                    {formValidation.errors.notes}
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
                    <p className="cursor">Save Changes</p>
                  </button>
                )}
              </div>
            </div>

            <div className="col-12 d-none">
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
                                  {(item?.pdfFile?.size / 1024)?.toFixed(2)} KB
                                </p>
                                {/* {imgloadin} */}
                              </div>

                              <div
                                onClick={() => removeSelectedDoc(index)}
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
          </div>
        </div>
        {/* ------------ */}
      </form>
    </div>
  );
}
