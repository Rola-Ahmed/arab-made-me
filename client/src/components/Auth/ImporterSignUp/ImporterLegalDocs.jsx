import { useState, useContext, useEffect } from "react";
import { awaitImg, checkedImg } from "constants/Images";
import { useNavigate } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { addImporterMedia } from "Services/importer";
import UploadDocument from "components/Forms/Shared/UploadDocument";

function ImporterRepDetails() {
  let { isLogin } = useContext(UserToken);

  document.title = "Buyer Registration";
  useEffect(() => {
    if (!isLogin) {
      navigate(`/signIn/buyerRegistration`);
    }
  }, [isLogin]);

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);

  // ------------------------------------------------new
  async function UploadDocs(e) {
    e.preventDefault();

    setIsLoading(true);

    const FormData = require("form-data");
    let data = new FormData();

    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

    let result = await addImporterMedia(
      {
        authorization: isLogin,
      },
      data
    );

    // console.log("resultresult", result);

    if (result?.success) {
      navigate(`/importerdashboard`);
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: result?.error,
      }));
      const targetElement = document.getElementById("view");
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    setIsLoading(false);
  }

  

  return (
    <>
      <section id="view" className="register-msg ">
        {/* <div className="container "> */}
        <div className=" container ">
          <div className=" cont-1 d-flex justify-content-center align-items-center mx-auto  ">
            <div className=" sub-cont-buyer w-100">
              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="img-cont ms-5">
                    <img src={checkedImg} alt="" />
                  </div>

                  <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont  ">Select Your Role</p>
              </div>

              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                  <div className="img-cont">
                    <img src={checkedImg} alt="" />
                  </div>

                  <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont text-center active">
                  Representive Information
                </p>
              </div>
              {/*  */}
              {/*  */}
              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                  <div className="img-cont me-5">
                    <img src={awaitImg} alt="" />
                  </div>
                </div>
                <p className="text-cont text-end">Legal Documents</p>
              </div>
              {/*  */}
            </div>
          </div>

          <form
            onSubmit={(e) => UploadDocs(e)}
            className="header w-100"
            encType="multipart/form-data"
          >
            <div className="sec-div d-flex justify-content-center">
              <div className="frame-container-2 ">
                <div className="cont-frame-1 ">
                  {errorMsg?.response && (
                    <p className="text-sub m-auto alert  alert-danger  text-dark w-100">
                      {errorMsg.response}
                    </p>
                  )}

                  <div className="row gap-12-32">
                    {/* factory profileeee */}

                    <UploadDocument
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="image"
                      mediaMaxLen="8"
                      meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                      setErrorMsg={setErrorMsg}
                      title="Profile picture"
                    />

                    <UploadDocument
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="legalDocs"
                      mediaMaxLen="3"
                      meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
                      setErrorMsg={setErrorMsg}
                      title="Legal Documents"
                    />

                    <div className="col-12 action">
                      {isLoading ? (
                        <button
                          type="button"
                          className="action-btn btn-1 w-100"
                        >
                          <i className="fas fa-spinner fa-spin"></i>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="action-btn btn-1 w-100 submitButton"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-center">
                    <small
                      className="text-muted title-small cursor"
                      onClick={() => {
                        navigate(`/`);
                      }}
                    >
                      Skip
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default ImporterRepDetails;
