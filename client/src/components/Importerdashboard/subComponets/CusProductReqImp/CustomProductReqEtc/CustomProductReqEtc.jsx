import { useState } from "react";
import { baseUrl } from "config.js";

import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

import { useNavigate } from "react-router-dom";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
// utils function
import ContactBtn from "components/Importerdashboard/Shared/ContactBtn";
import CustomProductInfo from "components/Shared/Dashboards/Forms/CustomProductInfo";

import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import FactoryInfo from "components/Forms/Shared/FactoryInfo";
import { useOneSpmf } from "./useOneSpmf";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";
export default function CustomProductReqEtc() {
  let navigate = useNavigate();

  let { isLogin, requestedData, apiLoadingData } = useOneSpmf();

  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState([]);
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });

  // utils function

  function handleIsLoggedInBtn(loginPath, storgaeName) {
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

  const handleImageClick = (imagePath) => {
    setShowImagePop({
      display: true,
      imagePath,
    });
  };

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

      <div id="view" className="m-4 order-section  ">
        <SubPageUtility
          currentPage="More Details"
          PrevPage="Custom Product Details"
        />
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Custom Product Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/CustomerProductRequest");
                }}
              >
                <p className="cursor">Custom Product</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* error or slow loading */}
      {apiLoadingData?.reqData && (
        <StatusMessagetwo errorMsg={apiLoadingData?.errorWhileLoading} />
      )}

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

                <CustomProductInfo
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
