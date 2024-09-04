import { useEffect, useState, useContext } from "react";
import PageUtility from "components/Shared/Dashboards/PageUtility";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import "./FactoryProfile.css";
import { handleImageError } from "utils/ImgNotFound";
import { countriesMiddleEast } from "constants/countries";
import SuccessToast from "components/SuccessToast";
import ErrorToast from "components/ErrorToast";

import UploadDocument from "components/Forms/Shared/UploadDocument";

import ChangePassword from "./subComponents/ChangePassword/ChangePassword";
import AccountInformation from "./subComponents/AccountInformation";
import SubscriptionPlan from "./subComponents/SubscriptionPlan";
import LegalDocuments from "./subComponents/LegalDocuments";
import {
  fetchOneFactory,
  updateFactoryFromUser,
  updateFactoryLegalDocs,
} from "Services/factory";
import useFormValidation from "./hooks/useFormValidation";
export default function FactoryProfile() {
  document.title = "Factory Profile";
  let { currentUserData, clearSession } = useContext(userDetails);

  let { isLogin } = useContext(UserToken);
  let [factoryProfile, setFactoryProfile] = useState();

  let { initialAccountInfo, AccountInfoValidation } = useFormValidation(
    submitAccInfo,
    factoryProfile
  );

  const modalIdNames = {
    editAccountInfo: "editAccountInfo",
    addLegalDocs: "addLegalDocs",
  };

  const [isLoading, setIsLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState();

  // slider setting

  const [selectedDocs, setSelectedDocs] = useState([]);

  // api
  async function fetchFactoryPage() {
    let result = await fetchOneFactory(currentUserData?.factoryId);
    if (result?.success) {
      setFactoryProfile((prevErrors) => ({
        ...prevErrors,
        ...result?.data?.factories,
      }));
    }
  }

  // Cover IMage Profile -----------------------------------------------------

  const handleSingleFileUpload = (fileKeyword, fileValue, index) => {
    const formData = new FormData();

    // Append the file with the keyWord as the field name
    formData.append(fileKeyword, fileValue);

    // Optionally append additional data such as the index
    formData.append("index", index);

    return formData;
  };

  async function addLegalDocs(e) {
    let actionType = "add";
    e.preventDefault();

    let data = handleSingleFileUpload(
      selectedDocs?.[0]?.keyWord,
      selectedDocs?.[0]?.pdfFile,
      factoryProfile?.legalDocs?.length
    );

    updateLegalDocs(data, actionType);
  }

  async function deleteLegalDocs(index) {
    let actionType = "delete";
    let data = handleSingleFileUpload("legalDocs", null, index);

    updateLegalDocs(data, actionType);
  }

  async function updateLegalDocs(data, actionType) {
    setIsLoading(true);

    let result = await updateFactoryLegalDocs(
      {
        Authorization: isLogin,
      },
      data
    );

    if (result?.success) {
      const modal = document.getElementById("addLegalDocs");
      modal.classList.remove("show"); // Remove the 'show' class
      modal.classList.add("d-none"); // Remove the 'show' class
      setSelectedDocs([]);
      SuccessToast("Data Updated Successfully");
      setFactoryProfile((prevErrors) => ({
        ...prevErrors,
        ...result?.data?.factory?.legalDocs,
        legalDocs: result?.data?.factory?.legalDocs,
      }));
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
  }

  useEffect(() => {
    fetchFactoryPage();
  }, [currentUserData?.factoryId]);

  const EmailNotificationUpdate2 = async (e) => {
    e.preventDefault();
    let data = {
      allowEmailNotification: !factoryProfile?.allowEmailNotification,
    };

    submitForm(data);
  };

  function submitAccInfo(values) {
    let data = {};
    data.repName = [values.repFirstName, values.repLastName];
    if (factoryProfile?.repEmail !== values.repEmail) {
      data.repEmail = values.repEmail;
    }
    if (
      factoryProfile?.repPhone != `${values.repPhoneCode}${values.repPhone}`
    ) {
      data.repPhone = `${values.repPhoneCode}${values.repPhone}`;
    }
    submitForm(data);
  }

  async function submitForm(values) {
    let data = values;
    setIsLoading(true);
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    const result = await updateFactoryFromUser(
      {
        authorization: isLogin,
      },
      data
    );

    if (result?.success) {
      // ModalClose();
      const modal = document.getElementById(modalIdNames.editAccountInfo);
      modal.classList.remove("show"); // Remove the 'show' class
      modal.classList.add("d-none"); // Remove the 'show' class
      SuccessToast("data updated succcfully");

      setFactoryProfile((prevErrors) => ({
        ...prevErrors,
        ...data,
      }));
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: result?.error,
      }));
    }

    setIsLoading(false);

    const modal = document.getElementById("editAccountInfo");
    modal.classList.remove("show"); // Remove the 'show' class
    modal.classList.add("d-none"); // Remove the 'show' class
  }

  useEffect(() => {
    if (factoryProfile && factoryProfile.length !== 0) {
      AccountInfoValidation.setValues(initialAccountInfo);
    }
  }, [factoryProfile]);

  function handleClose2() {
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

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

  return (
    <>
      <div className="section factory-profile me-5 ms-5 mb-5 mt-2 ">
        <PageUtility currentPage="Factory Profile " />

        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {/* Account Info container 1 */}
              <AccountInformation
                currentUserData={currentUserData}
                factoryProfile={factoryProfile}
                handleClose={handleClose2}
                errorMsg={errorMsg?.response}
                AccountInfoValidation={AccountInfoValidation}
                isLoading={isLoading}
                countriesMiddleEast={countriesMiddleEast}
                modalId={modalIdNames.editAccountInfo}
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
                deleteLegalDocs={deleteLegalDocs}
              />

              {/*subscriptionPlan*/}
              <SubscriptionPlan />
            </div>
          </div>
        </div>
      </div>

      {/*  legal docs */}

      <div
        className="modal fade "
        id="addLegalDocs"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="modal-dialog  modal-dialog-centered modal-lg rounded-3"
          role="document"
        >
          <div className="modal-content   px-4 py-4">
            <div className="modal-header mb-3">
              <h4 className="modal-title fw-normal">
                Upload New Legal Documents
              </h4>
              <button
                type="button"
                className="close bg-0 border-0"
                data-dismiss="modal"
                aria-label="Close"
                data-bs-dismiss="modal"
                onClick={() => handleClose2()}
              >
                <i className="fa-solid fa-xmark fs-24"></i>
              </button>
            </div>
            <div className="modal-body p-0 ">
              {" "}
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              )}
              <div className="w-100 ">
                <form
                  onSubmit={(e) => addLegalDocs(e)}
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
                    />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap mt-3">
                      <button
                        className="border-0 rounded-3 bg-header fs-14 fw-600 px-3 py-2"
                        type="button"
                        data-bs-dismiss="modal"
                        onClick={() => handleClose2()}
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
        </div>
      </div>
    </>
  );
}
