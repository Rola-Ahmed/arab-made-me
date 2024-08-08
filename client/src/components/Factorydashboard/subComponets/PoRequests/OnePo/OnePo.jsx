import { useState } from "react";

import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
// import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
// import BecomomeAFactory from "components/ActionMessages/BecomeAFactory/BecomeAFactory";

import { useNavigate } from "react-router-dom";
import { useOnePo } from "./useOnePo";

// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import ImporterInfo from "components/Shared/ImporterInfo";

import Loading from "components/Loading/Loading";
import ProductDetails from "components/Forms/Shared/SelectedProductDetails";
import PoInfo from "components/Shared/Dashboards/Forms/PoInfo";

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

      {apiLoadingData?.reqData && (
        <div className="section factory-profile m-5 ">
          <div className="container gap-container">
            <div className="row">
              <div className="d-flex justify-content-center w-100">
                {apiLoadingData?.errorWhileLoading ? (
                  <div className="border-3 border-row py-5">
                    <p className="text-muted fw-semibold text-center my-5 py-5">
                      {apiLoadingData?.errorWhileLoading}
                    </p>
                  </div>
                ) : (
                  <Loading />
                )}
              </div>
            </div>
          </div>
        </div>
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


              
              <PoInfo  requestedData={requestedData}
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
