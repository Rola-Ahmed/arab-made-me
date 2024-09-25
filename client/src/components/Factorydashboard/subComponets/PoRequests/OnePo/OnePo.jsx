import { useState } from "react";

import MediaPopUp from "components/Shared/MediaPopUp/MediaPopUp";

import { useNavigate } from "react-router-dom";
import { useOnePo } from "./useOnePo";

// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import ImporterInfo from "components/Shared/ImporterInfo";

import ProductDetails from "components/Forms/Shared/SelectedProductDetails";
import PoInfo from "components/Shared/Dashboards/Forms/PoInfo";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";

export default function OnePo() {
  let navigate = useNavigate();
  let { isLogin, requestedData, apiLoadingData } = useOnePo();

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

  return (
    <>
      <div id="view" className="m-4 order-section  ">
        <SubPageUtility
          currentPage="More Details"
          PrevPage="Purchasing Offer Details"
        />
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Purchasing Order Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/purchasingOrders");
                }}
              >
                <p className="cursor">All Purchasing Order</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* error or loading section */}
      {apiLoadingData?.reqData && (
        <StatusMessagetwo errorMsg={apiLoadingData?.errorWhileLoading} />
      )}

      {!apiLoadingData?.reqData && (
        <div className="section factory-profile m-5">
          <div className="container gap-container">
            <div className="row">
              <div className="col-12  container-2-gap  p-0">
                {/* contains its own fetch i just called it */}
                <ImporterInfo importerData={requestedData?.importer} />

                {requestedData?.productId && (
                  <div className="container-profile-input w-100">
                    <ProductDetails productDetails={requestedData?.product} />
                  </div>
                )}

                <PoInfo
                  requestedData={requestedData}
                  handleImageClick={handleImageClick}
                />
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
