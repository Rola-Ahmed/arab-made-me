import { Modal } from "react-bootstrap";
import { handleImageError } from "utils/ImgNotFound";

export default function MediaPopUp(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="example-custom-modal-styling-title"
      centered
      className="factory-profile"
      dialogClassName="modal-90w"
    >
      <Modal.Body closeButton>
        <div closeButton className="container-profile-input w-100">
          <div className="title-contianer-input w-100">
            {/* <p>Account Inforamtions</p> */}
            <Modal.Header closeButton>
              <Modal.Title> Documents</Modal.Title>
            </Modal.Header>

            <div className="w-100 ">
              <div className="row row-gap">
                {props?.showImagePop?.includes("pdf") ? (
                  <embed
                    src={props.showImagePop}
                    width="800px"
                    height="2100px"
                    style={{ pointerEvents: "none" }}
                    onError={handleImageError}

                  />
                ) : (
                  <img
                    src={props?.showImagePop}
                    alt={props?.showImagePop}
                    onError={handleImageError}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
