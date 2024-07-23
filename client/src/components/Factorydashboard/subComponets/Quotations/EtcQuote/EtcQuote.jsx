import { useState } from "react";

import { useNavigate } from "react-router-dom";

// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";

// sub Components
import ImporterInfo from "components/Shared/ImporterInfo";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

import RFQ from "components/Shared/Dashboards/Forms/RFQ";
import Quote from "components/Shared/Dashboards/Forms/Quote";
import { useOneQuote } from "./useOneQuote";

export default function EtcQuote() {
  let navigate = useNavigate();

  let { isLogin, requestedData, apiLoadingData, qouteOn } = useOneQuote();
  console.log("requestedData", qouteOn);
  // console.log(" requestedData qouteOn", requestedData?.qouteOnId);
  // console.log("requestedData qoutetype", requestedData?.qouteOnType);

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
            <h2>Quotations Details</h2>

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

      <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              <ImporterInfo importerData={requestedData?.importer} />

              <Quote requestedData={requestedData} />

              <RFQ
                requestedData={requestedData}
                handleImageClick={handleImageClick}
              />

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
                  <p className="cursor text-success text-dark">Contact Buyer</p>
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
