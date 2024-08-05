import InputField from 'components/Forms/Shared/InputField';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
export default function SocialAccounts(props) {
  let { handleShow,socialLinks,SocialAccountValidation,handleClose,show,errorMsg,isLoading } = props;
  return (
    <>
      <div id="socialAccount"></div>
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p>Social Accounts</p>
          <div className="w-100 ">
            <div className="row grid-gap-col">
              <div className="col-12  ">
                <div className="d-flex justify-content-between align-items-center form-control">
                  <div className='d-flex gap-2 '>

                 
                  <div
                    className="social-accounts-icon-conainer facebook"
                    title="attach facebook link to the website"
                  >
                    <i className="fab fa-facebook-f fa-2x"></i>
                  </div>
                    <p className='my-auto readOnly'> {socialLinks?.facebook}</p>
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
              <div className='d-flex gap-2 '>
                  <div
                    className="social-accounts-icon-conainer instagram"
                    title="attach instagram link to the websitek"
                  >
                    <i className="fab fa-instagram fa-2x"></i>
                  </div>
                  <p className='my-auto readOnly'> {socialLinks?.instagram}</p>

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
                 
              <div className='d-flex gap-2 '>

                  <div
                    className="social-accounts-icon-conainer "
                    title="attach website link "
                  >
                    <i className="fa-solid fa-link fa-2x"></i>
                  </div>
                  <p className='my-auto readOnly'> {socialLinks?.website}</p>

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
                <div className='d-flex gap-2 '>

                  <div
                    className="social-accounts-icon-conainer border-success "
                    // title="attach website link to the website"
                  >
                    <i class="fa-brands fa-whatsapp fa-2x text-success"></i>
                  </div>

                  <p className='my-auto readOnly'> {socialLinks?.whatsapp}</p>

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




      {/* Social Links update form */}
    <form onSubmit={SocialAccountValidation.handleSubmit}>
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

          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Factory Inforamtion</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) }
              <div className="w-100 ">
                <form>
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

                          {/*  */}

                          {/* <div className="form-group"> */}
                            <InputField
                             formValidation={SocialAccountValidation}
                             vlaidationName='facebookLink'
                            //  isRequired,
                             title='facebook'
                             />
                          {/* </div> */}
                          {/*  */}
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
                             vlaidationName='instagramLink'
                            //  isRequired,
                             title='instagram'
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
                             vlaidationName='website'
                            //  isRequired,
                             title='website'
                             />
                        
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
          </div>
        </Modal.Body>
      </Modal>
    </form>
    </>
  );
}
