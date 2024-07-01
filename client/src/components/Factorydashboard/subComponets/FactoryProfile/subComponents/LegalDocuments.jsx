import { useState } from "react";
import { baseUrl_IMG } from "config.js";
import Carousel from "react-grid-carousel";
import Modal from "react-bootstrap/Modal";

export default function LegalDocuments(props) {
  let {
    factoryProfile,

    pdfIcon,
    handleImageError,
    Button,
    handleShow,
  } = props;

  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });
  return (
    <>
      <div id="legalDocs"></div>
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          {" "}
          <p className="">Legal Documents</p>
          <div className="w-100 ">
            {" "}
            {/* ----------------------- */}
            <div className="row grid-gap-col">
              <div className="col-12">
                {factoryProfile?.legalDocs ? (
                  <Carousel
                    cols={2}
                    rows={1}
                    gap={10}
                    scrollSnap={true}
                    loop
                    showDots
                    hideArrow={false}
                  >
                    {factoryProfile?.legalDocs?.map((item) => (
                      <Carousel.Item>
                        <div
                          className="dots-slider-img w-100  cursor"
                          onClick={() => {
                            setShowImagePop({
                              display: true,
                              imagePath: `${baseUrl_IMG}/${item}`,
                            });
                            // }
                          }}
                        >
                          <img
                            className="h-100 w-100 "
                            id={handleImageError}
                            src={
                              item?.includes("pdf")
                                ? pdfIcon
                                : `${baseUrl_IMG}/${item}`
                            }
                            alt={item?.pdfFile?.name?.includes("pdf")}
                            onError={handleImageError}
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <h5 className="text-muted text-center py-3">Empty</h5>
                )}
              </div>

              <div className="col-12">
                <Button
                  className="btn-edit"
                  variant="primary"
                  onClick={() => handleShow("legalDocsReadOnly")}
                >
                  <p className="cursor">Upload </p>
                </Button>
              </div>
            </div>
            {/* </form> */}
            {/* ----------------------- */}
          </div>
        </div>
      </div>

      <Modal
        show={showImagePop.display}
        // show={true}
        onHide={() =>
          setShowImagePop({
            display: false,
            imagePath: "",
          })
        }
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
        centered
        className="factory-profile"
        dialogClassName="modal-90w"
        // aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body closeButton>
          {/* Account Info container 1 */}

          <div closeButton className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              {/* <p>Account Inforamtions</p> */}
              <Modal.Header closeButton>
                <Modal.Title>Legal Documents</Modal.Title>
              </Modal.Header>

              <div className="w-100 ">
                {" "}
                <div className="row row-gap">
                  {showImagePop.imagePath?.includes("pdf") ? (
                    <embed
                      src={showImagePop.imagePath}
                      width="800px"
                      height="2100px"
                      onError={handleImageError}
                    />
                  ) : (
                    <img
                      src={showImagePop.imagePath}
                      alt={showImagePop.imagePath}
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
