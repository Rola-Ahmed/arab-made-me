import Modal from "react-bootstrap/Modal";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import UploadDocument from "components/Forms/Shared/UploadDocument";

export default function ProductBanner({
  handleImageClick,
  images,
  onAddBanner,
  onDeleteBanner,
  handleShow,
  errorMsg,
  selectedDocs,
  show,
  handleClose,
  setErrorMsg,
  setSelectedDocs,
  isLoading,
}) {
  return (
    <>
      {" "}
      <div className="container-profile-input w-100 gap-16">
        <div className="title-contianer-input w-100">
          <p className="fs-24-semi"> Product Banners</p>
          <DisplayMultiImages
            handleImageClick={handleImageClick}
            images={images}
            deleteDocs={onDeleteBanner}
          />
          <button
            className="btn-edit w-fit-content"
            onClick={() => handleShow("imagesReadOnly")}
          >
            <p className="cursor">Upload </p>
          </button>
        </div>
      </div>
      <Modal
        show={show.imagesReadOnly}
        onHide={() => handleClose("imagesReadOnly")}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          {/* Account Info container 1 */}

          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Factory Banners</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              )}
              <div className="w-100 ">
                <form
                  onSubmit={(e) => onAddBanner(e, images?.length)}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <div className="col-12">
                      <UploadDocument
                        selectedDocs={selectedDocs}
                        errorMsg={errorMsg}
                        setSelectedDocs={setSelectedDocs}
                        MediaName="images"
                        mediaMaxLen="1"
                        meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                        setErrorMsg={setErrorMsg}
                        smallNote="you can upload up to 8 images, but only one image at a time."
                        // title="Factory Banners"
                      />
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <button
                        type="button"
                        onClick={() => handleClose("imagesReadOnly")}
                        className="btn btn-secondary"
                      >
                        Close
                      </button>

                      <button
                        className="defualt-btn main submitButton "
                        type="submit"
                        disabled={!(selectedDocs?.length > 0)}
                      >
                        {isLoading ? (
                          <i className="fas fa-spinner fa-spin text-white px-5"></i>
                        ) : (
                          `Submit`
                        )}
                      </button>
                      {/* )} */}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
