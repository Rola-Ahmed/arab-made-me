import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export default function IsLoggedInMsg(directTo) {
  let navigate = useNavigate();
  return (
    <>
      <Modal
        {...directTo}
        size="md-down"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={`factory-profile  ${directTo?.bgBlur} `}

        // backdrop="static"
        // keyboard={false}
      >
        <Modal.Body>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              You need to Login First
            </Modal.Title>
          </Modal.Header>

          <div className="w-100 ">
            <div className="row  row-gap">
              <div className="col-6">
                <div className="grid-gap-col">
                  <div className="form-group">
                    <label>Direct to login Page</label>
                  </div>
                </div>
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
                  // type="submit"
                  onClick={() => navigate(directTo?.distination)}
                >
                  <p className="cursor">Login</p>
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
