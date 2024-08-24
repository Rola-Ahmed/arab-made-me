import { useEffect, useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import PageUtility from "components/Shared/Dashboards/PageUtility";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import "./FactoryProfile.css";
import { handleImageError } from "utils/ImgNotFound";
import { countriesMiddleEast } from "constants/countries";
import SuccessToast from "components/SuccessToast";

import UploadDocument from "components/Forms/Shared/UploadDocument";

import ChangePassword from "./subComponents/ChangePassword/ChangePassword";
import AccountInformation from "./subComponents/AccountInformation";
import SubscriptionPlan from "./subComponents/SubscriptionPlan";
import LegalDocuments from "./subComponents/LegalDocuments";
import {
  fetchOneFactory,
  addFactoryMedia,
  updateFactoryFromUser,
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
  async function updateMedia(e) {
    setIsLoading(true);

    e.preventDefault();

    const data = new FormData();

    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

    let result = await addFactoryMedia(
      {
        Authorization: isLogin,
      },
      data
    );

    if (result?.success) {
      ModalClose();
      setSelectedDocs([]);
      SuccessToast("Data Updated Successfully");
      setFactoryProfile((prevErrors) => ({
        ...prevErrors,
        ...result?.data?.factories?.legalDocs,
      }));
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: result?.error,
      }));
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchFactoryPage();
  }, [currentUserData?.factoryId]);

  const [show, setShow] = useState({
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

  const EmailNotificationUpdate2 = async (e) => {
    e.preventDefault();
    let data = {
      allowEmailNotification: !factoryProfile?.allowEmailNotification,
    };

    submitForm(data);
  };

  console.log("AccountInfoValidation", AccountInfoValidation);

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
      ModalClose();
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

  function handleShow(value) {
    setShow((prevValue) => ({ ...prevValue, [value]: true }));
  }

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
                handleShow={handleShow}
              />

              {/*subscriptionPlan*/}
              <SubscriptionPlan />
            </div>
          </div>
        </div>
      </div>

      {/*  legal docs */}

      <div
        class="modal fade "
        id="addLegalDocs"
        tabindex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          class="modal-dialog  modal-dialog-centered modal-lg rounded-3"
          role="document"
        >
          <div class="modal-content   px-4 py-4">
            <div class="modal-header mb-3">
              <h4 class="modal-title fw-normal">Upload New Legal Documents</h4>
              <button
                type="button"
                class="close bg-0 border-0"
                data-dismiss="modal"
                aria-label="Close"
                data-bs-dismiss="modal"
                onClick={() => handleClose2()}
              >
                <i class="fa-solid fa-xmark fs-24"></i>
              </button>
            </div>
            <div class="modal-body p-0 ">
              {" "}
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              )}
              <div className="w-100 ">
                <form
                  onSubmit={(e) => updateMedia(e, "legalDocs")}
                  encType="multipart/form-data"
                >
                  {/* legalDocs */}
                  <div className="row  row-gap">
                    <UploadDocument
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="legalDocs"
                      mediaMaxLen="3"
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
                        <button type="button" className="rounded-3 bg-main text-white px-4 py-2 border-0">
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
