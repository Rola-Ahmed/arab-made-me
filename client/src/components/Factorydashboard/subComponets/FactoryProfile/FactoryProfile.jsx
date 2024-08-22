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
  let { currentUserData } = useContext(userDetails);

  let { isLogin, setIsLogin } = useContext(UserToken);
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
    if (factoryProfile?.repPhone !== values.repPhone) {
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
  }

  useEffect(() => {
    if (factoryProfile && factoryProfile.length !== 0) {
      AccountInfoValidation.setValues(initialAccountInfo);
    }
  }, [factoryProfile]);

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
    setShow((prevValue) => ({ ...prevValue, [value]: true }));
  }

  return (
    <>
      <div
        class="modal fade   factory-profile"
        id="editAccountInfo"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          class="modal-dialog  modal-dialog-centered modal-lg rounded-3"
          role="document"
        >
            <div class="modal-content   px-4 py-4">
              <div class="modal-header mb-3">
                <h4 class="modal-title fw-normal" id="exampleModalLabel">
                  Account Inforamtions
                </h4>
                <button
                  type="button"
                  class="close bg-0 border-0"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i class="fa-solid fa-xmark fs-24"></i>
                </button>
              </div>
              <div class="modal-body p-0 ">
                {" "}
                {errorMsg?.response ? (
                  <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                    {errorMsg?.response}
                  </div>
                ) : (
                  ""
                )}
                <div className="w-100  ">
                  <form onSubmit={AccountInfoValidation.handleSubmit}>
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representive first Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="repFirstName"
                              name="repFirstName"
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
                            <label>Representive Phone Number *</label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <select
                                  className="input-group-text h-100 p-2 m-0 phone-borders"
                                  id="repPhoneCode"
                                  onChange={AccountInfoValidation.handleChange}
                                  onBlur={AccountInfoValidation.handleBlur}
                                  value={
                                    AccountInfoValidation.values.repPhoneCode
                                  }
                                  // defaultValue={AccountInfoValidation.values.repPhoneCode}
                                >
                                  {countriesMiddleEast.map((phoneItem) => (
                                    <option
                                      //  selected={AccountInfoValidation.values.repPhoneCode==phoneItem.phoneCode}
                                      value={phoneItem.phoneCode}
                                      key={phoneItem.phoneCode}
                                    >
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

                      <div className="col-12 d-flex justify-content-start btn-modal-gap mt-3">
                        <button
                          className="btn btn-secondary"
                          type="button"
                          onClick={() => handleClose("accountInfoReadOnly")}
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
                          >
                            <p className="cursor">save changes</p>
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" class="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>

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
              />

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
                factoryProfile={factoryProfile}
                handleImageError={handleImageError}
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
                  <div className="row  row-gap">
                    <div className="col-6">
                      <div className="grid-gap-col">
                        <div className="form-group">
                          <label>Representive first Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="repFirstName"
                            name="repFirstName"
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
                          <label>Representive Phone Number *</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <select
                                className="input-group-text h-100 p-2 m-0 phone-borders"
                                id="repPhoneCode"
                                onChange={AccountInfoValidation.handleChange}
                                onBlur={AccountInfoValidation.handleBlur}
                                value={
                                  AccountInfoValidation.values.repPhoneCode
                                }
                                // defaultValue={AccountInfoValidation.values.repPhoneCode}
                              >
                                {countriesMiddleEast.map((phoneItem) => (
                                  <option
                                    //  selected={AccountInfoValidation.values.repPhoneCode==phoneItem.phoneCode}
                                    value={phoneItem.phoneCode}
                                    key={phoneItem.phoneCode}
                                  >
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
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => handleClose("accountInfoReadOnly")}
                      >
                        Close
                      </button>
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
                  <p>Legal Documents</p>
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

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => handleClose("legalDocsReadOnly")}
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
      {/* </form> */}
    </>
  );
}
