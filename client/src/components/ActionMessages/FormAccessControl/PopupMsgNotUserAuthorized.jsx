import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { userDetails } from "Context/userType";
import { useContext } from "react";

export default function UserNotAuthorized(directTo) {
  let { clearSession } = useContext(userDetails);

  let navigate = useNavigate();
  return (
    <Modal
      {...directTo}
      size="md-down"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="factory-profile "
    >
      <Modal.Body>
        <Modal.Header closeButton></Modal.Header>

        <div className="w-100 ">
          <div className="row  row-gap">
            <div className="form-group">
              <label className="w-100">
                To gain access, please register as a {directTo.userType}.
              </label>
              <p className="text-sub my-3 text-start">
                By clicking "Sign In," you will be signed out of your current
                account and redirected to the Sign In page.
              </p>
            </div>
            <div className="col-12 d-flex justify-content-start btn-modal-gap">
              <Button
                variant="secondary"
                type="button"
                onClick={directTo.onHide}
              >
                Close
              </Button>

              <button
                className="btn-edit submitButton"
              
                onClick={() => {
                  if (directTo?.goToPath) {
                    navigate(`/${directTo?.goToPath}`);
                  } else {
                    clearSession(); 
                    navigate("/signin");
                  }
                }}
              >
                <p className="cursor">sign In</p>
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
