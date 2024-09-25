import { useState } from "react";

import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ProductDetails from "./SelectedProductDetails";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import MediaPopUp from "components/Shared/MediaPopUp/MediaPopUp";

export default function EtcProductPopUp(directTo) {
  let navigate = useNavigate();
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });
  const handleImageClick = (imagePath) => {
    setShowImagePop({
      display: true,
      imagePath,
    });
  };
  return (
    <>
      <Modal
        {...directTo}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={`factory-profile  ${directTo?.bgBlur} `}

        // backdrop="static"
        // keyboard={false}
      >
        <Modal.Body>
          <Modal.Header closeButton>
            {/* <Modal.Title id="contained-modal-title-vcenter">
              Product Details
            </Modal.Title> */}
          </Modal.Header>

          <div className="w-100  m-auto d-grid gap-16 ">
            <div className="w-100 ps-3">
              <ProductDetails productDetails={directTo?.selectedItemId} />
            </div>

            <div className="container-profile-input w-100">
              <div className="title-contianer-input w-100">
                <p className="h5 fw-bolder title-header"> Images</p>
                <DisplayMultiImages
                  handleImageClick={handleImageClick}
                  images={[
                    directTo?.selectedItemId?.coverImage, // Include as a single image
                    ...(Array.isArray(directTo?.selectedItemId?.images)
                      ? directTo.selectedItemId.images
                      : []), // Spread only if it's an array
                  ].filter(Boolean)}
                />
              </div>
            </div>
            <div className="row  row-gap  ps-4">
              <div className="col-12 d-flex justify-content-start btn-modal-gap ">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={directTo.onHide}
                >
                  Close
                </Button>
                {/* will use again */}
                {/* <button
                  className="btn-edit submitButton d-none"
                  // type="submit"
                  onClick={() => navigate(directTo?.distination)}
                >
                  <p className="cursor"> More Details</p>
                </button> */}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <MediaPopUp
        show={showImagePop.display}
        onHide={() =>
          setShowImagePop({
            display: false,
            imagePath: "",
          })
        }
        showImagePop={showImagePop.imagePath}
      />
    </>
  );
}
