import { useState } from "react";
import { baseUrl } from "config.js";

import { useNavigate } from "react-router-dom";

import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";

// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import ContactBtn from "components/Importerdashboard/Shared/ContactBtn";
import FactoryInfo from "components/Forms/Shared/FactoryInfo";
import PrivateLabelInfo from "components/Shared/Dashboards/Forms/PrivateLabelInfo";
import { usePrivateLabel } from "./usePrivateLabel";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";
export default function OnePrivateLabel() {
  let navigate = useNavigate();

  let { isLogin, requestedData, apiLoadingData } = usePrivateLabel();

  const [isLoggedReDirect, setisLoggedReDirect] = useState([]);
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });

  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });
  const handleImageClick = (imagePath) => {
    setShowImagePop({
      display: true,
      imagePath,
    });
  };

  // utils function

  function handleIsLoggedInBtn(loginPath) {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));

      setisLoggedReDirect(`/signIn/${loginPath}`);
      return;
    }

    navigate(`/${loginPath}`);
  }

  return (
    <>
      <IsLoggedIn
        show={modalShow.isLogin}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
        distination={isLoggedReDirect}
      />

      {/* header section */}

      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="Private Labels" />
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Private Label Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/PrivateLabel");
                }}
              >
                <p className="cursor">Private Label Requests</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* error or loading section */}

      {apiLoadingData?.reqData && (
        <StatusMessagetwo errorMsg={apiLoadingData?.errorWhileLoading} />
      )}

      {/* show data section */}

      {!apiLoadingData?.reqData && (
        <div className="section factory-profile m-5">
          <div className="container gap-container">
            <div className="row">
              <div className="col-12  container-2-gap  p-0">
                <div className="container-profile-input w-100">
                  <div className="title-contianer-input w-100">
                    <FactoryInfo productDetails={requestedData?.factory} />
                  </div>
                </div>

                <PrivateLabelInfo
                  requestedData={requestedData}
                  handleImageClick={handleImageClick}
                />

                <div className="col-12 d-flex justify-content-start btn-modal-gap mb-4">
                  <ContactBtn
                    isLogin={isLogin}
                    handleIsLoggedInBtn={handleIsLoggedInBtn}
                    recieverUserId={requestedData?.factory?.userId}
                    baseUrl={baseUrl}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <MediaPopUp
        show={showImagePop.display}
        onHide={() =>
          setShowImagePop({
            display: false,
            imagePath: "",
          })
        }
        showImagePop={showImagePop.imagePath}
      />
    </>
  );
}
