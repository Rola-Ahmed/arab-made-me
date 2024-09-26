import { useState } from "react";
import MediaPopUp from "components/Shared/MediaPopUp/MediaPopUp";
import { useNavigate } from "react-router-dom";
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import OfferInfo from "components/Shared/Dashboards/Forms/OfferInfo";
import { UseOneOffer } from "./UseOneOffer";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";
export default function OneOffer() {
  let navigate = useNavigate();

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
  let { isLogin, requestedData, apiLoadingData } = UseOneOffer();

  return (
    <>
      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="Offer Details" />

        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Offer Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/factorydashboard/AllFactoryOffers");
                }}
              >
                <p className="cursor"> Offers</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {apiLoadingData?.reqData ? (
        <StatusMessagetwo errorMsg={apiLoadingData?.errorWhileLoading} />
      ) : (
        <div className="section factory-profile m-5">
          <div className="container gap-container px-0">
            <div className=" container-2-gap  p-0">
              <OfferInfo
                requestedData={requestedData}
                handleImageClick={handleImageClick}
              />

              {/* <div className="col-12 d-flex justify-content-start btn-modal-gap">
                    
                    <button className="btn-edit " type="button">
                      <p className="cursor">Edit Offer</p>
                    </button>
                  </div> */}

              <div className="col-12 ">
                <button
                  className="defualt-btn main"
                  type="button"
                  onClick={() => {
                    navigate(
                      `/factorydashboard/editOffer/${requestedData?.id}?productName=${requestedData?.productName}`
                    );
                  }}
                >
                  Edit Product
                </button>
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
