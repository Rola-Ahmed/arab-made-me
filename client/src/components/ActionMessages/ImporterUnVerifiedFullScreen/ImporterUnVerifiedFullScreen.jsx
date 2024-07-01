import Footer from "components/main/Footer/Footer";
import Navbar from "components/main/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import {  Modal } from "react-bootstrap";

export default function ImporterUnVerifiedFullScreen(props) {
  let navigate = useNavigate();

  return (
    <>
      <Modal
        {...props}
        fullscreen={true}
        // size="md-down"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile "
        // fullscreen={true}
      >
        <Modal.Body className="p-0">
          <Navbar />

          <div className=" order-section  h-100 pt-5  action-msg">
            <section className="register-msg ">
              <div className=" container ">
                <div className="sec-div d-flex justify-content-center">
                  <div className="frame-container-1 p-5">
                    <div className="cont-frame-1 ">
                      <div className="text-center">
                        <i className="fa-solid fa-user-lock icon-msg"></i>
                      </div>

                      <label className="text-title m-auto">
                        Buyer is Not Verifiyed yet
                      </label>

                      <p className="text-sub m-auto">
                        Thank you for signing up for Arab Made. If you've been
                        directed to this page, it means you haven't completed
                        the registration process. Ensure you've completed the
                        following steps to become verified:
                      </p>

                      <div className="row border-css  ">
                        <div className="col-12  justify-content-start align-items-center d-flex">
                          <label className="h1    m-0 p-2 px-3 me-4 steps-text">
                            1
                          </label>

                          <label className="m-0 p-0">
                            Make sure you have provided all the required legal
                            documents in your Buyer profile.
                          </label>
                        </div>

                        <div className="col-12  justify-content-start align-items-center d-flex">
                          <label className="h1    m-0 p-2 px-3 me-4 steps-text">
                            2
                          </label>

                          <label>
                            Check your email to confirm Buyer Email Activation.
                          </label>
                        </div>

                        <div className="col-12  justify-content-start align-items-center d-flex">
                          <small className="py-4">
                            {" "}
                            It might take up to 24 hours to fully activate your
                            Buyer account. If you can't access your services
                            after that time, please
                            <span className="cont-btn"> contact support</span> .
                          </small>
                        </div>
                      </div>

                      <div className="row gap-row">
                        <div className="col-12 action">
                          <button
                            className="action-btn btn-1 w-100 submitButton"
                            onClick={() => {
                              navigate("/importerdashboard/importerProfile");
                            }}
                          >
                            <p className="cursor">
                              Complete Buyer Verification
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Footer />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
