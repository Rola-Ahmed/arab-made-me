import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import ImporterInfo from "components/Shared/ImporterInfo";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";
import RFQinfo from "components/Shared/Dashboards/Forms/RFQinfo";
import { useOneRfq } from "./useOneRfq";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";

export default function OneRfqs() {
  let {
    isLogin,
    requestedData,
    apiLoadingData,
    continueProfilePath,
  } = useOneRfq();
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
  const [modalShow, setModalShow] = useState(false);

  const navigateTo = (path) => {
    if (continueProfilePath) {
      setModalShow(true);
    } else {
      navigate(path);
    }
  };

  const handleSendQuoteBnt = () => {
    navigateTo(
      `/answerQuotation/rfq?id=${requestedData?.id}&productName=${requestedData?.productName}&userId=${requestedData?.importerId}&productId=${requestedData?.productId}`
    );
  };
  const handleEditQuoteBnt = () => {
    navigateTo(
      `/factorydashboard/editQuote/${requestedData?.quoteId}?quotationRequestId=${requestedData?.id}&productName=${requestedData?.productName}`
    );
  };

  return (
    <>
      <FactoryUnVerified
        show={modalShow}
        onHide={() => setModalShow(false)}
        goToPath={continueProfilePath}
      />

      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="RFQs" />

        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2 className="">RFQ Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/factorydashboard/RfqRequests");
                }}
              >
                <p className="cursor">RFQ Requests </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {apiLoadingData?.reqData && (
                <StatusMessagetwo
                  errorMsg={apiLoadingData?.errorWhileLoading}
                />
              )}
              {!apiLoadingData?.reqData && (
                <>
                  <ImporterInfo importerData={requestedData?.importer} />

                  <RFQinfo
                    requestedData={requestedData}
                    handleImageClick={handleImageClick}
                  />

                  <div className="col-12 d-flex justify-content-start btn-modal-gap">
                    {requestedData && requestedData?.quoteId == null ? (
                      <button
                        className="btn-edit "
                        type="button"
                        onClick={() => {
                          handleSendQuoteBnt();
                        }}
                      >
                        <p className="cursor">send Quote</p>
                      </button>
                    ) : (
                      <button
                        className="btn-edit "
                        type="button"
                        onClick={() => {
                          handleEditQuoteBnt();
                        }}
                      >
                        <p className="cursor">Edit Quote</p>
                      </button>
                    )}

                    <ContactBtn
                      isLogin={isLogin}
                      recieverUserId={requestedData?.importer?.userId}
                    />
                  </div>
                </>
              )}
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
