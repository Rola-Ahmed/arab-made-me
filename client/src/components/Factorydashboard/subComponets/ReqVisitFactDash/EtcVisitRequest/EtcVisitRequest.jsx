import { useNavigate } from "react-router-dom";
import ImporterInfo from "components/Factorydashboard/Shared/ImporterInfo";
import Loading from "components/Loading/Loading";

// modals
// shared component accross  the components
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { useOneVisit } from "./useOneVisit";
// shared function
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";
import VisitRequestInfo from "components/Shared/Dashboards/Forms/VisitRequestInfo";

export default function EtcVisitRequest() {
  let navigate = useNavigate();

  // auth validation
  let { isLogin, requestedData, apiLoadingData } = useOneVisit();

  return (
    <>
      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="Visit Requests" />

        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Factory Visit Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/factorydashboard/FactoryRequestVisit");
                }}
              >
                <p className="cursor">Factory Visit Requests</p>
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
                <ImporterInfo importerData={requestedData?.importer} />

                <VisitRequestInfo requestedData={requestedData} />

                <div className="col-12 d-flex justify-content-start btn-modal-gap">
                  <button
                    className="btn-edit border-btn bg-white  d-none"
                    type="button"
                    onClick={() => {
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
                    recieverUserId={requestedData?.importer?.userId}
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
