export default function SocialAccounts(props) {
  let { handleShow, Button } = props;
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
    </>
  );
}
