import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function DefaultUserNotAuthorizedModal({
  show,
  onHide,
  goToPath,
}) {
  let navigate = useNavigate();
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="factory-profile "
    >
      <Modal.Body>
        <Modal.Header closeButton></Modal.Header>

        <div className="w-100 ">
          <div className="row  row-gap">
            <div className="form-group">
              <label className="fw-normal  mb-3 fs-14 lh-base">
                To gain access, please continue your registration.
              </label>
              <label className="fw-normal  mb-3 fs-14 lh-base">
                you have two roles :{" "}
                <span className="fw-bolder">factory and buyer</span>
              </label>
              <label className="fw-normal mb-3 fs-14 lh-base">
                The <span className="fw-bolder">factory</span> is likely
                represents a manufacturer or supplier who produces goods or
                materials. This user might have access to tools and features
                that allow them to manage production lines, inventory, product
                listings, pricing, and possibly interact with buyers.
              </label>
              <label className="fw-normal mb-3 fs-14 lh-base">
                The <span className="fw-bolder">Buyer</span> is likely an
                individual or organization looking to purchase products or
                services from the factories Or applying Souring Request. The
                Buyer would need tools to browse offerings, place orders, manage
                their purchases, and possibly negotiate terms.
              </label>
            </div>
            <div className="col-12 d-flex justify-content-start btn-modal-gap">
              <Button variant="secondary" type="button" onClick={onHide}>
                Close
              </Button>

              <button
                className="btn-edit submitButton"
                onClick={() => {
                  navigate(`/${goToPath}`);
                }}
              >
                <p className="cursor">continue registration</p>
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
