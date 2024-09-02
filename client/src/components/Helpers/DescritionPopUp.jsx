import { Modal } from "react-bootstrap";

// for btn actions
export default function DescritionPopUp(props) {
  const { show, description, onClose } = props;

  return (
    // size="md"
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className=" me-3 mt-3"></Modal.Header>
      <Modal.Body closeButton>
        <p className="text-center">{description}</p>
      </Modal.Body>
    </Modal>
  );
}
