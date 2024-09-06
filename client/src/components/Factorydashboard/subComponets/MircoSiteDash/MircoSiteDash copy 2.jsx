import { useEffect, useState, useReducer } from "react";
import { baseUrl_IMG } from "config.js";
import UploadDocument, {
  UploadVedio,
} from "components/Forms/Shared/UploadDocument";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import { handleImageError } from "utils/ImgNotFound";
import { countriesMiddleEast } from "constants/countries";
import SuccessToast from "components/SuccessToast";
import ErrorToast from "components/ErrorToast";

import PageUtility from "components/Shared/Dashboards/PageUtility";
import FactoryInforamtion from "./subComponents/FactoryInforamtion";
import Team from "./subComponents/Team";
import SocialAccounts from "./subComponents/SocialAccounts";
import FactoryLogo from "./subComponents/FactoryLogo";
import { useMircoData } from "./hooks/useMircoData";
import { useFormValidations } from "./hooks/useFormValidations";
import {
  // getFactoryTeam,
  addFactoryMedia,
  updateFactoryFromUser,
} from "Services/factory";
import {
  deleteTeam as deleteMember,
  addTeam,
  addTeamMedia,
} from "Services/team";

function successMsg() {
  SuccessToast("Changes updated successfully");
}
export default function MircoSiteDash() {
  document.title = "Factory Profile";

  // let { isLogin } = useContext(UserToken);
  const [errorMsg, setErrorMsg] = useState();

  // let { currentUserData } = useContext(userDetails);
  const setFactoryProfile = [];
  const reducer = (state, action) => {
    switch (action.type) {
      case "fetched_update_data":
        return {
          ...state,
          ...action.value,
        };

      case "fetch_team_data":
        return {
          ...state,
          teamMembers: action.value,
        };

      case "delete_Team":
        let updateTeam = state?.teamMembers;
        updateTeam.splice(action.index, 1);

        return {
          ...state,
          teamMembers: updateTeam,
        };

      case "add_Team":
        let updateTeamArr = state?.teamMembers;
        updateTeamArr.push(action.value);
        return {
          ...state,
          teamMembers: updateTeamArr,
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

  function deleteTeam(data) {
    dispatch({ type: "delete_Team", index: data });
  }
  const [isLoading, setIsLoading] = useState(false);
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

  // slider setting

  const [selectedDocs, setSelectedDocs] = useState([]);

  function update(data) {
    dispatch({
      type: "fetched_update_data",
      value: data,
    });
  }

  function fetch_team(data) {
    console.log("fetch_teamfetch_team", data);
    dispatch({
      type: "fetch_team_data",
      value: data,
    });
  }

  let { isLogin, errorloadingData } = useMircoData(update, fetch_team);
  let {
    factoryInfoValidation,
    SocialAccountValidation,
    teamValidation,
    initialTeamValues,
    initialSocialAccount,
    initialFactoryInfoValidation,
  } = useFormValidations(
    factoryProfile,
    countriesMiddleEast,
    submitForm,
    submitTeam
  );
  // Cover IMage Profile -----------------------------------------------------

  async function updateMedia(e) {
    setIsLoading(true);

    e.preventDefault();

    const data = new FormData();

    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

    let result = await addFactoryMedia({ Authorization: isLogin }, data);
    if (result?.success) {
      ModalClose();
      handleClose();
      successMsg();

      update(result?.data?.factory);
      // dispatch({
      //   type: "fetched_update_data",
      //   value: result?.data?.factory,
      // });

      //
      setSelectedDocs([]);
      setTeamIsAdded({
        status: false,
        id: "",
      });
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: result?.error,
      }));
    }
    setIsLoading(false);
  }

  const deleteData = async (itemId, indexArr) => {
    let result = await deleteMember(itemId, {
      authorization: isLogin,
    });
    if (result?.success) {
      deleteTeam(indexArr);
      successMsg();
    } else {
      ErrorToast(result?.error);
    }
  };

  // update data

  const [show, setShow] = useState({
    factoryInfoChangeReadOnly: false,
    socialAccountsReadOnly: false,
    legalDocsReadOnly: false,
    qualityCertificatesReadOnly: false,
    coverImgReadOnly: false,
    newTeamReadOnly: false,
    coverVideo: false,
  });

  // there is 2 apis that i update
  //  1st api for user data
  // 2nd api for image
  // i need to wait for the success state for the 1st api inorder to pass the id to image api
  // if 1st api is success & meida api is failur then i need to pop a messsage and i only need to update the media api
  // so !teamIsAdded.status conditon checks if team data is added so it wont add again the same user

  let [teamIsAdded, setTeamIsAdded] = useState({
    status: false,
    id: "",
  });

  async function submitTeam(values) {
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });
    let data = {
      name: values.teamName,
      role: values.teamRole,
    };
    let reuslt = await addTeam(
      {
        authorization: isLogin,
      },
      data
    );
    if (!teamIsAdded.status) {
      setIsLoading(true);

      if (reuslt?.success) {
        // check if the inputs contain meida then call media api & pass the member team id
        // else inputs doesnt contain meida so display successs message
        if (selectedDocs.length > 0) {
          setTeamIsAdded({
            status: true,
            id: reuslt?.data?.teamMember?.id,
          });

          await SubmitDocs(reuslt?.data?.teamMember?.id);
        } else {
          setIsLoading(false);
          setTeamIsAdded({
            status: false,
            id: "",
          });

          teamValidation.resetForm({
            values: initialTeamValues,
          });

          successMsg();

          ModalClose();
          dispatch({ type: "add_Team", value: reuslt?.data?.teamMember });
        }
      } else {
        setIsLoading(false);
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: reuslt?.error,
        }));
      }
    }

    if (teamIsAdded.status && selectedDocs?.length > 0) {
      setIsLoading((prev) => ({
        ...prev,
        submitLoading: true,
      }));
      SubmitDocs(teamIsAdded.id);
    }
  }

  async function SubmitDocs(id) {
    // e.preventDefault();
    setIsLoading(true);

    let data = new FormData();

    selectedDocs?.map((item) => data.append("image", item.pdfFile));

    let rueslt = await addTeamMedia(
      id,
      {
        Authorization: isLogin,
      },
      data
    );

    if (rueslt?.success) {
      teamValidation.resetForm({
        values: initialTeamValues,
      });
      setTeamIsAdded({
        status: false,
        id: "",
      });
      successMsg();

      dispatch({ type: "add_Team", value: rueslt?.data?.teamMember });

      setIsLoading(false);
      setSelectedDocs([]);
      ModalClose();
    } else {
      setIsLoading(false);

      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: rueslt?.error,
      }));
    }
  }

  async function submitForm(values) {
    //
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });
    let data = {};
    // cotinue

    if (show?.factoryInfoChangeReadOnly) {
      data = {
        name: values.factoryName,
        country: values.country,
        // /optional
        yearOfEstablishmint: values.yearOfEstablishmint,
        city: values.city,
        numberOfEmployees: values.numberOfEmployees,
        commercialRegisterationNumber: values.commercialRegisterationNumber,
        taxRegisterationNumber: values.taxRegisterationNumber,
        IndustrialLicenseNumber: values.IndustrialLicenseNumber,

        IndustrialRegistrationNumber: values.IndustrialRegistrationNumber,
        BusinessRegistrationNumber: values.BusinessRegistrationNumber,

        description: values.description,
        address: [values.address],
      };
      if (values.whyUs !== "") {
        data.whyUs = `${values.whyUs}`;
      }
      if (values.importingCountries.length !== 0) {
        data.importingCountries = values.importingCountries;
      }

      if (values.factoryPhone !== "") {
        data.phone = `${values.factoryPhoneCode}${values.factoryPhone}`;
      }

      if (values.yearlySalesIncome !== "") {
        data.yearlySalesIncome = values.yearlySalesIncome;
      }
    }

    if (show?.socialAccountsReadOnly) {
      data = {
        socialLinks: {},
        website: values.website,
      };

      data.socialLinks["facebook"] = values.facebookLink;
      data.socialLinks["instagram"] = values.instagramLink;
    }

    setIsLoading(true);
    let response = await updateFactoryFromUser(
      {
        authorization: isLogin,
      },
      data
    );

    if (response?.success) {
      ModalClose();
      successMsg();

      update(data);
      // dispatch({
      //   type: "fetched_update_data",
      //   value: data,
      // });
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: response?.error,
      }));
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (factoryProfile && factoryProfile.length !== 0) {
      SocialAccountValidation.setValues(initialSocialAccount);
      factoryInfoValidation.setValues(initialFactoryInfoValidation);
      teamValidation.setValues(initialTeamValues);
    }
  }, [factoryProfile]);

  function handleClose(value) {
    ModalClose();

    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    // Reset the form and clear validation errors
    // reset to initaliz the values
    SocialAccountValidation.resetForm({
      values: initialSocialAccount,
    });
    factoryInfoValidation.resetForm({ values: initialFactoryInfoValidation });
    // teamValidation.setValues(initialTeamValues);

    setSelectedDocs([]);
  }

  function handleShow(value) {
    setShow((preValue) => ({
      ...preValue,
      [value]: true,
    }));
  }
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

  return (
    <>
      <div className="section factory-profile  ms-5 me-5 mb-5 mt-2">
        <PageUtility currentPage="Mirco Site" />
        {/*  */}

        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {/* factory logo  container 1 */}
              <FactoryLogo
                baseUrl_IMG={baseUrl_IMG}
                handleImageError={handleImageError}
                handleShow={handleShow}
                coverImage={factoryProfile?.coverImage}
                show={show}
                errorMsg={errorMsg}
                setErrorMsg={setErrorMsg}
                updateMedia={updateMedia}
                setSelectedDocs={setSelectedDocs}
                isLoading={isLoading}
              />

              {/*Social Accounts container 2 */}
              <SocialAccounts
                handleShow={handleShow}
                show={show}
                errorMsg={errorMsg}
                handleClose={handleClose}
                isLoading={isLoading}
                SocialAccountValidation={SocialAccountValidation}
                socialLinks={factoryProfile?.socialLinks}
              />

              {/* Factory Banners */}

              <div id="factoryimages"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Factory Banners</p>
                  <DisplayMultiImages
                    handleImageClick={handleImageClick}
                    images={factoryProfile?.images}
                  />
                  {/* <div className="col-12"> */}
                  <Button
                    className="btn-edit w-fit-content"
                    variant="primary"
                    onClick={() => handleShow("imagesReadOnly")}
                  >
                    <p className="cursor">Upload </p>
                  </Button>
                  {/* </div> */}
                </div>
              </div>

              {/*Certificats  */}
              <div id="certificates"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Certificates</p>
                  <DisplayMultiImages
                    handleImageClick={handleImageClick}
                    images={factoryProfile?.qualityCertificates}
                  />
                  <Button
                    className="btn-edit w-fit-content"
                    variant="primary"
                    onClick={() => handleShow("qualityCertificatesReadOnly")}
                  >
                    <p className="cursor">Upload </p>
                  </Button>
                </div>
              </div>

              {/* Cover Video  */}
              <div id="CoverVideo"></div>
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p>Cover Video</p>
                  <div className="w-100 ">
                    {/* ----------------------- */}
                    <div className="row grid-gap-col">
                      <div className="col-12 h-fit-content">
                        {factoryProfile?.coverVideo ? (
                          <video
                            controls="controls"
                            autoPlay={false}
                            muted={true}
                            className="h-75 w-100  "
                            id={handleImageError}
                            src={`${baseUrl_IMG}/${factoryProfile?.coverVideo}`}
                            alt="Cover Video"
                            onError={handleImageError}
                          />
                        ) : (
                          <h5 className="text-muted text-center py-3">Empty</h5>
                        )}
                      </div>

                      <div className="col-12">
                        <Button
                          className="btn-edit"
                          variant="primary"
                          onClick={() => handleShow("coverVideo")}
                        >
                          <p className="cursor">Upload </p>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end new */}

              {/*  FACTORY iNFO*/}
              {/* read and update data */}
              <FactoryInforamtion
                Button={Button}
                factoryProfile={factoryProfile}
                handleShow={handleShow}
                show={show}
                errorMsg={errorMsg}
                factoryInfoValidation={factoryInfoValidation}
                handleClose={handleClose}
                isLoading={isLoading}
              />

              {/*  team iNFO*/}
              {/* read and update data */}
              <Team
                handleShow={handleShow}
                teamMembers={factoryProfile?.teamMembers}
                deleteData={deleteData}
                teamValidation={teamValidation}
                handleClose={handleClose}
                isLoading={isLoading}
                show={show}
                errorMsg={errorMsg}
                setSelectedDocs={setSelectedDocs}
                selectedDocs={selectedDocs}
                setErrorMsg={setErrorMsg}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Factory Banners */}
      <Modal
        show={show.imagesReadOnly}
        onHide={() => handleClose("imagesReadOnly")}
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
                  <p>Factory Banners</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              )}
              <div className="w-100 ">
                <form
                  onSubmit={(e) => updateMedia(e, "images")}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <div className="col-12">
                      <UploadDocument
                        selectedDocs={selectedDocs}
                        errorMsg={errorMsg}
                        setSelectedDocs={setSelectedDocs}
                        MediaName="images"
                        mediaMaxLen="8"
                        meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                        setErrorMsg={setErrorMsg}
                        // title="Factory Banners"
                      />
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("imagesReadOnly")}
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
                          <p className="cursor">Submit</p>
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

      {/* Factory Banners */}
      <Modal
        show={show.coverImgReadOnly}
        onHide={() => handleClose("coverImgReadOnly")}
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
                  <p>Factory Logo</p>
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
                  onSubmit={(e) => updateMedia(e, "coverImage")}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <UploadDocument
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="coverImage"
                      mediaMaxLen="1"
                      meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                      setErrorMsg={setErrorMsg}
                      // title="Factory Banners"
                    />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("coverImgReadOnly")}
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
                          <p className="cursor">Submit</p>
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

      {/* Certificaets qualityCertificates */}

      <Modal
        show={show.qualityCertificatesReadOnly}
        onHide={() => handleClose("qualityCertificatesReadOnly")}
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
                  <p>Certificates</p>
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
                  onSubmit={(e) => updateMedia(e, "qualityCertificates")}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <UploadDocument
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="qualityCertificates"
                      mediaMaxLen="3"
                      meidaAcceptedExtensions={[
                        "pdf",
                        "png",
                        "jpeg",
                        "jpg",
                        "psd",
                        "webp",
                      ]}
                      setErrorMsg={setErrorMsg}
                      // title="Certificates"
                    />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() =>
                          handleClose("qualityCertificatesReadOnly")
                        }
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

      {/* Cover Video  */}

      <Modal
        show={show.coverVideo}
        onHide={() => handleClose("coverVideo")}
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
                  <p>Cover Video</p>
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
                  onSubmit={(e) => updateMedia(e, "coverVideo")}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <UploadVedio
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="coverVideo"
                      mediaMaxLen="1"
                      meidaAcceptedExtensions={["mp4", "mkv", "x-matroska"]}
                      setErrorMsg={setErrorMsg}
                      // title="Certificates"
                    />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("coverVideo")}
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
                          <p className="cursor">Submit Video</p>
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

      {/* new team */}

      <Modal
        show={show.newTeamReadOnly}
        onHide={() => handleClose("newTeamReadOnly")}
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
                  <p>Add New Team </p>
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
                  onSubmit={teamValidation.handleSubmit}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <div className="col-6">
                      <div className="form-group">
                        <label>Member Name</label>
                        <input
                          className="form-control"
                          id="teamName"
                          onChange={teamValidation.handleChange}
                          onBlur={teamValidation.handleBlur}
                          value={teamValidation.values.teamName}
                        />
                        {teamValidation.errors.teamName &&
                        teamValidation.touched.teamName ? (
                          <small className="text-danger">
                            {teamValidation.errors.teamName}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label>Member Role</label>
                        <input
                          className="form-control"
                          id="teamRole"
                          onChange={teamValidation.handleChange}
                          onBlur={teamValidation.handleBlur}
                          value={teamValidation.values.teamRole}
                        />
                        {teamValidation.errors.teamRole &&
                        teamValidation.touched.teamRole ? (
                          <small className="text-danger">
                            {teamValidation.errors.teamRole}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <UploadDocument
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="image"
                      mediaMaxLen="1"
                      meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                      setErrorMsg={setErrorMsg}
                      // title="Company Banners"
                    />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("newTeamReadOnly")}
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
                          // disabled={!(selectedDocs?.length > 0)}
                        >
                          <p className="cursor">Add</p>
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
