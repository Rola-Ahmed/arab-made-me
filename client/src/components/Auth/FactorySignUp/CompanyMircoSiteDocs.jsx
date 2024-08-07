import { useState, useContext, useEffect } from "react";
import UploadDocument,{UploadVedio} from "components/Forms/Shared/UploadDocument";

import { awaitImg, currentsubPoint } from "constants/Images";
import { addFactoryMedia } from "Services/factory";

import { useNavigate } from "react-router-dom";

import { UserToken } from "Context/userToken";

import SelectRole from "./TimeLineHeader/SelectRole";
import Nextpoint from "./TimeLineHeader/NextPoint";
import LastPointStatus from "./TimeLineHeader/LastPointStatus";
import { userDetails } from "Context/userType";

function CompanyMircoSiteDocs() {
  let { isLogin } = useContext(UserToken);
  let { setCurrentUserData, currentUserData } = useContext(userDetails);

  let navigate = useNavigate();
  let currentUrl = window.location.pathname;
  document.title = "Company Registration";

  useEffect(() => {
    if (!isLogin) {
      navigate(`/signIn${currentUrl}`);
    }
    if (currentUserData && currentUserData?.importerId) {
      navigate("/403");
    }
  }, [isLogin, currentUserData]);
  const [errorMsg, setErrorMsg] = useState();

  const [isLoading, setIsLoading] = useState("");

  // ------------------------------------------------new
  async function UploadDocs(e) {
    setIsLoading(true);
    e.preventDefault();
    let data = new FormData();
    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));
    try {
      let result = await addFactoryMedia({ authorization: isLogin }, data);
      if (result?.success) {
        setCurrentUserData((prevUserData) => ({
          ...prevUserData,
          factoryId: result?.data?.factory?.id,
        }));

        setIsLoading(true);
        navigate(`/CompanyDetails/RepresentiveDetails`);
      } else {
        setIsLoading(false);
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
    } catch (error) {}
  }

  const [selectedDocs, setSelectedDocs] = useState([
    // {
    //   keyWord: null,
    //   pdfFile: null,
    // },
  ]);
  return (
    <section id="view" className="register-msg ">
      {/* <div className="container "> */}
      <div className=" container ">
        <div className=" cont-1 d-flex justify-content-center align-items-center mx-auto  ">
          <div className=" sub-cont w-100">
            <SelectRole />
            <div className=" text-check ">
              <div className="  timeline-reg d-flex">
                <div className="w-100 vertical-line mt-auto mb-auto"></div>
                <div className="img-cont">
                  <img src={awaitImg} alt="" />
                </div>

                <div className="w-25 vertical-line  mt-auto mb-auto"></div>
                <div className="img-cont d-flex align-items-center ">
                  <img src={currentsubPoint} alt="" />
                </div>
                <div className="w-25 vertical-line  mt-auto mb-auto"></div>

                <div className="img-cont  d-flex align-items-center">
                  <img src={currentsubPoint} alt="" />
                </div>
                <div className="w-25 vertical-line  mt-auto mb-auto"></div>

                <div className="img-cont  d-flex align-items-center">
                  <img src={currentsubPoint} alt="" />
                </div>
                <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
              </div>
              <p className="text-cont text-center">Company Microsite Details</p>
            </div>

            <Nextpoint title="Representive Information" />

            <LastPointStatus title="Legal Documents" isCurrentPoint={false} />
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

                <div className="row gap-row-2">
                  {/* factory cover Images */}

                  <UploadDocument
                    selectedDocs={selectedDocs}
                    errorMsg={errorMsg}
                    setSelectedDocs={setSelectedDocs}
                    MediaName="images"
                    mediaMaxLen="3"
                    meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                    setErrorMsg={setErrorMsg}
                    title="Company Banners"
                  />

                  {/* factory profileeee */}
                  <UploadDocument
                    selectedDocs={selectedDocs}
                    errorMsg={errorMsg}
                    setSelectedDocs={setSelectedDocs}
                    MediaName="coverImage"
                    mediaMaxLen="3"
                    meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                    setErrorMsg={setErrorMsg}
                    title="Company Logo"
                  />

                  {/* cetifactessssss */}
                  <UploadDocument
                    selectedDocs={selectedDocs}
                    errorMsg={errorMsg}
                    setSelectedDocs={setSelectedDocs}
                    MediaName="qualityCertificates"
                    mediaMaxLen="3"
                    meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
                    setErrorMsg={setErrorMsg}
                    title="Certificates"
                  />

                  <UploadVedio
                    selectedDocs={selectedDocs}
                    errorMsg={errorMsg}
                    setSelectedDocs={setSelectedDocs}
                    MediaName="coverVideo"
                    mediaMaxLen="3"
                    meidaAcceptedExtensions={["mkv","mp4",'x-matroska']}
                    setErrorMsg={setErrorMsg}
                    title="Factory Cover video"
                  />

                  <div className="col-12 action">
                    {isLoading ? (
                      <button type="button" className="action-btn btn-1 w-100">
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

                <div className="d-flex justify-content-center d-block">
                  <small
                    className="text-muted title-small cursor"
                    onClick={() => {
                      navigate(`/CompanyDetails/RepresentiveDetails`);
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
  );
}

export default CompanyMircoSiteDocs;
