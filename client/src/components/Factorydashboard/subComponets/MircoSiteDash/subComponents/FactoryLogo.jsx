import Modal from "react-bootstrap/Modal";
import UploadDocument from "components/Forms/Shared/UploadDocument";

export default function FactoryLogo(props) {
  let {
    handleImageError,
    handleShow,
    show,
    coverImage,
    handleClose,
    updateMedia,
    setSelectedDocs,
    errorMsg,
    selectedDocs,
    setErrorMsg,
    isLoading,
  } = props;

  return (
    <>
      <div id="factorylogo"></div>

      <div className="container-profile-input w-100 gap-16  ">
        <p className="fs-24-semi">factory logo </p>
        <div className="grid-gap-col position-relative ">
          <div className="factory-logo  edit-img border  ">
            <img
              className="w-100 h-100 "
              src={coverImage}
              alt="factory coverImage"
              onError={handleImageError}
            />
          </div>

          {/* icon */}
          <div className="edit-icon-profile-btn position-absolute  cursor">
            <label
              htmlFor="imgupload"
              onClick={() => handleShow("coverImgReadOnly")}
            >
              <i className="fa-solid fa-pen-to-square  cursor"></i>
            </label>
          </div>
        </div>
      </div>

      {/* Factory Banners */}
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
                  <p>Factory Logo</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              )}
              <div className="w-100 ">
                <form
                  onSubmit={(e) => updateMedia(e)}
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
