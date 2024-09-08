import Modal from "react-bootstrap/Modal";
import { UploadVedio } from "components/Forms/Shared/UploadDocument";
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
              onClick={() => handleShow("coverImgReadOnly")}
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

          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Cover Video</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}
              <div className="w-100 ">
                <form
                  onSubmit={(e) => updateMedia(e, "coverImgReadOnly")}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <UploadVedio
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="coverVideo"
                      mediaMaxLen="1"
                      meidaAcceptedExtensions={["mp4", "mkv", "x-matroska"]}
                      setErrorMsg={setErrorMsg}
                      // title="Certificates"
                    />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <button
                        variant="secondary"
                        type="button"
                        onClick={() => handleClose("coverVideo")}
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
                          <p className="cursor">Submit Video</p>
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
