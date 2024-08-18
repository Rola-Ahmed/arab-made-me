import { useState } from "react";
import { baseUrl } from "config.js";

import { useNavigate } from "react-router-dom";

import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import ContactBtn from "components/Importerdashboard/Shared/ContactBtn";
import FactoryInfo from "components/Forms/Shared/FactoryInfo";
import { OneWhiteLabel } from "./useWhiteLabel";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";
import ProductDetails from "components/Forms/Shared/SelectedProductDetails";
import WhiteLabelInfo from "components/Shared/Dashboards/Forms/WhiteLabelInfo";
export default function OnePrivateLabel() {
  let navigate = useNavigate();

  let { isLogin, requestedData, apiLoadingData } = OneWhiteLabel();

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

  return (
    <>
      {/* header section */}

      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="Private Labels" />
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>White Label Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/whiteLabel");
                }}
              >
                <p className="cursor">White Label Requests</p>
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

                <WhiteLabelInfo
                  requestedData={requestedData}
                  handleImageClick={handleImageClick}
                />
                 {requestedData?.productId && (
                    <div className="container-profile-input w-100">
                      <ProductDetails productDetails={requestedData?.product} />
                    </div>
                  )}

                <div className="col-12 d-flex justify-content-start btn-modal-gap mb-4">
                  <ContactBtn
                    isLogin={isLogin}
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
