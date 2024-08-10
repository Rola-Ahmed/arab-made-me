import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";
import SuccessToast from "components/SuccessToast";
import ErrorToast from "components/ErrorToast";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";


import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { pdfIcon } from "constants/Images";


import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { handleImageError } from "utils/ImgNotFound";

import { countriesMiddleEast } from "constants/countries";
import { useOutletContext } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import UploadDocument from "components/Forms/Shared/UploadDocument";
import {useFetchSectors} from 'hooks/useFetchSectors'
import {addImporterMedia,updateImporterFromUser} from 'Services/importer';
import ChangePassword from "components/Factorydashboard/subComponets/FactoryProfile/subComponents/ChangePassword/ChangePassword"

function successMsg(){
  SuccessToast("Changes updated successfully");
}

export default function ImporterProfile() {
  document.title = "Importer Profile";

  let { isLogin ,setIsLogin} = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  const [activeMenu] = useOutletContext();

  const [ImporterProfile, setImporterProfile] = useState([]);
  const [renderDataUpdate, setRenderDataUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  let {allSectors}=useFetchSectors()

  // slider setting
  const [allowEmailNotification, setAllowEmailNotification] = useState();
  const [selectedDocs, setSelectedDocs] = useState([]);
  // api

  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });
  const handleImageClick = (imagePath) => {
    setShowImagePop({
      display: true,
      imagePath,
    });
  };


  async function fetchFactoryPage() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/importers/${currentUserData.importerId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setImporterProfile(response.data.importers);
      } 
    } catch (error) {}
  }

  // Cover IMage Profile -----------------------------------------------------

  async function updateMedia(e) {
    setIsLoading(true);

    e.preventDefault();

    const data = new FormData();

    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

  
    let result = await addImporterMedia({Authorization: isLogin},data)

        if (result?.success) {
          ModalClose();
          successMsg()

        
          setRenderDataUpdate(!renderDataUpdate);
          //
          setSelectedDocs([]);
        } else {

          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            response: result?.error,
          }));
        }
        setIsLoading(false);

     
  }

  useEffect(() => {
    if (currentUserData && currentUserData?.importerId) {
      fetchFactoryPage();
    }
  }, [currentUserData?.importerId, renderDataUpdate]);

  // update data
  let emailValidation = Yup.string()
    .email("Invalid email")
    .required("Input Field is Required")
    .min(5, "min length is 5")
    .max(255, "max length is 255");

  let nameValidation = Yup.string()
    .required("Input Field is Required")
    .max(25, "max length is 25");
  let phoneValidation = Yup.string()
    .required("Input Field is Required")
    // .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(6, "min length is 6")
    .max(15, "max length is 15");

  const [show, setShow] = useState({
    accountInfoReadOnly: false,
    passwordChangeReadOnly: false,
    factoryInfoChangeReadOnly: false,
    socialAccountsReadOnly: false,
    profilePicReadOnly: false,
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


  let AccountInfoValidation = useFormik({
    initialValues: {
      repFullName: ImporterProfile?.repName || "",
      repEmail: ImporterProfile?.repEmail || "",
      repPhone: ImporterProfile?.repPhone || "",
      name: ImporterProfile?.name || "",
    },

    validationSchema: Yup.object().shape({
      repFullName: nameValidation,
      name: nameValidation,
      repEmail: emailValidation,
      repPhone: phoneValidation,
    }),
    onSubmit: submitForm,
  });

  // social links
  let SocialAccountValidation = useFormik({
    initialValues: {
      instgramLink: "",
      facebookLink: "",
      website: "",
    },
    validationSchema: Yup.object().shape({
      website: Yup.string().url("Invalid URL format"),
      instgramLink: Yup.string().url("Invalid URL format"),
      facebookLink: Yup.string().url("Invalid URL format"),
    }),
    onSubmit: submitForm,
  });

  // IMporterInfoValidation
  let ImporterInfoValidation = useFormik({
    initialValues: {
      city: "",
      country: "",
      commercialRegisterationNumber: "",
      sectorId: "",
      address: "",
      description: "",
      exportingCountries: "",
    },
    validationSchema: Yup.object().shape({
      city: Yup.string().max(60, "max length is 60"),

      commercialRegisterationNumber: Yup.string()
        .matches(/^[0-9]+$/, "Input Field should contain numbers only")
        .min(8, "min length is 8")
        .max(16, "max length is 16"),

      address: Yup.string()
        .required("Input Field is Required")
        .max(255, "max length is 255"),

      description: Yup.string()
        .required("Input Field is Required")
        .max(255, "max length is 255"),
      exportingCountries: Yup.array().of(Yup.string()).nullable(),
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
      data = {
        repName: values.repFullName,
        repPhone: values.repPhone,
        name : values.name,
      }
      if (values.repEmail !== ImporterProfile.repEmail) {
        data.repEmail = values.repEmail;
      }
    }
    if (show?.factoryInfoChangeReadOnly) {
      data = {
        country: values.country,
        // commercialRegisterationNumber: values.commercialRegisterationNumber,
        address: [values.address],
        description: values.description,
      };

      if (values.commercialRegisterationNumber !== "") {
        data.commercialRegisterationNumber =
          values.commercialRegisterationNumber;
      }

      if (values.city !== "") {
        data.city = values.city;
      }
      if (values.exportingCountries.length !== 0) {
        data.exportingCountries = values.exportingCountries;
      }

      if (values.sectorId !== "") {
        data.sectorId = values.sectorId;
      }
    }

    if (show?.socialAccountsReadOnly) {
      data = {
        socialLinks: {
          // facebook: values.facebookLink,
          // instagram: values.instgramLink,
        },
        website: values.website,
      };

      if (values.website !== "") {
        data.website = values.website;
      }

      if (values.facebookLink != "") {
        data.socialLinks["facebook"] = values.facebookLink;
      }
      if (values.instgramLink != "") {
        data.socialLinks["instagram"] = values.instgramLink;
      }
    }

      setIsLoading(true);
      let config = {
        method: "put",
        url: `${baseUrl}/importers/update/fromUser`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);
      setIsLoading(false);
      if (response.data.message == "done") {
        ModalClose();
        successMsg()
        setRenderDataUpdate(!renderDataUpdate);
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response?.data?.message,
        }));
      }
    
    setIsLoading(false);
  }



 

  useEffect(() => {
    if (ImporterProfile && ImporterProfile.length !== 0) {
      AccountInfoValidation.setValues({
        repFullName: ImporterProfile?.repName || "",
        repEmail: ImporterProfile?.repEmail || "",
        repPhone: ImporterProfile?.repPhone || "",
        name: ImporterProfile?.name || "",
      });

      SocialAccountValidation.setValues({
        instgramLink: ImporterProfile?.socialLinks?.instgram || "",
        facebookLink: ImporterProfile?.socialLinks?.facebook || "",
        website: ImporterProfile?.website || "",
      });

      ImporterInfoValidation.setValues({
        city: ImporterProfile?.city || "",
        country: ImporterProfile?.country || "",

        commercialRegisterationNumber:
          ImporterProfile?.commercialRegisterationNumber || "",

        address: ImporterProfile?.address?.[0] || "",

        description: ImporterProfile?.description || "",
        exportingCountries: ImporterProfile?.exportingCountries,
        sectorId: ImporterProfile?.[0]?.id || "",
      });
    }
    setAllowEmailNotification(ImporterProfile?.allowEmailNotification);
  }, [ImporterProfile]);

  function initializeFormValues() {
    let accInfo = {
      repFullName: ImporterProfile?.repName || "",
      repEmail: ImporterProfile?.repEmail || "",
      repPhone: ImporterProfile?.repPhone || "",
      name: ImporterProfile?.name || "",
    };

    let socialAcc = {
      instgramLink: ImporterProfile?.socialLinks?.instgram || "",
      facebookLink: ImporterProfile?.socialLinks?.facebook || "",
      website: ImporterProfile?.website || "",
    };
    let ImporterInfo = {
      city: ImporterProfile?.city || "",
      country: ImporterProfile?.country || "",

      commercialRegisterationNumber:
        ImporterProfile?.commercialRegisterationNumber || "",

      address: ImporterProfile?.address?.[0] || "",

      description: ImporterProfile?.description || "",
      exportingCountries: ImporterProfile?.exportingCountries,
      sectorId: ImporterProfile?.[0]?.id || "",
    };

    return ImporterInfo, socialAcc, accInfo;
    // resetFormVal(ImporterInfo,socialAcc,accInfo)
  }
  function resetFormVal() {
    const { ImporterInfo, socialAcc, accInfo } = initializeFormValues();

    SocialAccountValidation.resetForm({
      values: socialAcc, // Optional: Reset values to an empty object
      errors: {}, // Optional: Reset errors to an empty object
      touched: {}, // Optional: Reset touched to an empty object
      status: undefined, // Optional: Reset status to undefined
      isSubmitting: false, // Optional: Reset isSubmitting to false
      isValidating: false, // Optional: Reset isValidating to false
      submitCount: 0, // Optional: Reset submitCount to 0
    });

    AccountInfoValidation.resetForm({
      values: accInfo,
      errors: {},
      touched: {},
      status: undefined,
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
    });

    ImporterInfoValidation.resetForm({
      values: ImporterInfo,
      errors: {},
      touched: {},
      status: undefined,
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
    });

 
    setSelectedDocs([]);
  }
  function handleClose(value) {
    setShow((preValue) => ({
      ...preValue,
      [value]: false,
    }));

    // reset message
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    // Reset the form and clear validation errors
    //  SocialAccountValidation.resetForm();
    //  OR

    resetFormVal();
    // initializeFormValues()
  }

  function handleShow(value) {
    setShow((preValue) => ({
      ...preValue,
      [value]: true,
    }));
  }

  const EmailNotificationUpdate2 = async (e) => {
    e.preventDefault();
        let data= {
          allowEmailNotification: !allowEmailNotification,
        }

      const response = await  updateImporterFromUser({
        authorization: isLogin,
      },data)

      if (response?.success) {
        successMsg()
        setRenderDataUpdate(!renderDataUpdate);
      } else {
        ErrorToast(response?.error,)
      }
   
  };



  useEffect(() => {
    const hash = window.location.hash;
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
  return (
    <>
      <div
        className="section factory-profile
      me-5 ms-5 mb-5 mt-2 "
      >
        <PageUtility currentPage="Importer Profile " />

        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {/* profile Image container 1 */}
              <div id="profileImage"></div>
              <div
                // name="profileImage"
                className="container-profile-input w-100 "
              >
                <div className="title-contianer-input w-100">
                  <p>Profile Image</p>
                  <div className="w-100 ">
                    <form
                      onSubmit={(e) => updateMedia(e, "image")}
                      encType="multipart/form-data"
                    >
                      <div className="row  row-gap">
                        <div className="col-12">
                  
                          <div className="grid-gap-col position-relative">
                            <div className="factory-logo  edit-img ">
                              <img
                                className="w-100 h-100 "
                                src={`${baseUrl_IMG}/${ImporterProfile?.image}`}
                                alt="buyer profile image"
                                onError={handleImageError}
                              />
                            </div>
                            <small className="form-text text-danger">
                              {errorMsg?.image}
                            </small>
                            <div className="edit-icon-profile-btn position-absolute  cursor">
                              <i
                                onClick={() => handleShow("profilePicReadOnly")}
                                className=" imgupload fa-solid fa-pen-to-square  cursor"
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="accountInformation"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Account Inforamtions</p>
                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Business Account</label>
                            <input
                              className="form-control"
                              value={currentUserData?.userEmail || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>representive Full Name</label>
                            <input
                              className="form-control"
                              value={ImporterProfile?.repName || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Importer Name</label>
                            <input
                              className="form-control"
                              value={ImporterProfile?.name || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label> Representive Email</label>
                            <input
                              type="text"
                              className="form-control"
                              value={ImporterProfile?.repEmail || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representive Phone Number</label>
                            <input
                              className="form-control"
                              value={ImporterProfile?.repPhone || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <Button
                          className="btn-edit"
                          variant="primary"
                          onClick={() => handleShow("accountInfoReadOnly")}
                        >
                          <p className="cursor">Change Account Information </p>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*Password change container 2 */}

<ChangePassword
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

              {/*Social Accounts container 2 */}
              <div id="socialAccount"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Social Accounts</p>
                  <div className="w-100 ">
                    <div className="row grid-gap-col">
                      <div className="col-12  ">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div
                            className="social-accounts-icon-conainer facebook"
                            title="attach facebook link to the website"
                          >
                            <i className="fab fa-facebook-f fa-2x"></i>
                          </div>

                          <Button
                            className="btn-edit"
                            variant="primary"
                            onClick={() => handleShow("socialAccountsReadOnly")}
                          >
                            <p className="cursor">attach Link</p>
                          </Button>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div
                            className="social-accounts-icon-conainer instagram"
                            title="attach instagram link to the websitek"
                          >
                            <i className="fab fa-instagram fa-2x"></i>
                          </div>
                          <Button
                            className="btn-edit"
                            variant="primary"
                            onClick={() => handleShow("socialAccountsReadOnly")}
                          >
                            <p className="cursor">attach Link</p>
                          </Button>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div
                            className="social-accounts-icon-conainer "
                            title="attach website link to the websitek"
                          >
                            <i className="fa-solid fa-link fa-2x"></i>
                          </div>
                          <Button
                            className="btn-edit"
                            variant="primary"
                            onClick={() => handleShow("socialAccountsReadOnly")}
                          >
                            <p className="cursor">attach Link</p>
                          </Button>
                        </div>
                      </div>
                    </div>
                    {/* </form> */}
                  </div>
                </div>
              </div>

              {/*Links container 2 */}
              <div id="EmailNotification"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Notifications</p>
                  <div className="w-100 ">
                    {/* ----------------------- */}
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
                              id="flexSwitchCheckChecked"
                              // checked={allowEmailNotification!==null ? allowEmailNotification : ImporterProfile?.allowEmailNotification }
                              // checked={ImporterProfile?.allowEmailNotification }
                              checked={allowEmailNotification}
                              onClick={EmailNotificationUpdate2}
                              onChange={() =>
                                setAllowEmailNotification((prev) => !prev)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* ----------------------- */}
                  </div>
                </div>
              </div>

              {/* Lecal certifcates   */}
              {/*Links container 2 */}
              <div id="legalDocs"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Legal Documents</p>


                  <DisplayMultiImages  images={ImporterProfile?.legalDocs} handleImageClick={handleImageClick}/>
                  <div className="w-100">
                        <Button
                          className="btn-edit"
                          variant="primary"
                          onClick={() => handleShow("legalDocsReadOnly")}
                        >
                          <p className="cursor">Upload </p>
                        </Button>
                      </div>
                  
                </div>
              </div>

              {/*  FACTORY iNFO*/}
              <div id="importerInforamtion"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Importer Inforamtion</p>
                  <div className="w-100 ">
                    <form>
                      <div className="row  row-gap">
                        <div className="col-6">
                          <div className="grid-gap-col">
                            <div className="form-group">
                              <label>Factory Name</label>
                              <input
                                className="form-control"
                                value={ImporterProfile?.name || ""}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="grid-gap-col">
                            <div className="form-group">
                              <label>Sector</label>
                              <input
                                className="form-control"
                                value={
                                  allSectors?.some(
                                    (item) =>
                                      item.id === ImporterProfile?.sectorId
                                  )
                                    ? allSectors?.find(
                                        (item) =>
                                          item.id === ImporterProfile?.sectorId
                                      ).name
                                    : ""
                                }
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label>Country</label>
                            <input
                              className="form-control"
                              value={ImporterProfile?.country || ""}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <label>City</label>
                            <input
                              className="form-control"
                              value={ImporterProfile?.city || ""}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <label>Yearly Sales Income</label>
                            <input
                              className="form-control"
                              value={
                                ImporterProfile?.yearlySalesIncome ||
                                "USD 1M-5M"
                              }
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <label>commercial Registeration Number</label>
                            <input
                              className="form-control"
                              value={
                                ImporterProfile?.commercialRegisterationNumber ||
                                ""
                              }
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <label>Importer Location</label>
                            <input
                              className="form-control"
                              value={ImporterProfile?.address?.[0] || ""}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <label>exporting Countries</label>
                            <input
                              className="form-control"
                              value={
                              
                                      ImporterProfile?.exportingCountries?.join(", ") || ''
                              }
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group">
                            <label>Importer description</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={ImporterProfile?.description || ""}
                              readOnly
                            ></textarea>
                          </div>
                        </div>

                        <div className="col-12">
                          <Button
                            className="btn-edit"
                            variant="primary"
                            onClick={() =>
                              handleShow("factoryInfoChangeReadOnly")
                            }
                          >
                            <p className="cursor">
                              Change Importer Information
                            </p>
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
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
              <form onSubmit={AccountInfoValidation.handleSubmit}>
                <div className="w-100 ">
                  <div className="row  row-gap">
                    <div className="col-6">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label>representive full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="repFullName"
                            name="repFullName"
                            placeholder="Enter full Name"
                            onChange={AccountInfoValidation.handleChange}
                            onBlur={AccountInfoValidation.handleBlur}
                            value={AccountInfoValidation.values.repFullName}
                          />
                          {AccountInfoValidation.errors.repFullName &&
                          AccountInfoValidation.touched.repFullName ? (
                            <small className="text-danger">
                              {AccountInfoValidation.errors.repFullName}
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
                          <label>Importer Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            placeholder="Enter full Name"
                            onChange={AccountInfoValidation.handleChange}
                            onBlur={AccountInfoValidation.handleBlur}
                            value={AccountInfoValidation.values.name}
                          />
                          {AccountInfoValidation.errors.name &&
                          AccountInfoValidation.touched.name ? (
                            <small className="text-danger">
                              {AccountInfoValidation.errors.name}
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
                          <label>Representive Phone Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="repPhone"
                            name="repPhone"
                            placeholder="01113622484"
                            onChange={AccountInfoValidation.handleChange}
                            onBlur={AccountInfoValidation.handleBlur}
                            value={AccountInfoValidation.values.repPhone}
                          />

                          {AccountInfoValidation.errors.repPhone &&
                          AccountInfoValidation.touched.repPhone ? (
                            <small className="text-danger">
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
                          <i className="fas fa-spinner fa-spin text-white"></i>
                        </button>
                      ) : (
                        <button className="btn-edit submitButton" type="submit">
                          <p className="cursor">save changes</p>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>

  

      {/* -------------------------------------------------------------------------------------------------- */}
      {/* Factory Info Modal update form */}
      {/* <form onSubmit={ImporterInfoValidation.handleSubmit}> */}
      <Modal
        show={show.factoryInfoChangeReadOnly}
        onHide={() => handleClose("factoryInfoChangeReadOnly")}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Importer Inforamtion</p>
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
                <form onSubmit={ImporterInfoValidation.handleSubmit}>
                  <div className="row  row-gap">
                    <div className="col-6">
                      <div className="form-group">
                        <label>sector</label>
                        <select
                          className="form-select form-control"
                          onChange={
                            // setCountryVal(event.target.value);
                            ImporterInfoValidation.handleChange
                          }
                          id="sectorId"
                          onBlur={ImporterInfoValidation.handleBlur}
                          value={ImporterInfoValidation.values.sectorId}
                        >
                          <option value="">Select sector</option>
                          {allSectors?.map((item) => (
                            <option value={item?.id}>{item?.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>Country</label>
                        <select
                          className="form-select form-control"
                          onChange={(event) => {
                            // setCountryVal(event.target.value);
                            ImporterInfoValidation.handleChange(
                              event.target.value
                            );
                          }}
                          id="country"
                          onBlur={ImporterInfoValidation.handleBlur}
                          value={ImporterInfoValidation.values.country}
                        >
                          {countriesMiddleEast.map((countryItem) => (
                            <option value={countryItem.code}>
                              {countryItem.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          // type="text"
                          placeholder="Enter City"
                          className="form-control"
                          id="city"
                          onChange={ImporterInfoValidation.handleChange}
                          onBlur={ImporterInfoValidation.handleBlur}
                          value={ImporterInfoValidation.values.city}
                        />
                        {ImporterInfoValidation.errors.city &&
                        ImporterInfoValidation.touched.city ? (
                          <small className="text-danger">
                            {ImporterInfoValidation.errors.city}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>commercial Registeration Number</label>
                        <input
                          type="text"
                          className="form-control"
                          id="commercialRegisterationNumber"
                          onChange={ImporterInfoValidation.handleChange}
                          onBlur={ImporterInfoValidation.handleBlur}
                          value={
                            ImporterInfoValidation.values
                              .commercialRegisterationNumber
                          }
                        />
                        {ImporterInfoValidation.errors
                          .commercialRegisterationNumber &&
                        ImporterInfoValidation.touched
                          .commercialRegisterationNumber ? (
                          <small className="text-danger">
                            {
                              ImporterInfoValidation.errors
                                .commercialRegisterationNumber
                            }
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label> Location</label>
                        <input
                          className="form-control"
                          id="address"
                          onChange={ImporterInfoValidation.handleChange}
                          onBlur={ImporterInfoValidation.handleBlur}
                          value={ImporterInfoValidation.values.address}
                        />
                        {ImporterInfoValidation.errors.address &&
                        ImporterInfoValidation.touched.address ? (
                          <small className="text-danger">
                            {ImporterInfoValidation.errors.address}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label forhtml="exportingCountries">
                          exporting Countries
                        </label>

                        {/*  */}
                        <button
                          className="btn d-flex justify-content-between  dropdown-toggle w-100 text-start select-countries"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Select Countries
                          {/* {Dropdown} */}
                        </button>
                        <ul className="dropdown-menu col-5 scroller">
                          {countriesMiddleEast.map((item) => (
                            <li>
                              <div className=" dropdown-item d-flex justify-content-start align-items-center width-drop">
                                <input
                                  onChange={ImporterInfoValidation.handleChange}
                                  className="form-check-input cursor me-3 "
                                  type="checkbox"
                                  name="exportingCountries"
                                  id="exportingCountries"
                                  value={item.code}
                                  defaultChecked={ImporterProfile?.exportingCountries?.some(
                                    (type) =>
                                      item.code
                                        .toLowerCase()
                                        .includes(type.toLowerCase())
                                  )}
                                />
                                <label
                                  className="form-check-label p-0 m-0"
                                  htmlFor="exportingCountries"
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

                    <div className="col-12">
                      <div className="form-group">
                        <label> description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          id="description"
                          onChange={ImporterInfoValidation.handleChange}
                          onBlur={ImporterInfoValidation.handleBlur}
                          value={ImporterInfoValidation.values.description}
                        ></textarea>
                        {ImporterInfoValidation.errors.description &&
                        ImporterInfoValidation.touched.description ? (
                          <small className="text-danger">
                            {ImporterInfoValidation.errors.description}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("factoryInfoChangeReadOnly")}
                      >
                        Close
                      </Button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white"></i>
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

      {/* Social Links update form */}
      <Modal
        show={show.socialAccountsReadOnly}
        onHide={() => handleClose("socialAccountsReadOnly")}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Importer Inforamtion</p>
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
                <form onSubmit={SocialAccountValidation.handleSubmit}>
                  <div className="row  row-gap">
                    <div className="row grid-gap-col">
                      <div className="col-12  ">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div
                            className="social-accounts-icon-conainer facebook"
                            title="attach facebook link to the website"
                          >
                            <i className="fab fa-facebook-f fa-2x"></i>
                          </div>

                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="attach link"
                              id="facebookLink"
                              onChange={SocialAccountValidation.handleChange}
                              onBlur={SocialAccountValidation.handleBlur}
                              value={
                                SocialAccountValidation.values.facebookLink
                              }
                            />
                            {SocialAccountValidation.errors.facebookLink &&
                            SocialAccountValidation.touched.facebookLink ? (
                              <small className="text-danger">
                                {SocialAccountValidation.errors.facebookLink}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div
                            className="social-accounts-icon-conainer instagram"
                            title="attach instagram link to the websitek"
                          >
                            <i className="fab fa-instagram fa-2x"></i>
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="attach link"
                              id="instgramLink"
                              onChange={SocialAccountValidation.handleChange}
                              onBlur={SocialAccountValidation.handleBlur}
                              value={
                                SocialAccountValidation.values.instgramLink
                              }
                            />
                            {SocialAccountValidation.errors.instgramLink &&
                            SocialAccountValidation.touched.instgramLink ? (
                              <small className="text-danger">
                                {SocialAccountValidation.errors.instgramLink}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center form-control">
                          <div
                            className="social-accounts-icon-conainer "
                            title="attach website link to the websitek"
                          >
                            <i className="fa-solid fa-link fa-2x"></i>
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="attach link"
                              id="website"
                              onChange={SocialAccountValidation.handleChange}
                              onBlur={SocialAccountValidation.handleBlur}
                              value={SocialAccountValidation.values.website}
                            />
                            {SocialAccountValidation.errors.website &&
                            SocialAccountValidation.touched.website ? (
                              <small className="text-danger">
                                {SocialAccountValidation.errors.website}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("socialAccountsReadOnly")}
                      >
                        Close
                      </Button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white"></i>
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
          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Legal Documents</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              )}
              <form
                onSubmit={(e) => updateMedia(e)}
                encType="multipart/form-data"
              >
                <div className="w-100 ">
                  <div className="row  row-gap">

                  <UploadDocument
                  selectedDocs={selectedDocs}
                  errorMsg={errorMsg}
                  setSelectedDocs={setSelectedDocs}
                  MediaName="legalDocs"
                  mediaMaxLen="3"
                  meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
                  setErrorMsg={setErrorMsg}
                  // title="Upload Documents"
                />


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
                          <i className="fas fa-spinner fa-spin text-white"></i>
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
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* </form> */}

      <Modal
        show={show.profilePicReadOnly}
        onHide={() => handleClose("profilePicReadOnly")}
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
                  <p>Profile Picture</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) }
              <div className="w-100 ">
                <form
                  onSubmit={(e) => updateMedia(e)}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                  <UploadDocument
                  selectedDocs={selectedDocs}
                  errorMsg={errorMsg}
                  setSelectedDocs={setSelectedDocs}
                  MediaName="image"
                  mediaMaxLen="1"
                  meidaAcceptedExtensions={[ "png", "jpeg", "jpg"]}
                  setErrorMsg={setErrorMsg}
                  // title="Upload Documents"
                />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("profilePicReadOnly")}
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





      <MediaPopUp
        show={showImagePop.display}
        onHide={() =>
          setShowImagePop({
            display: false,
            imagePath: "",
          })
        }
        showImagePop={showImagePop.imagePath}
      />
    </>


  );
}
