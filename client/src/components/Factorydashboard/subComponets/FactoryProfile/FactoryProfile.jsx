import { useState, useEffect } from "react";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import SuccessToast from "components/SuccessToast";
import ErrorToast from "components/ErrorToast";
import UploadDocument from "components/Forms/Shared/UploadDocument";
import ChangePassword from "./subComponents/ChangePassword/ChangePassword";
import AccountInformation from "./subComponents/AccountInformation";
import SubscriptionPlan from "./subComponents/SubscriptionPlan";
import LegalDocuments from "./subComponents/LegalDocuments";
import useFormValidation from "./hooks/useFormValidation";
import useFactoryProfile from "./hooks/useFactoryProfile";
import { handleImageError } from "utils/ImgNotFound";
import useCountries from "hooks/useCountries";
import Modal from "react-bootstrap/Modal";

import {
  addFactoryMedia,
  updateFactoryFromUser,
  updateFactoryLegalDocs,
} from "Services/factory";
import "./FactoryProfile.css";

export default function FactoryProfile() {
  document.title = "Factory Profile";
  const countriesMiddleEast = useCountries();
  const {
    factoryProfile,
    errorloadingProfile,
    setFactoryProfile,
    clearSession,
    isLogin,
    updateCurrentUser,
  } = useFactoryProfile();

  const { initialAccountInfo, AccountInfoValidation } = useFormValidation(
    handleSubmitAccInfo,
    factoryProfile
  );

  const [isLoading, setIsLoading] = useState(false);
  const [modalShow, setModalShow] = useState({
    accountInfo: false,
    legalDocs: false,
  });
  const [errorMsg, setErrorMsg] = useState({});
  const [selectedDocs, setSelectedDocs] = useState([]);

  const modalIdNames = {
    editAccountInfo: "editAccountInfo",
    addLegalDocs: "addLegalDocs",
  };

  async function updateMedia(e) {
    setIsLoading(true);
    e.preventDefault();
    const data = new FormData();
    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

    let result = await addFactoryMedia({ Authorization: isLogin }, data);
    if (result?.success) {
      setFactoryProfile((prev) => ({
        ...prev,
        legalDocs: result?.data?.factory?.legalDocs,
      }));
      updateCurrentUser(result?.data?.factory);
      SuccessToast("data updated succcfully");

      handleClose();
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: result?.error,
      }));
    }
    setIsLoading(false);
    setTimeout(() => {
      document.body.style.cursor = "default";
    }, 5000); // 5000 milliseconds = 5 seconds
  }

  async function handleSingleFileUpload(fileKeyword, fileValue, index) {
    const formData = new FormData();
    formData.append(fileKeyword, fileValue);
    formData.append("index", index);
    return formData;
  }

  async function handleAddLegalDocs(e) {
    // document.body.style.cursor = "wait";

    if (
      factoryProfile?.legalDocs == null ||
      (Array.isArray(factoryProfile?.legalDocs) &&
        factoryProfile?.legalDocs?.length == 0)
    ) {
      console.log("entred condition 1");
      await updateMedia(e);
      return;
    }
    console.log("entred condition 2");

    e.preventDefault();
    let data = await handleSingleFileUpload(
      selectedDocs?.[0]?.keyWord,
      selectedDocs?.[0]?.pdfFile,
      factoryProfile?.legalDocs?.length
    );
    await handleLegalDocs(data, "add");
  }

  async function handleDeleteLegalDocs(index) {
    document.body.style.cursor = "wait";
    const data = await handleSingleFileUpload("legalDocs", null, index);
    await handleLegalDocs(data, "delete");
  }

  async function handleLegalDocs(data, actionType) {
    setIsLoading(true);
    const result = await updateFactoryLegalDocs(
      { Authorization: isLogin },
      data
    );

    if (result?.success) {
      setFactoryProfile((prev) => ({
        ...prev,
        legalDocs: result?.data?.factory?.legalDocs,
      }));
      updateCurrentUser(result?.data?.factory);
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

  const EmailNotificationUpdate2 = async (e) => {
    e.preventDefault();
    let data = {
      allowEmailNotification: !factoryProfile?.allowEmailNotification,
    };

    handleSubmitForm(data);
  };

  async function handleSubmitAccInfo(values) {
    const data = {
      repName: [values.repFirstName, values.repLastName],
      ...(factoryProfile?.repEmail !== values.repEmail && {
        repEmail: values.repEmail,
      }),
      ...(factoryProfile?.repPhone !==
        `${values.repPhoneCode}${values.repPhone}` && {
        repPhone: `${values.repPhoneCode}${values.repPhone}`,
      }),
    };
    await handleSubmitForm(data);
  }

  async function handleSubmitForm(values) {
    setIsLoading(true);
    setErrorMsg({});

    const result = await updateFactoryFromUser(
      { authorization: isLogin },
      values
    );

    if (result?.success) {
      SuccessToast("Data updated successfully");
      handleClose();

      setFactoryProfile((prev) => ({ ...prev, ...values }));
    } else {
      setErrorMsg({ response: result?.error });
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (factoryProfile) {
      AccountInfoValidation.setValues(initialAccountInfo);
    }
  }, [factoryProfile]);

  function handleClose() {
    setModalShow({
      accountInfo: false,
      legalDocs: false,
    });
    setErrorMsg({});

    AccountInfoValidation.resetForm({
      values: initialAccountInfo,
    });
    setSelectedDocs([]);
  }

  return (
    <>
      <div className="section factory-profile me-5 ms-5 mb-5 mt-2 ">
        <PageUtility currentPage="Factory Profile " />

        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {/* Account Info container 1 */}
              <AccountInformation
                factoryProfile={factoryProfile}
                handleClose={handleClose}
                errorMsg={errorMsg?.response}
                AccountInfoValidation={AccountInfoValidation}
                isLoading={isLoading}
                countriesMiddleEast={countriesMiddleEast}
                modalId={modalIdNames.editAccountInfo}
                setModalShow={setModalShow}
                modalShow={modalShow}
              />

              {/*Password change container 2 */}
              <ChangePassword
                errorMsg={errorMsg}
                setErrorMsg={setErrorMsg}
                isLogin={isLogin}
                isLoading={isLoading}
                clearSession={clearSession}
              />

              {/*Links container 2 */}
              <div id="EmailNotification"></div>
              <div className="container-profile-input w-100 gap-16">
                <p className="fs-24-semi">Notifications</p>
                <div className="d-flex justify-content-between align-items-center form-control">
                  <labe className="fs-16-semi m-0 p-0">
                    Allow Email Notifications
                  </labe>
                  <div className="form-check form-switch py-2">
                    <input
                      className="form-check-input switch-input cursor"
                      type="checkbox"
                      checked={factoryProfile?.allowEmailNotification}
                      onClick={EmailNotificationUpdate2}
                    />
                  </div>
                </div>
              </div>

              {/* Lecal certifcates   */}
              <LegalDocuments
                legalDocs={factoryProfile?.legalDocs}
                handleImageError={handleImageError}
                // handleShow={handleShow}
                deleteDocs={handleDeleteLegalDocs}
                setModalShow={setModalShow}
              />

              {/*subscriptionPlan*/}
              <SubscriptionPlan />
            </div>
          </div>
        </div>
      </div>

      {/*  legal docs */}

      <Modal
        show={modalShow?.legalDocs}
        onHide={() => handleClose()}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          <div className="modal-content   px-4 py-4">
            <div className="modal-header mb-3">
              <h4 className="modal-title fw-normal">
                Upload New Legal Documents
              </h4>

              <button
                type="button"
                className="close bg-0 border-0"
                aria-label="Close"
                data-bs-dismiss="modal"
                onClick={() => handleClose()}
              >
                <i className="fa-solid fa-xmark fs-24"></i>
              </button>
            </div>
            {/* <small>you can only add one image at a time</small> */}
            <div className="modal-body p-0 ">
              {" "}
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              )}
              <div className="w-100 ">
                <form
                  onSubmit={(e) => handleAddLegalDocs(e)}
                  encType="multipart/form-data"
                >
                  {/* legalDocs */}
                  <div className="row  row-gap">
                    <UploadDocument
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="legalDocs"
                      mediaMaxLen="1"
                      meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
                      setErrorMsg={setErrorMsg}
                      title="Upload Documents"
                      smallNote="you can upload up to 5 images, but only one image at a time."
                    />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap mt-3">
                      <button
                        className="border-0 rounded-3 bg-header fs-14 fw-600 px-3 py-2"
                        type="button"
                        data-bs-dismiss="modal"
                        onClick={() => handleClose()}
                      >
                        Close
                      </button>
                      {isLoading ? (
                        <button
                          type="button"
                          className="rounded-3 bg-main text-white px-4 py-2 border-0"
                        >
                          <i className="fas fa-spinner fa-spin text-white px-5"></i>
                        </button>
                      ) : (
                        <button
                          className="rounded-3 border-0 bg-main text-white px-3 py-2 fs-14 fw-bolder"
                          type="submit"
                          disabled={!(selectedDocs?.length > 0)}
                          id="saveLegalDocs"
                        >
                          Submit New Images
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
    </>
  );
}
