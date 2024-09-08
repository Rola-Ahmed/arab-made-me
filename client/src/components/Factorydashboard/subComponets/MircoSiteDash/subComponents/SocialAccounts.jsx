import FormVlaidtionError from "components/Forms/Shared/FormVlaidtionError";
import InputField from "components/Forms/Shared/InputField";
import Modal from "react-bootstrap/Modal";
export default function SocialAccounts(props) {
  let {
    handleShow,
    socialLinks,
    SocialAccountValidation,
    handleClose,
    show,
    errorMsg,
    isLoading,
    countriesMiddleEast,
  } = props;
  console.log("socialLinks", SocialAccountValidation);
  return (
    <>
      <div id="socialAccount"></div>

      <div className="container-profile-input w-100 gap-16">
        <p className="fs-24-semi">Social Accounts</p>
        <div className="row row-gap-12 w-100">
          <div className="col-12  ">
            <div className="d-flex justify-content-between align-items-center form-control">
              <div className="d-flex gap-2 ">
                <div
                  className="social-accounts-icon-conainer facebook"
                  title="attach facebook link to the website"
                >
                  <i className="fab fa-facebook-f fa-2x"></i>
                </div>
                <p className="my-auto readOnly"> {socialLinks?.facebook}</p>
              </div>
              <button
                className="btn-edit"
                type="button"
                onClick={() => handleShow("socialAccountsReadOnly")}
              >
                <p className="cursor">attach Link</p>
              </button>
            </div>
          </div>
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center form-control">
              <div className="d-flex gap-2 ">
                <div
                  className="social-accounts-icon-conainer instagram"
                  title="attach instagram link to the websitek"
                >
                  <i className="fab fa-instagram fa-2x"></i>
                </div>
                <p className="my-auto readOnly"> {socialLinks?.instagram}</p>
              </div>
              <button
                className="btn-edit"
                onClick={() => handleShow("socialAccountsReadOnly")}
              >
                <p className="cursor">attach Link</p>
              </button>
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center form-control">
              <div className="d-flex gap-2 ">
                <div
                  className="social-accounts-icon-conainer "
                  title="attach website link "
                >
                  <i className="fa-solid fa-link fa-2x"></i>
                </div>
                <p className="my-auto readOnly"> {socialLinks?.website}</p>
              </div>
              <button
                className="btn-edit"
                onClick={() => handleShow("socialAccountsReadOnly")}
              >
                <p className="cursor">attach Link</p>
              </button>
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center form-control">
              <div className="d-flex gap-2 ">
                <div
                  className="social-accounts-icon-conainer border-success "
                  // title="attach website link to the website"
                >
                  <i className="fa-brands fa-whatsapp fa-2x text-success"></i>
                </div>

                <p className="my-auto readOnly"> {socialLinks?.whatsapp}</p>
              </div>
              <button
                className="btn-edit"
                onClick={() => handleShow("socialAccountsReadOnly")}
              >
                <p className="cursor">attach Link</p>
              </button>
            </div>
          </div>
        </div>
      </div>

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
          {/* Account Info container 1 */}

          <div className="container-profile-input w-100  gap-16  ">
            <Modal.Header closeButton className="w-100">
              <Modal.Title>
                <p className="fs-24-semi">Factory Inforamtion</p>
              </Modal.Title>
            </Modal.Header>
            {errorMsg?.response && (
              <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                {errorMsg?.response}
              </div>
            )}
            {/* <div className="w-100 "> */}
            <form
              className="w-100 "
              onSubmit={SocialAccountValidation.handleSubmit}
            >
              <div className="row  row-gap-12 w-100 m-0">
                <div className="col-12  ">
                  <div className="d-flex justify-content-between align-items-center form-control">
                    <div
                      className="social-accounts-icon-conainer facebook"
                      title="attach facebook link to the website"
                    >
                      <i className="fab fa-facebook-f fa-2x"></i>
                    </div>

                    {/*  */}

                    <InputField
                      formValidation={SocialAccountValidation}
                      vlaidationName="facebookLink"
                      //  isRequired,
                      title="facebook"
                    />
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
                    <InputField
                      formValidation={SocialAccountValidation}
                      vlaidationName="instagramLink"
                      //  isRequired,
                      title="instagram"
                    />
                  </div>
                </div>

                <div className="col-6">
                  <div className="form-group">
                    <label className="form-title">Facatory Phone Number</label>
                    <div className="input-group  h-100">
                      <div className="input-group-prepend">
                        <select
                          className="input-group-text h-100 p-2 m-0 phone-borders"
                          id="whatsappPhoneCode"
                          placeholder="1113534343"
                          onChange={SocialAccountValidation.handleChange}
                          value={
                            SocialAccountValidation.values.whatsappPhoneCode
                          }
                          onBlur={SocialAccountValidation.handleBlur}
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
                        id="whatsapp"
                        placeholder="1113534343"
                        onChange={SocialAccountValidation.handleChange}
                        value={SocialAccountValidation.values.whatsapp}
                        onBlur={SocialAccountValidation.handleBlur}
                      />
                    </div>
                    <FormVlaidtionError
                      formValidation={SocialAccountValidation}
                      vlaidationName="whatsapp"
                    />
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
                    <InputField
                      formValidation={SocialAccountValidation}
                      vlaidationName="website"
                      //  isRequired,
                      title="website"
                    />
                  </div>
                </div>

                <div className="col-12 d-flex justify-content-start btn-modal-gap">
                  <button
                    type="button"
                    onClick={() => handleClose("socialAccountsReadOnly")}
                  >
                    Close
                  </button>

                  <button
                    className="btn-edit submitButton text-white"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <i className="fas fa-spinner fa-spin text-white px-5"></i>
                    ) : (
                      <> save changes</>
                    )}
                  </button>
                </div>
              </div>
            </form>
            {/* </div> */}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
