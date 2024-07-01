import { Modal } from "react-bootstrap";

// used in dashboard 
export default function LoadingProccess(props) {
  // if there 
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="example-custom-modal-styling-title"
      centered
      className="factory-profile"
      dialogClassName="modal-90w"
    >
      <Modal.Body closeButton>
        <div closeButton className="container-profile-input w-100">
          <div className="title-contianer-input w-100">
            <div className="w-100 d-flex align-items-center justify-content-center ">
              <i className="fas fa-spinner fa-spin text-dark text-center fa-2x"></i>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
