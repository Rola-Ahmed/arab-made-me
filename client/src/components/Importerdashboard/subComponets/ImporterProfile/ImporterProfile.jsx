import { useEffect, useState, useContext } from "react";
import { fetchOneImporter } from "Services/importer";
import { baseUrl_IMG } from "config.js";
import SuccessToast from "components/SuccessToast";
import ErrorToast from "components/ErrorToast";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import ReadOnly from "components/Forms/Shared/ReadOnly";

import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import Modal from "react-bootstrap/Modal";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { handleImageError } from "utils/ImgNotFound";

import { countriesMiddleEast } from "constants/countries";
import { useOutletContext } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import UploadDocument from "components/Forms/Shared/UploadDocument";
import { useFetchSectors } from "hooks/useFetchSectors";
import { addImporterMedia, updateImporterFromUser } from "Services/importer";
import ChangePassword from "components/Factorydashboard/subComponets/FactoryProfile/subComponents/ChangePassword/ChangePassword";
import InputField from "components/Forms/Shared/InputField";

import useFormValidation from "./hooks/useFormValidation";
function successMsg() {
  SuccessToast("Changes updated successfully");
}

export default function ImporterProfile() {
  document.title = "Importer Profile";

  let { isLogin } = useContext(UserToken);
  let { currentUserData, clearSession } = useContext(userDetails);
  const [activeMenu] = useOutletContext();

  const [ImporterProfile, setImporterProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  let { allSectors } = useFetchSectors();

  // slider setting
  const [selectedDocs, setSelectedDocs] = useState([]);
  let {
    initalAccInfo,
    AccountInfoValidation,
    initalSocialAcc,
    SocialAccountValidation,
    ImporterInfoValidation,
    initalImporterInfo,
  } = useFormValidation(
    submitAccInfo,
    onSubmitSocial,
    onSubmitfactoryInfo,
    ImporterProfile
  );

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

  async function fetchImporterData() {
    const result = await fetchOneImporter(currentUserData?.importerId, {});

    if (result?.success) {
      setImporterProfile(result?.data?.importers);
    }
  }

  async function updateMedia(e) {
    setIsLoading(true);

    e.preventDefault();

    const data = new FormData();

    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

    let result = await addImporterMedia({ Authorization: isLogin }, data);

    if (result?.success) {
      ModalClose();
      successMsg();

      setImporterProfile((prevErrors) => ({
        ...prevErrors,
        ...result?.data?.importer,
      }));
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
      fetchImporterData();
    }
  }, [currentUserData?.importerId]);

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

  function submitAccInfo(values) {
    let data = {
      repPhone: values.repPhone,
      repName: values.repFullName,
      name: values.name,
      ...(values.repEmail !== ImporterProfile.repEmail && {
        repEmail: values.repEmail,
      }),
    };
    submitForm(data);
  }

  function onSubmitSocial(values) {
    let data = {
      socialLinks: {},
      website: values.website,
    };

    if (values.facebookLink != "") {
      data.socialLinks["facebook"] = values.facebookLink;
    }
    if (values.instgramLink != "") {
      data.socialLinks["instagram"] = values.instgramLink;
    }
    submitForm(data);
  }
  function onSubmitfactoryInfo(values) {
    let {
      country,
      address,
      description,
      commercialRegisterationNumber,
      city,
      exportingCountries,
      sectorId,
      vatNumber,
      importerLicenseNumber,
    } = values;
    let data = {
      country,
      address: [address],
      description,
      ...(city && { city: city }),
      ...(sectorId && { sectorId: sectorId }),
      ...(exportingCountries?.length !== 0 && {
        exportingCountries: exportingCountries,
      }),
      vatNumber,
      importerLicenseNumber,
      commercialRegisterationNumber,
    };

    submitForm(data);
  }

  async function submitForm(values) {
    let data = values;
    setIsLoading(true);
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    const result = await updateImporterFromUser(
      {
        authorization: isLogin,
      },
      data
    );

    if (result?.success) {
      ModalClose();
      successMsg();
      setImporterProfile((prevErrors) => ({
        ...prevErrors,
        ...data,
      }));
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: result?.error,
      }));

      if (data?.allowEmailNotification != null) {
        ErrorToast(result?.error);
      }
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (ImporterProfile && ImporterProfile.length !== 0) {
      AccountInfoValidation.setValues(initalAccInfo);

      SocialAccountValidation.setValues(initalSocialAcc);

      ImporterInfoValidation.setValues(initalImporterInfo);
    }
  }, [ImporterProfile]);

  function resetFormVal() {
    SocialAccountValidation.resetForm({ values: initalSocialAcc });
    AccountInfoValidation.resetForm({ values: initalAccInfo });
    ImporterInfoValidation.resetForm({ values: initalImporterInfo });
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
    resetFormVal();
  }

  function handleShow(value) {
    setShow((preValue) => ({
      ...preValue,
      [value]: true,
    }));
  }

  const EmailNotificationUpdate2 = async (e) => {
    e.preventDefault();
    let data = {
      allowEmailNotification: !ImporterProfile?.allowEmailNotification,
    };

    submitForm(data);
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
                <div className="title-contianer-input w-100 ">
                  <p>Profile Image</p>
                  <div className="w-100 ">
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
                        <ReadOnly
                          title="Business Account"
                          value={currentUserData?.userEmail}
                        />
                      </div>

                      <div className="col-6">
                        <ReadOnly
                          title="representive Full Name"
                          value={ImporterProfile?.repName}
                        />
                      </div>

                      <div className="col-6">
                        <ReadOnly
                          title="Importer Name"
                          value={ImporterProfile?.name}
                        />
                      </div>

                      <div className="col-6">
                        <ReadOnly
                          title="Representive Email"
                          value={ImporterProfile?.repEmail}
                        />
                      </div>

                      <div className="col-6">
                        <ReadOnly
                          title="Representive  Phone Number"
                          value={ImporterProfile?.repPhone}
                        />
                      </div>

                      <div className="col-6">
                        <ReadOnly
                          title="commercial Registeration Number"
                          value={ImporterProfile?.commercialRegisterationNumber}
                        />
                      </div>

                      <div className="col-6">
                        <ReadOnly
                          title="vat Number"
                          value={ImporterProfile?.vatNumber}
                        />
                      </div>

                      <div className="col-6">
                        <ReadOnly
                          title="importer License Number"
                          value={ImporterProfile?.importerLicenseNumber}
                        />
                      </div>

                      <div className="col-12">
                        <button
                          className="btn-edit"
                          variant="primary"
                          onClick={() => handleShow("accountInfoReadOnly")}
                        >
                          <p className="cursor">Change Account Information </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*Password change container 2 */}

              <ChangePassword
                // handleShow={handleShow}
                // handleClose={handleClose}
                // show={show}
                // errorMsg={errorMsg}
                // setIsLogin={setIsLogin}
                // ModalClose={ModalClose}
                // setErrorMsg={setErrorMsg}
                // isLogin={isLogin}
                // isLoading={isLoading}

                errorMsg={errorMsg}
                setErrorMsg={setErrorMsg}
                isLogin={isLogin}
                isLoading={isLoading}
                clearSession={clearSession}
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

                          <button
                            className="btn-edit"
                            variant="primary"
                            onClick={() => handleShow("socialAccountsReadOnly")}
                          >
                            <p className="cursor">attach Link</p>
                          </button>
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
                          <button
                            className="btn-edit"
                            variant="primary"
                            onClick={() => handleShow("socialAccountsReadOnly")}
                          >
                            <p className="cursor">attach Link</p>
                          </button>
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
                          <button
                            className="btn-edit"
                            variant="primary"
                            onClick={() => handleShow("socialAccountsReadOnly")}
                          >
                            <p className="cursor">attach Link</p>
                          </button>
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
                              checked={ImporterProfile?.allowEmailNotification}
                              onClick={EmailNotificationUpdate2}
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

                  <DisplayMultiImages
                    images={ImporterProfile?.legalDocs}
                    handleImageClick={handleImageClick}
                  />
                  <div className="w-100">
                    <button
                      className="btn-edit"
                      variant="primary"
                      onClick={() => handleShow("legalDocsReadOnly")}
                    >
                      <p className="cursor">Upload </p>
                    </button>
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
                          <ReadOnly
                            title="Importer Name"
                            value={ImporterProfile?.name}
                          />
                        </div>

                        <div className="col-6">
                          <ReadOnly
                            title="Sector"
                            value={
                              allSectors?.some(
                                (item) => item.id === ImporterProfile?.sectorId
                              )
                                ? allSectors?.find(
                                    (item) =>
                                      item.id === ImporterProfile?.sectorId
                                  ).name
                                : ""
                            }
                          />
                        </div>
                        <div className="col-6">
                          <ReadOnly
                            title="Country"
                            value={ImporterProfile?.country}
                          />
                        </div>

                        <div className="col-6">
                          <ReadOnly
                            title="City"
                            value={ImporterProfile?.city}
                          />
                        </div>

                        <div className="col-6">
                          <ReadOnly
                            title="Yearly Sales Income"
                            value={ImporterProfile?.yearlySalesIncome}
                          />
                        </div>

                        <div className="col-6">
                          <ReadOnly
                            title="commercial Registeration Number"
                            value={
                              ImporterProfile?.commercialRegisterationNumber
                            }
                          />
                        </div>

                        <div className="col-6">
                          <ReadOnly
                            title="Importer Location"
                            value={ImporterProfile?.address?.[0]}
                          />
                        </div>

                        <div className="col-6">
                          <ReadOnly
                            title="exporting Countries"
                            value={ImporterProfile?.exportingCountries?.join(
                              ", "
                            )}
                          />
                        </div>

                        <div className="col-12">
                          <ReadOnly
                            title="Importer description"
                            value={ImporterProfile?.description}
                          />
                        </div>

                        <div className="col-12">
                          <button
                            className="btn-edit"
                            variant="primary"
                            onClick={() =>
                              handleShow("factoryInfoChangeReadOnly")
                            }
                          >
                            <p className="cursor">
                              Change Importer Information
                            </p>
                          </button>
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
                      <InputField
                        formValidation={AccountInfoValidation}
                        vlaidationName="repFullName"
                        isRequired={true}
                        title="representive full Name"
                      />
                    </div>

                    <div className="col-6">
                      <InputField
                        formValidation={AccountInfoValidation}
                        vlaidationName="name"
                        isRequired={true}
                        title="Importer Name"
                      />
                    </div>

                    <div className="col-6">
                      <InputField
                        formValidation={AccountInfoValidation}
                        vlaidationName="repEmail"
                        isRequired={true}
                        title=" Representive Email"
                      />
                    </div>

                    <div className="col-6">
                      <InputField
                        formValidation={AccountInfoValidation}
                        vlaidationName="repPhone"
                        isRequired={true}
                        title="Representive Phone Number"
                      />
                    </div>

                    <div className="col-6">
                      <InputField
                        isRequired={false}
                        title={"website"}
                        formValidation={AccountInfoValidation}
                        vlaidationName={"website"}
                      />
                    </div>

                    <div className="col-6">
                      <InputField
                        isRequired={true}
                        title="importer License Number"
                        formValidation={AccountInfoValidation}
                        vlaidationName="importerLicenseNumber"
                      />
                    </div>

                    {/*  */}

                    <div className="col-6">
                      <InputField
                        isRequired={true}
                        title={"commercial Registeration Number"}
                        formValidation={AccountInfoValidation}
                        vlaidationName={"commercialRegisterationNumber"}
                      />
                    </div>
                    <div className="col-6">
                      <InputField
                        isRequired={true}
                        title="Vat Number"
                        formValidation={AccountInfoValidation}
                        vlaidationName="vatNumber"
                      />
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("accountInfoReadOnly")}
                      >
                        Close
                      </button>
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
                      <InputField
                        formValidation={ImporterInfoValidation}
                        vlaidationName="city"
                        isRequired={true}
                        title="city"
                      />
                    </div>

                    <div className="col-6">
                      <InputField
                        formValidation={ImporterInfoValidation}
                        vlaidationName="commercialRegisterationNumber"
                        isRequired={true}
                        title="commercial Registeration Number"
                      />
                    </div>

                    <div className="col-6">
                      <InputField
                        formValidation={ImporterInfoValidation}
                        vlaidationName="vatNumber"
                        isRequired={true}
                        title="vat Number"
                      />
                    </div>

                    <div className="col-6">
                      <InputField
                        formValidation={ImporterInfoValidation}
                        vlaidationName="importerLicenseNumber"
                        isRequired={true}
                        title="importer License Number"
                      />
                    </div>

                    <div className="col-6">
                      <InputField
                        formValidation={ImporterInfoValidation}
                        vlaidationName="commercialRegisterationNumber"
                        isRequired={true}
                        title="commercial Registeration Number"
                      />
                    </div>

                    <div className="col-6">
                      <InputField
                        formValidation={ImporterInfoValidation}
                        vlaidationName="address"
                        isRequired={true}
                        title="Location"
                      />
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label>exporting Countries</label>

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
                      <button
                        variant="btn- btn-secondary"
                        type="button"
                        onClick={() => handleClose("factoryInfoChangeReadOnly")}
                      >
                        Close
                      </button>
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
                  <p>Social Links </p>
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
                      <button
                        variant="btn btn-secondary "
                        type="button"
                        onClick={() => handleClose("socialAccountsReadOnly")}
                      >
                        Close
                      </button>
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
                      <button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("legalDocsReadOnly")}
                      >
                        Close
                      </button>
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
              )}
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
                      meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                      setErrorMsg={setErrorMsg}
                      // title="Upload Documents"
                    />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("profilePicReadOnly")}
                      >
                        Close
                      </button>
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
