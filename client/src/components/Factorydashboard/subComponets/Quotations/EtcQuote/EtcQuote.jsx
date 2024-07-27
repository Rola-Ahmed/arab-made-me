import { useState } from "react";

import { useNavigate } from "react-router-dom";

// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";

// sub Components
import ImporterInfo from "components/Shared/ImporterInfo";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

import RFQinfo from "components/Shared/Dashboards/Forms/RFQinfo";
import Quote from "components/Shared/Dashboards/Forms/Quote";
import { useOneQuote } from "./useOneQuote";
import CustomProductInfo from "components/Shared/Dashboards/Forms/CustomProductInfo";
import PrivateLabelInfo from "components/Shared/Dashboards/Forms/PrivateLabelInfo";
import SourcingRequestInfo from "components/Shared/Dashboards/Forms/SourcingRequestInfo";
import Loading from "components/Loading/Loading";

export default function EtcQuote() {
  let navigate = useNavigate();

  let { isLogin, requestedData, apiLoadingData, qouteOn } = useOneQuote();

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
      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="Quotations" />

        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Quotations Details on {requestedData?.title}</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/factorydashboard/quotations");
                }}
              >
                <p className="cursor">Quotations</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* error occured Or Loading data */}
      {apiLoadingData?.reqData ? (
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
      ) : (
        <div className="section factory-profile m-5">
          <div className="container gap-container">
            <div className="row">
              <div className="col-12  container-2-gap  p-0">
                <ImporterInfo importerData={requestedData?.importer} />

                <Quote requestedData={requestedData} />

                {requestedData?.qouteOnType == "rfq" && (
                  <RFQinfo
                    requestedData={qouteOn}
                    handleImageClick={handleImageClick}
                  />
                )}

                {requestedData?.qouteOnType == "spmf" && (
                  <CustomProductInfo
                    requestedData={qouteOn}
                    handleImageClick={handleImageClick}
                  />
                )}

                {requestedData?.qouteOnType == "privateLabeling" && (
                  <PrivateLabelInfo
                    requestedData={qouteOn}
                    handleImageClick={handleImageClick}
                  />
                )}

                {requestedData?.qouteOnType == "request" && (
                  <SourcingRequestInfo
                    requestedData={qouteOn}
                    handleImageClick={handleImageClick}
                  />
                )}

                <div className="col-12 d-flex justify-content-start btn-modal-gap ">
                  <button
                    className="btn-edit "
                    type="button"
                    onClick={() => {
                      navigate(
                        `/factorydashboard/editQuote/${requestedData?.quoteId}?quoteId=${requestedData?.id}&productName=${requestedData?.productName}`
                      );
                    }}
                  >
                    <p className="cursor">Edit Quote</p>
                  </button>

                  <button
                    className="btn-edit border-btn bg-white d-none"
                    type="button"
                    onClick={() => {
                      // UpdateData("accepted");
                      navigate(
                        `/contactsupplier?userId=${requestedData?.importer?.userId}&importerName=${requestedData?.importer?.name}`
                      );
                    }}
                  >
                    <p className="cursor text-success text-dark">
                      Contact Buyer
                    </p>
                  </button>
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
