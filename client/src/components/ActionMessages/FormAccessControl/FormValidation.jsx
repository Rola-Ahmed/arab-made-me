import Footer from "components/main/Footer/Footer";
import Navbar from "components/main/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { UserToken } from "Context/userToken";
import { useContext } from "react";

// {/* user it not buyer */}
// displayed in forms only
export default function FormValidation(props) {
  let { clearSession } = useContext(UserToken);

  let navigate = useNavigate();

  return (
    <Modal
      {...props}
      fullscreen={true}
      // size="md-down"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="factory-profile "
    >
      <Modal.Body className="p-0">
        <Navbar />

        <section className="register-msg ">
          <div className=" container ">
            <div className=" d-flex justify-content-center py-4 my-5">
              <div className="frame-container-1 ">
                <div className="cont-frame-1 ">
                  <div className="text-center">
                    <i className="fa-solid fa-user-lock icon-msg"></i>
                  </div>

                  <p className="text-sub m-auto">
                    Kindly register as a {props.userType} to obtain access.
                  </p>
                  <p className="text-sub m-auto">
                    By clicking "Sign In" or "Sign Up", you will be signed out
                    of your current account and redirected to the Sign In page.
                  </p>

                  <div className="row gap-12">
                    <div className="col-12 action">
                      <button
                        className="action-btn btn-1 w-100 submitButton"
                        onClick={() => {
                          clearSession();
                          navigate("/signup");
                        }}
                      >
                        SignUp
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center">
                    <small className="text-muted title-small">
                      Already have an account?
                      <span
                        className="fw-bolder"
                        onClick={() => {
                          clearSession();
                          navigate("/signIn");
                        }}
                      >
                        Sign In
                      </span>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </Modal.Body>
    </Modal>
  );
}
