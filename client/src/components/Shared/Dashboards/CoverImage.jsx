import UploadDocument from "components/Forms/Shared/UploadDocument";
import DisplayOneImage from "components/Shared/Dashboards/DisplayOneImage";
import { Modal } from "react-bootstrap";

export default function CoverImage({
  handleImageClick,
  handleShow,
  coverImage,
  show,
  handleClose,
  errorMsg,
  setSelectedDocs,
  selectedDocs,
  setErrorMsg,
  isLoading,
  updateMeida,
}) {
  return (
    <>
      <div className="container-profile-input w-100  gap-16">
        <p className="fs-24-semi"> Cover Image</p>
        <DisplayOneImage
          handleImageClick={handleImageClick}
          image={coverImage}
        />
        <button
          className="btn-edit w-fit-content"
          onClick={() => handleShow("coverImgReadOnly")}
        >
          <p className="cursor">Upload </p>
        </button>
      </div>
      <Modal
        show={show.coverImgReadOnly}
        onHide={() => handleClose("coverImgReadOnly")}
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
                  <p>product cover Image</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              )}
              <div className="w-100 ">
                <form
                  onSubmit={(e) => updateMeida(e, selectedDocs)}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <UploadDocument
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="coverImage"
                      mediaMaxLen="1"
                      meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                      setErrorMsg={setErrorMsg}
                      // title="Factory Banners"
                    />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <button
                        type="button"
                        onClick={() => handleClose("coverImgReadOnly")}
                        className="btn btn-secondary"
                      >
                        Close
                      </button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white px-5"></i>
                        </button>
                      ) : (
                        <button
                          className="btn-edit submitButton"
                          type="submit"
                          disabled={!(selectedDocs?.length > 0)}
                        >
                          <p className="cursor">Submit</p>
                        </button>
                      )}
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
