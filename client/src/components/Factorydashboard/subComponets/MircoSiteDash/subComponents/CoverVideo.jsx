import Modal from "react-bootstrap/Modal";
import UploadDocument from "components/Forms/Shared/UploadDocument";

export default function CoverVideo(props) {
  let {
    coverVideo,
    handleImageError,
    notEmpty,
    handleShow,
    show,
    handleClose,
    errorMsg,
    updateMedia,
    setErrorMsg,
    setSelectedDocs,
    selectedDocs,
    isLoading,
  } = props;
  return (
    <>
      {" "}
      <div id="CoverVideo"></div>
      <div className="container-profile-input w-100 gap-16 ">
        <p className="fs-24-semi">Cover Video</p>
        {/* ----------------------- */}
        <div className="row row-gap-15 w-100">
          <div className="col-12 h-fit-content">
            {notEmpty ? (
              <video
                controls="controls"
                autoPlay={false}
                muted={true}
                className="h-75 w-100  "
                // id={handleImageError}
                src={coverVideo}
                alt="Cover Video"
                onError={handleImageError}
              />
            ) : (
              <h5 className="text-muted text-center py-3">Empty</h5>
            )}
          </div>

          <div className="col-12">
            <button
              className="btn-edit fs-15 fw-600 text-white"
              onClick={() => handleShow("coverVideo")}
            >
              Upload
            </button>
          </div>
        </div>
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

          <div className="container-profile-input w-100 gap-16">
            <Modal.Header closeButton>
              <Modal.Title>
                <p className="fs-24-semi">Factory Logo</p>
              </Modal.Title>
            </Modal.Header>
            {errorMsg?.response && (
              <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                {errorMsg?.response}
              </div>
            )}
            <form
              className="w-100 "
              onSubmit={(e) => updateMedia(e, "coverImage")}
              encType="multipart/form-data"
            >
              <div className="row row-gap-16">
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
                  >
                    Close
                  </button>

                  <button
                    className="btn-edit submitButton text-white fs-15"
                    type="submit"
                    disabled={!(selectedDocs?.length > 0) || isLoading}
                  >
                    {isLoading ? (
                      <i className="fas fa-spinner fa-spin text-white px-5"></i>
                    ) : (
                      <>Submit</>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
