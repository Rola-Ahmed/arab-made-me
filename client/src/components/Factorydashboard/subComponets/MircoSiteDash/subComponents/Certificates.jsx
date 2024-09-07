import Modal from "react-bootstrap/Modal";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";

import UploadDocument from "components/Forms/Shared/UploadDocument";
export default function Certificates(props) {
  let {
    handleImageClick,
    qualityCertificates,
    handleShow,
    show,
    handleClose,
    errorMsg,
    selectedDocs,
    isLoading,
    updateMedia,
    setErrorMsg,
    setSelectedDocs,
  } = props;
  return (
    <>
      <div id="certificates"></div>
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p> Certificates</p>
          <DisplayMultiImages
            handleImageClick={handleImageClick}
            images={qualityCertificates}
          />
          <button
            className="btn-edit w-fit-content"
            onClick={() => handleShow("qualityCertificatesReadOnly")}
          >
            <p className="cursor">Upload </p>
          </button>
        </div>
      </div>

      {/* update factory banner */}
      <Modal
        show={show.qualityCertificatesReadOnly}
        onHide={() => handleClose("qualityCertificatesReadOnly")}
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
                  <p>Certificates</p>
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
                  onSubmit={(e) => updateMedia(e, "qualityCertificates")}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <UploadDocument
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="qualityCertificates"
                      mediaMaxLen="3"
                      meidaAcceptedExtensions={[
                        "pdf",
                        "png",
                        "jpeg",
                        "jpg",
                        "psd",
                        "webp",
                      ]}
                      setErrorMsg={setErrorMsg}
                      // title="Certificates"
                    />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <button
                        variant="secondary"
                        type="button"
                        onClick={() =>
                          handleClose("qualityCertificatesReadOnly")
                        }
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
                          <p className="cursor">Submit for review</p>
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
