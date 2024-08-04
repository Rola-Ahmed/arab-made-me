import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ProductDetails from "./SelectedProductDetails";
import Carousel from "react-grid-carousel";
import { handleImageError } from "utils/ImgNotFound";
import { baseUrl_IMG } from "config.js";

export default function EtcProductPopUp(directTo) {

  let navigate = useNavigate();
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
            <Carousel
              cols={2}
              rows={1}
              gap={15}
              scrollSnap={true}
              loop
              //   showDots={false}
              //   hideArrow={false}
            >
              <Carousel.Item>
                <div className="vh-75 ">
                  <img
                    className="w-100 h-100"
                    src={`${baseUrl_IMG}/${directTo?.selectedItemId?.coverImage}`}
                    onError={handleImageError}
                    alt="sourcing request img"
                  />
                </div>
              </Carousel.Item>

              {directTo?.selectedItemId?.images?.map((item) => (
                <Carousel.Item>
                  <div className="vh-75 ">
                    <img
                      className="w-100 h-100"
                      src={`${baseUrl_IMG}/${item}`}
                      onError={handleImageError}
                      alt="sourcing request img"
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
            <div className="row  row-gap  ps-4">
              <div className="col-12 d-flex justify-content-start btn-modal-gap ">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={directTo.onHide}
                >
                  Close
                </Button>
                {/* will use agaib */}
                <button
                  className="btn-edit submitButton d"
                  // type="submit"
                  onClick={() => navigate(directTo?.distination)}
                >
                  <p className="cursor"> More Details</p>
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
