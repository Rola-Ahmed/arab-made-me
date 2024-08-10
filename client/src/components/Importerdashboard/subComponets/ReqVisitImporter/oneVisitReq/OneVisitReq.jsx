import { baseUrl } from "config.js";

import { useNavigate } from "react-router-dom";
import ContactBtn from "components/Importerdashboard/Shared/ContactBtn";

// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import FactoryInfo from "components/Forms/Shared/FactoryInfo";
import { useOneVisit } from "./useOneVisit";
import VisitRequestInfo from "components/Shared/Dashboards/Forms/VisitRequestInfo";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";

export default function VisitRequestEtc() {
  let navigate = useNavigate();

  let { isLogin, requestedData, apiLoadingData } = useOneVisit();



  return (
    <>
     
      <div id="view" className="m-4 order-section  ">
        <SubPageUtility
          currentPage="More Details"
          PrevPage="Factory Visit Requests"
        />
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Factory Visit Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/RequestVisit");
                }}
              >
                <p className="cursor">Factory Visit Requests</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {apiLoadingData?.reqData && (
       <StatusMessagetwo  errorMsg={apiLoadingData?.errorWhileLoading}/>
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

                <VisitRequestInfo requestedData={requestedData} />

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
    </>
  );
}
