import { useState } from "react";

import { useNavigate } from "react-router-dom";

// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import DescritionPopUp from "components/Helpers/DescritionPopUp";

// sub Components
import ImporterInfo from "components/Shared/ImporterInfo";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

import RFQinfo from "components/Shared/Dashboards/Forms/RFQinfo";
import Quote from "components/Shared/Dashboards/Forms/Quote";
import { useOneQuote } from "hooks/useOneQuote";
import CustomProductInfo from "components/Shared/Dashboards/Forms/CustomProductInfo";
import PrivateLabelInfo from "components/Shared/Dashboards/Forms/PrivateLabelInfo";
import WhiteLabelInfo from "components/Shared/Dashboards/Forms/WhiteLabelInfo";
import SourcingRequestInfo from "components/Shared/Dashboards/Forms/SourcingRequestInfo";
import ExtractPdf from "./ExtractPdf";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";

export default function EtcQuote() {
  let navigate = useNavigate();

  let { isLogin, requestedData, apiLoadingData, qouteOn } = useOneQuote();

  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });
  const [description, setDescription] = useState("");

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
            <h2>Quotations Details on {requestedData?.title}
              
            </h2>
          
          

            <div className="btn-container">
            
              
             <ExtractPdf requestedData={requestedData} qouteOn={qouteOn}/>

        
           
          <button className="fs-10 d-block cursor border-0 bg-main text-white" type="button" onClick={()=>{setDescription(true)}} > <p className="cursor">Quote brief</p></button>

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
      <StatusMessagetwo  errorMsg={apiLoadingData?.errorWhileLoading}/>
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

                {requestedData?.qouteOnType == "whiteLabeling" && (
                  <WhiteLabelInfo
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
                        `/factorydashboard/editQuote/${requestedData?.id}?quoteId=${requestedData?.id}&productName=${requestedData?.productName}`
                      );
                    }}
                  >
                    <p className="cursor">Edit Quote</p>
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


 <DescritionPopUp
        show={description}
        description={<>
        <div className="row gap-3">
          <div className="col-12 border-bottom">
            <p className="fs-14  fw-normal border-bottom mb-2"><span className="fw-bold me-1">buyer name:</span>{requestedData?.importer?.repName}</p>
          
            <p className="fs-14  fw-normal border-bottom mb-2"><span className="fw-bold me-1">buyer email:</span>{requestedData?.importer?.repEmail}</p>
         
            <p className="fs-14  fw-normal border-bottom mb-2"><span className="fw-bold me-1">Quotation</span>{requestedData?.title}</p>
            <p className="fs-14  fw-normal border-bottom mb-2"><span className="fw-bold me-1">Quotation Status</span>{requestedData?.status}</p>
          
            <p className="fs-14  fw-normal border-bottom mb-2"><span className="fw-bold me-1">product name</span>{requestedData?.productName}</p>
            <p className="fs-14  fw-normal border-bottom mb-2"><span className="fw-bold me-1">Total Quantity</span>{requestedData?.minQuantity}</p>

            <p className="fs-14  fw-normal border-bottom mb-2"><span className="fw-bold me-1">Form Deadline</span>{requestedData?.deadline?.split("T")?.[0]}</p>
         
            <p className="fs-14  fw-normal border-bottom mb-2"><span className="fw-bold me-1">Price</span>{requestedData?.price}</p>
            <p className="fs-14  fw-normal border-bottom mb-2"><span className="fw-bold me-1">Location</span>{requestedData?.supplyLocation}</p>
          </div>
          
        
        </div>
        </>}
        onClose={()=>{setDescription(false)}}
  />
    </>

  );
}
