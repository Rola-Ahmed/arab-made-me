import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export default function ImporterUnVerifiedPopUpMsg(directTo) {
  let navigate = useNavigate();
  return (
    <Modal
      {...directTo}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="factory-profile "
    >
      <Modal.Body>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h3 className="mb-4">Buyer is Not Verifiyed yet</h3>
          </Modal.Title>
        </Modal.Header>

        <div className="w-100 ">
          <div className="row  row-gap">
            <div className="row row-container  border-css p-4">
              <div className="col-12 mb-4">
                <label>
                  Thank you for signing up for Arab Made. If you've been
                  directed to this page, it means you haven't completed the
                  registration process. Ensure you've completed the following
                  steps to become verified:
                </label>
              </div>

              <div className="col-12  justify-content-start align-items-center d-flex">
                <label className="h1    m-0 p-2 px-3 me-4 steps-text">1</label>

                <label className="m-0 p-0">
                  Make sure you have provided all the required legal documents
                  in your Buyer profile.
                </label>
              </div>

              <div className="col-12  justify-content-start align-items-center d-flex">
                <label className="h1    m-0 p-2 px-3 me-4 steps-text">2</label>

                <label>
                  Check your email to confirm Buyer Email Activation.
                </label>
              </div>

              <div className="col-12  justify-content-start align-items-center d-flex">
                <small className="py-4">
                  It might take up to 24 hours to fully activate your Buyer
                  account. If you can't access your services after that time,
                  please
                  <span className="text-main text-decoration-underline">
                    {" "}
                    contact support
                  </span>{" "}
                  .
                </small>
              </div>
            </div>

            <div className="col-12 d-flex justify-content-start btn-modal-gap">
              <Button
                variant="secondary"
                type="button"
                // onClick={handleClose}
                onClick={directTo.onHide}
                // onClick={()=>handleClose(true)}
              >
                Close
              </Button>
              <button
                type="button"
                className="btn-edit submitButton"
                onClick={() => {
                  navigate("/buyerRegistration");
                }}
              >
                <p className="cursor">Complete Buyer Verification</p>
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
