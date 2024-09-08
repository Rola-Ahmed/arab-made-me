import { useEffect, useState, useReducer } from "react";
import { baseUrl_IMG } from "config.js";
import UploadDocument from "components/Forms/Shared/UploadDocument";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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
import CoverVideo from "./subComponents/CoverVideo";
import Certificates from "./subComponents/Certificates";
import FactoryBanner from "./subComponents/FactoryBanner";
import { useMircoData } from "./hooks/useMircoData";
import { useFormValidations } from "./hooks/useFormValidations";
import {
  // getFactoryTeam,
  addFactoryMedia,
  updateFactoryFromUser,
  updateFactoryBanner,
  updateFactoryCertificate,
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
    HandleUpdateFactoryInfo,
    handleUpdateSocialAccounts,
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
      //
      setSelectedDocs([]);
      // setTeamIsAdded({
      //   status: false,
      //   id: "",
      // });
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

  async function HandleUpdateFactoryInfo(values) {
    const data = {
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
    await submitForm(data);
  }
  async function handleUpdateSocialAccounts(values) {
    const data = {
      socialLinks: {},
      website: values.website,
    };

    data.socialLinks["facebook"] = values.facebookLink;
    data.socialLinks["instagram"] = values.instagramLink;
    await submitForm(data);
  }
  async function submitForm(data) {
    //
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

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

  async function handleSingleFileUpload(fileKeyword, fileValue, index) {
    const formData = new FormData();
    formData.append(fileKeyword, fileValue);
    formData.append("index", index);
    return formData;
  }

  async function handleAddBanner(e, index) {
    // document.body.style.cursor = "wait";
    e.preventDefault();
    let data = await handleSingleFileUpload(
      selectedDocs?.[0]?.keyWord,
      selectedDocs?.[0]?.pdfFile,
      index
    );
    await handleBannerUploads(data, "add");
  }

  async function handleDeleteBanner(index) {
    document.body.style.cursor = "wait";
    const data = await handleSingleFileUpload("images", null, index);
    await handleBannerUploads(data, "delete");
  }

  async function handleBannerUploads(data, actionType) {
    setIsLoading(true);
    const result = await updateFactoryBanner({ Authorization: isLogin }, data);

    if (result?.success) {
      update(result?.data?.factory);
      // setFactoryProfile((prev) => ({
      //   ...prev,
      //   ...result?.data?.factory
      // }));
      SuccessToast("data updated succcfully");

      handleClose();
      // const closeButton = document.getElementsByTagName("addLegalDocs");
      // closeButton.setAttribute("data-bs-dismiss", "modal");
      // console.log("closeButton", closeButton);
    } else {
      if (actionType == "delete") {
        ErrorToast("someThing went Wrong");
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: result?.error,
        }));
      }
    }
    setIsLoading(false);
    setTimeout(() => {
      document.body.style.cursor = "default";
    }, 5000); // 5000 milliseconds = 5 seconds
  }
  async function handleCertificateUploads(data, actionType) {
    setIsLoading(true);
    const result = await updateFactoryCertificate(
      { Authorization: isLogin },
      data
    );

    if (result?.success) {
      update(result?.data?.factory);

      SuccessToast("data updated succcfully");

      handleClose();
    } else {
      if (actionType == "delete") {
        ErrorToast("someThing went Wrong");
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: result?.error,
        }));
      }
    }
    setIsLoading(false);
    setTimeout(() => {
      document.body.style.cursor = "default";
    }, 5000); // 5000 milliseconds = 5 seconds
  }

  async function handleDeleteCertificate(index) {
    document.body.style.cursor = "wait";
    const data = await handleSingleFileUpload(
      "qualityCertificate",
      null,
      index
    );
    await handleCertificateUploads(data, "delete");
  }
  async function handleAddCertificate(e, index) {
    // document.body.style.cursor = "wait";
    e.preventDefault();
    let data = await handleSingleFileUpload(
      selectedDocs?.[0]?.keyWord,
      selectedDocs?.[0]?.pdfFile,
      index
    );
    await handleCertificateUploads(data, "add");
  }
  return (
    <>
      <div className="section factory-profile  ms-5 me-5 mb-5 mt-2">
        <PageUtility currentPage="Mirco Site" />
        {/*  */}

        <div className="container gap-container  w-100">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {/* factory logo  container 1 */}
              <FactoryLogo
                handleImageError={handleImageError}
                handleShow={handleShow}
                coverImage={`${baseUrl_IMG}/${factoryProfile?.coverImage}`}
                show={show}
                errorMsg={errorMsg}
                setErrorMsg={setErrorMsg}
                updateMedia={updateMedia}
                setSelectedDocs={setSelectedDocs}
                isLoading={isLoading}
                handleClose={handleClose}
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
              <FactoryBanner
                handleImageError={handleImageError}
                handleShow={handleShow}
                show={show}
                errorMsg={errorMsg}
                handleClose={handleClose}
                isLoading={isLoading}
                setErrorMsg={setErrorMsg}
                setSelectedDocs={setSelectedDocs}
                selectedDocs={selectedDocs}
                images={factoryProfile?.images}
                handleAddBanner={handleAddBanner}
                handleDeleteBanner={handleDeleteBanner}
                handleImageClick={handleImageClick}
              />

              {/*Certificats  */}

              <Certificates
                handleImageError={handleImageError}
                handleShow={handleShow}
                show={show}
                errorMsg={errorMsg}
                handleClose={handleClose}
                isLoading={isLoading}
                setErrorMsg={setErrorMsg}
                setSelectedDocs={setSelectedDocs}
                selectedDocs={selectedDocs}
                qualityCertificates={factoryProfile?.qualityCertificates}
                handleDeleteCertificate={handleDeleteCertificate}
                handleAddCertificate={handleAddCertificate}
                handleImageClick={handleImageClick}
              />

              {/* Cover Video  */}
              <CoverVideo
                handleImageError={handleImageError}
                coverVideo={`${baseUrl_IMG}/${factoryProfile?.coverVideo}`}
                notEmpty={factoryProfile?.coverVideo}
                handleShow={handleShow}
                show={show}
                errorMsg={errorMsg}
                handleClose={handleClose}
                isLoading={isLoading}
                updateMedia={updateMedia}
                setErrorMsg={setErrorMsg}
                setSelectedDocs={setSelectedDocs}
                selectedDocs={selectedDocs}
              />
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
