import { Modal } from "react-bootstrap";

// for btn actions
export default function DescritionPopUp(props) {
  const { show, description, onClose } = props;

  return (
    <Modal show={show} onHide={onClose} size="md" centered >
      <Modal.Header closeButton className=" me-3 mt-3" >
      </Modal.Header>
      <Modal.Body closeButton>
        <p>{description}</p>
      </Modal.Body>
    </Modal>
  );
}
