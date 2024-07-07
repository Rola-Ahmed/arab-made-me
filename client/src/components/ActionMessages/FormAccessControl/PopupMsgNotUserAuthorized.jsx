import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export default function UserNotAuthorized(directTo) {
  let navigate = useNavigate();
  return (
    <Modal
      {...directTo}
      size="md-down"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="factory-profile "
      fullscreen={true}
    >
      <Modal.Body>
        <Modal.Header closeButton></Modal.Header>

        <div className="w-100 ">
          <div className="row  row-gap">
            <div className="form-group">
              <label className="w-100">
                To gain access, please register as a {directTo.userType}.
              </label>
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
                  navigate("/signin");
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
