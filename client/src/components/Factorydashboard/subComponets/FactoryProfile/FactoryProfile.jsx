import React, { useEffect, useState, useContext, useReducer } from "react";
import axios from "axios";
import { baseUrl } from "config.js";
import { errorHandler } from "utils/errorHandler";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { pdfIcon } from "constants/Images";
import PageUtility from "components/Shared/Dashboards/PageUtility";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import "./FactoryProfile.css";
import { handleImageError } from "utils/ImgNotFound";
import { countriesMiddleEast } from "constants/countries";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOutletContext } from "react-router-dom";

import Password from "./subComponents/Password/Password";
import AccountInformation from "./subComponents/AccountInformation";
import SubscriptionPlan from "./subComponents/SubscriptionPlan";
import LegalDocuments from "./subComponents/LegalDocuments";

export default function FactoryProfile() {
  document.title = "Factory Profile";
  let { currentUserData } = useContext(userDetails);

  const [activeMenu] = useOutletContext();
  let { isLogin, setIsLogin } = useContext(UserToken);
  const setFactoryProfile = [];
  const reducer = (state, action) => {
    switch (action.type) {
      case "fetched_update_data":
        return {
          ...state,
          ...action.value,
        };

      case "update_image":
        return {
          ...state,
          legalDocs: action.value,
        };

      default:
        return state;
    }
  };

  const [factoryProfile, dispatch] = useReducer(reducer, setFactoryProfile);

  const [isLoading, setIsLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState();

  // slider setting

  const [selectedDocs, setSelectedDocs] = useState([
    // {
    //   keyWord: null,
    //   pdfFile: null,
    // blob:
    // },
  ]);

  function handleMultiMediaValidation(e, keyWordDoc, inputValue) {
    const count = selectedDocs?.filter(
      (item) => item?.keyWord === keyWordDoc
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
    let acceptedExtensions = [];

    if (keyWordDoc == "legalDocs") {
      acceptedExtensions = ["pdf", "png", "jpeg", "jpg"];
    }

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
      const coverImgInput = document?.getElementById(inputValue);
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

  function removeSelectedDoc(index) {
    let updatedDocs = [...selectedDocs];
    updatedDocs.splice(index, 1);
    setSelectedDocs(updatedDocs);
  }

  // api
  async function fetchFactoryPage() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/${currentUserData.factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        dispatch({
          type: "fetched_update_data",
          value: response.data.factories,
        });
      } else if (response.data.message == "404 Not Found") {
        // errorMsg("404");
      }
    } catch (error) {}
  }

  // Cover IMage Profile -----------------------------------------------------
  function updateMedia(e) {
    setIsLoading(true);

    e.preventDefault();

    const data = new FormData();

    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

    const config = {
      method: "put",
      url: `${baseUrl}/factories/media`,
      headers: {
        Authorization: isLogin,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.message == "done") {
          ModalClose();

          // setShow((prevVal) => ({
          //   ...prevVal,
          //   prevVal: false,
          // }));
          toast("Image Saved Successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            //pauseOnHover: true,
            draggable: true,
            theme: "colored",
            type: "success",
          });
          dispatch({
            type: "update_image",
            value: response?.data?.factory?.legalDocs,
          });
          //
          setSelectedDocs([]);
          setIsLoading(false);
        } else {
          setIsLoading(false);

          toast("Image Not Saved, please try again", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            // progress: undefined,
            theme: "colored",
            type: "error",
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);

        toast("Image Not Saved, please try again", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          // progress: undefined,
          theme: "colored",
          type: "error",
        });
      });
  }

  useEffect(() => {
    fetchFactoryPage();
  }, [currentUserData?.factoryId]);

  // update data
  let emailValidation = Yup.string()
    .email("Invalid email")
    .required("Input Field is Required")
    .min(5, "min length is 5")
    .max(255, "max length is 255");

  let nameValidation = Yup.string()
    .required("Input Field is Required")
    .min(3, "min length is 3")
    .max(25, "max length is 25");
  let phoneValidation = Yup.string()
    .required("Input Field is Required")
    .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(6, "min length is 6")
    .max(15, "max length is 15");

  const [show, setShow] = useState({
    accountInfoReadOnly: false,
    passwordChangeReadOnly: false,
    legalDocsReadOnly: false,
  });
  function ModalClose() {
    setShow((prevVal) => {
      const newState = { ...prevVal }; // Create a copy of the previous state

      // Iterate through the keys in the state
      Object.keys(newState).forEach((key) => {
        newState[key] = false; // Set each property to false
      });

      return newState; // Return the updated state
    });
  }
  let initialAccountInfo = {
    //----------------- Account Info
    repFirstName: factoryProfile?.repName?.[0] || "",
    repLastName: factoryProfile?.repName?.[1] || "",

    repEmail: factoryProfile?.repEmail || "",

    repPhoneCode:
      factoryProfile?.repPhone?.slice(0, 3) ||
      countriesMiddleEast?.[0]?.phoneCode,
    repPhone: factoryProfile?.repPhone?.slice(3) || "",
  };

  // -------------------------------------------------------
  let AccountInfoValidation = useFormik({
    initialValues: initialAccountInfo,

    validationSchema: Yup.object().shape({
      repFirstName: nameValidation,
      repLastName: nameValidation,

      repEmail: emailValidation,

      repPhone: phoneValidation,
    }),
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    //
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });
    let data = {};
    // cotinue
    if (show?.accountInfoReadOnly) {
      // if (factoryProfile?.repName !== values.repName) {
      data.repName = [values.repFirstName, values.repLastName];
      // }

      // update only if there is a change because
      // if email changes the user must get confirmation from admin again
      if (factoryProfile?.repEmail !== values.repEmail) {
        data.repEmail = values.repEmail;
      }

      if (factoryProfile?.repPhone !== values.repPhone) {
        data.repPhone = `${values.repPhoneCode}${values.repPhone}`;
      }
    } else {
      data = {
        allowEmailNotification: !factoryProfile?.allowEmailNotification,
      };
    }

    try {
      setIsLoading(true);
      let config = {
        method: "put",
        url: `${baseUrl}/factories/update/fromUser`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);
      setIsLoading(false);

      if (response.data.message == "done") {
        ModalClose();
        toast("Data added Successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          //pauseOnHover: true,
          draggable: true,
          // progress: undefined,
          theme: "colored",
          type: "success",
        });

        dispatch({
          type: "fetched_update_data",
          value: data,
        });
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response?.data?.message,
        }));
      }
    } catch (error) {
      window.scrollTo({ top: 1642.4000244140625 });
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: errorHandler(error),
      }));
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (factoryProfile && factoryProfile.length !== 0) {
      AccountInfoValidation.setValues(initialAccountInfo);
    }
  }, [factoryProfile]);

  useEffect(() => {
    // used to highlight the current btn
    const hash = window.location.hash;

    // Check if there is a hash in the URL
    if (hash) {
      // Remove the '#' character to get the ID
      const targetId = hash.substring(1);

      // Get the target element by ID
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [activeMenu]);

  function handleClose(value) {
    setShow((preValue) => ({
      ...preValue,
      [value]: false,
    }));

    AccountInfoValidation.resetForm({
      values: initialAccountInfo,
      errors: {},
      touched: {},
      status: undefined,
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
    });

    setSelectedDocs([]);
  }

  function handleShow(value) {
    setShow((preValue) => ({
      ...preValue,
      [value]: true,
    }));
  }

  return (
    <>
      <ToastContainer />
      <div className="section factory-profile me-5 ms-5 mb-5 mt-2 ">
        <PageUtility currentPage="Factory Profile " />

        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {/* Account Info container 1 */}
              <AccountInformation
                currentUserData={currentUserData}
                factoryProfile={factoryProfile}
                handleShow={handleShow}
                Button={Button}
              />

              {/*Password change container 2 */}
              <Password
                handleShow={handleShow}
                handleClose={handleClose}
                show={show}
                errorMsg={errorMsg}
                setIsLogin={setIsLogin}
                ModalClose={ModalClose}
                setErrorMsg={setErrorMsg}
                isLogin={isLogin}
                isLoading={isLoading}
              />

              {/*Links container 2 */}
              <div id="EmailNotification"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Notifications</p>
                  <div className="w-100 ">
                    <div className="row grid-gap-col">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div className="form-group m-0 p-0">
                            <label>Allow Email Notifications</label>
                          </div>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input switch-input cursor"
                              type="checkbox"
                              id="allowEmailNotification"
                              checked={factoryProfile?.allowEmailNotification}
                              onClick={(e) => submitForm(!e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lecal certifcates   */}
              <LegalDocuments
                factoryProfile={factoryProfile}
                pdfIcon={pdfIcon}
                handleImageError={handleImageError}
                Button={Button}
                handleShow={handleShow}
              />

              {/*subscriptionPlan*/}
              <SubscriptionPlan />
            </div>
          </div>
        </div>
      </div>

      {/* Account setting Info Chnage  update form*/}
      <Modal
        show={show.accountInfoReadOnly}
        onHide={() => handleClose("accountInfoReadOnly")}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          {/* Account Info container 1 */}

          <div closeButton className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              {/* <p>Account Inforamtions</p> */}
              <Modal.Header closeButton>
                <Modal.Title>Account Inforamtions</Modal.Title>
              </Modal.Header>
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}
              <div className="w-100 ">
                <form onSubmit={AccountInfoValidation.handleSubmit}>
                  {/* <form> */}
                  <div className="row  row-gap">
                    <div className="col-6">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label>Representive first Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="repFirstName"
                            name="RepFirstName"
                            placeholder="Enter first Name"
                            onChange={AccountInfoValidation.handleChange}
                            onBlur={AccountInfoValidation.handleBlur}
                            value={AccountInfoValidation.values.repFirstName}
                          />
                          {AccountInfoValidation.errors.repFirstName &&
                          AccountInfoValidation.touched.repFirstName ? (
                            <small className="text-danger">
                              {AccountInfoValidation.errors.repFirstName}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>representive Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="repLastName"
                          name="repLastName"
                          placeholder="Enter Last Name"
                          onChange={AccountInfoValidation.handleChange}
                          onBlur={AccountInfoValidation.handleBlur}
                          value={AccountInfoValidation.values.repLastName}
                        />

                        {AccountInfoValidation.errors.repLastName &&
                        AccountInfoValidation.touched.repLastName ? (
                          <small className="text-danger">
                            {AccountInfoValidation.errors.repLastName}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label> Representive Email</label>
                          <input
                            type="text"
                            className="form-control"
                            id="repEmail"
                            name="repEmail"
                            placeholder="enter Representive Email"
                            onChange={AccountInfoValidation.handleChange}
                            onBlur={AccountInfoValidation.handleBlur}
                            value={AccountInfoValidation.values.repEmail}
                          />

                          {AccountInfoValidation.errors.repEmail &&
                          AccountInfoValidation.touched.repEmail ? (
                            <small className="text-danger">
                              {AccountInfoValidation.errors.repEmail}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label>Representive Phone Number*</label>
                          <div className="input-group  h-100">
                            <div className="input-group-prepend">
                              <select
                                className="input-group-text h-100 p-2 m-0 phone-borders"
                                id="repPhoneCode"
                                name="repPhoneCode"
                                placeholder="1113534343"
                                onChange={AccountInfoValidation.handleChange}
                                value={
                                  AccountInfoValidation.values.repPhoneCode
                                }
                                onBlur={AccountInfoValidation.handleBlur}
                              >
                                {countriesMiddleEast.map((phoneItem) => (
                                  <option value={phoneItem.phoneCode}>
                                    {phoneItem.phoneCode}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <input
                              type="text"
                              className="form-control phone-border"
                              id="repPhone"
                              name="repPhone"
                              placeholder="1113534343"
                              onChange={AccountInfoValidation.handleChange}
                              value={AccountInfoValidation.values.repPhone}
                              onBlur={AccountInfoValidation.handleBlur}
                            />
                          </div>
                          {AccountInfoValidation.errors.repPhone &&
                          AccountInfoValidation.touched.repPhone ? (
                            <small className="form-text text-danger">
                              {AccountInfoValidation.errors.repPhone}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("accountInfoReadOnly")}
                      >
                        Close
                      </Button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white px-5"></i>
                        </button>
                      ) : (
                        <button className="btn-edit submitButton" type="submit">
                          <p className="cursor">save changes</p>
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* </form> */}

      {/*  */}

      {/* Password Change modal  update form*/}

      {/*  legal docs */}

      <Modal
        show={show.legalDocsReadOnly}
        onHide={() => handleClose("legalDocsReadOnly")}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          {/* Account Info container 1 */}

          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p className="bg-info">Legal Documents</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}
              <div className="w-100 ">
                <form
                  onSubmit={(e) => updateMedia(e, "legalDocs")}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <div className="col-12">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          {/*  */}

                          {/*  */}

                          <label
                            className="mb-0 drop-drag-area  p-5 text-center cursor "
                            htmlFor="legalDocsInput"
                            onDrop={(e) => {
                              e.preventDefault();
                              const files = e?.dataTransfer?.files;
                              if (files && files.length > 0) {
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "legalDocs"
                                );
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
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "legalDocs",
                                  e?.target?.id
                                );
                              }
                            }}
                          >
                            Drag and drop files here or click to select files
                            <input
                              type="file"
                              id="legalDocsInput"
                              className="d-none"
                              multiple
                            />
                          </label>
                          <small className="form-text small-note">
                            Only pdf, png, jpeg, and jpg are allowed. A maximum
                            of 3 pictures is permitted.
                          </small>

                          <small className="text-danger">
                            {errorMsg?.legalDocs}
                          </small>

                          {selectedDocs.map(
                            (item, index) =>
                              // <div className="col-12">
                              item.keyWord === "legalDocs" && (
                                <div
                                  key={index}
                                  className="col-12 img-uploaded"
                                >
                                  <div className="d-flex justify-content-between align-items-center  img-cont-file">
                                    {/* <div> */}

                                    <div className="d-flex justify-content-start align-items-center ">
                                      <img
                                        // src={item.imageReaderURL}
                                        src={
                                          item?.pdfFile?.name?.includes("pdf")
                                            ? pdfIcon
                                            : item.imageReaderURL
                                        }
                                        className="image-upload-file me-3"
                                      />
                                    </div>

                                    <div className="w-100">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                          <p className="img-name text-tarute">
                                            {item?.pdfFile?.name}
                                          </p>
                                          <p className="img-name">
                                            {(
                                              item?.pdfFile?.size / 1024
                                            )?.toFixed(2)}
                                            KB
                                          </p>
                                          {/* {imgloadin} */}
                                        </div>

                                        <div
                                          onClick={() =>
                                            removeSelectedDoc(index)
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
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("legalDocsReadOnly")}
                      >
                        Close
                      </Button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white px-5"></i>
                        </button>
                      ) : (
                        <button
                          className="btn-edit submitButton"
                          type="submit"
                          disabled={!(selectedDocs?.length > 0)}
                        >
                          <p className="cursor">Submit for review</p>
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* </form> */}
    </>
  );
}
