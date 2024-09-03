import { useState } from "react";
import { useNavigate } from "react-router-dom";


import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import ProductDetails from "components/Forms/Shared/SelectedProductDetails";

// import { getMonthName as getDate } from "utils/getMonthName";

// sub Components
import HeaderSection from "./HeaderSection";
import ImporterInfo from "components/Shared/ImporterInfo";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";
import { usePrivateLabel } from "./usePrivateLabel";
import PrivateLabelInfo from "components/Shared/Dashboards/Forms/PrivateLabelInfo";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";

// utils function
export default function EtcPrivateLabelReq() {
  let { isLogin, requestedData, apiLoadingData } = usePrivateLabel();
  let navigate = useNavigate();

  // utils function
  // let getMonthName = getDate;

  // popup image( used to see a bigger verison of the requested media )
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
      <HeaderSection />

      <div className="section factory-profile m-5 ">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {apiLoadingData?.reqData ? (
                <StatusMessagetwo  errorMsg={apiLoadingData?.errorWhileLoading}/>
              ) : (
                <>
                  <ImporterInfo importerData={requestedData?.importer} />

                  <PrivateLabelInfo
                    requestedData={requestedData}
                    handleImageClick={handleImageClick}
                  />

                  {requestedData?.productId && (
                    <div className="container-profile-input w-100">
                      <ProductDetails productDetails={requestedData?.product} />
                    </div>
                  )}
                </>
              )}
              <div className="col-12 d-flex justify-content-start btn-modal-gap ">
                {requestedData && requestedData?.quoteId == null ? (
                  <button
                    className="btn-edit "
                    type="button"
                    onClick={() => {
                      navigate(
                        `/answerQuotation/PrivateLabel?id=${requestedData?.id}&productName=${requestedData?.productName}&userId=${requestedData?.importerId}`
                      );
                    }}
                  >
                    <p className="cursor">send Quote</p>
                  </button>
                ) : (
                  <button
                    className="btn-edit "
                    type="button"
                    onClick={() => {
                      navigate(
                        `/factorydashboard/editQuote/${requestedData?.quoteId}?privateLabelingId=${requestedData?.id}&productName=${requestedData?.productName}`
                      );
                    }}
                  >
                    <p className="cursor">Edit Quote</p>
                  </button>
                )}

                <ContactBtn
                  isLogin={isLogin}
                  // handleIsLoggedInBtn={handleIsLoggedInBtn}
                  recieverUserId={requestedData?.importer?.userId}
                  // baseUrl={baseUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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
