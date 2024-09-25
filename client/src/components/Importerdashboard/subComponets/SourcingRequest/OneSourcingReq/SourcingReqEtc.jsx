import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MediaPopUp from "components/Shared/MediaPopUp/MediaPopUp";

import SourcingRequestInfo from "components/Shared/Dashboards/Forms/SourcingRequestInfo";
import { useFetchData } from "./useFetchData";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";

export default function SourcingReqEtc() {
  let navigate = useNavigate();
  let { requestedData, apiLoadingData } = useFetchData();

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
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Sourcing Request Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/AllSourcingRequests");
                }}
              >
                <p className="cursor">Sourcing Requests </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* error or loading */}
      {apiLoadingData?.reqData && (
        <StatusMessagetwo errorMsg={apiLoadingData?.errorWhileLoading} />
      )}

      {!apiLoadingData?.reqData && (
        <div className="section factory-profile m-5">
          <div className="container gap-container">
            <div className="row">
              <div className="col-12  container-2-gap  p-0">
                <SourcingRequestInfo
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
