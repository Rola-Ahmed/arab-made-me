// 3rd party
import { useState } from "react";

import { baseUrl } from "config.js";

import { useNavigate } from "react-router-dom";
//

// validation popup modal
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

// utils function
import RFQinfo from "components/Shared/Dashboards/Forms/RFQinfo";
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import ContactBtn from "components/Importerdashboard/Shared/ContactBtn";
import FactoryInfo from "components/Forms/Shared/FactoryInfo";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";
import { useOneRfq } from "./useOneRfq";
export default function OneRfq() {
  let navigate = useNavigate();
  let { isLogin, requestedData, apiLoadingData } = useOneRfq();
  console.log("requestedData",requestedData)
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });

  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState([]);

  function handleIsLoggedInBtn(loginPath, storgaeName) {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));

      setisLoggedReDirect(`/signIn/${loginPath}`);
      return;
    }

    navigate(`/${loginPath}`);
  }

  const handleImageClick = (imagePath) => {
    setShowImagePop({
      display: true,
      imagePath,
    });
  };

  return (
    <>
      <IsLoggedIn
        show={modalShow.isLogin}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
        distination={isLoggedReDirect}
      />

      <div id="view" className="m-4 order-section  ">
        <SubPageUtility
          currentPage="More Details"
          PrevPage="Request for Quotations"
        />
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>RFQ Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/Rfqs");
                }}
              >
                <p className="cursor">RFQ Requests </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* error or loading */}
      {apiLoadingData?.reqData && (
        <StatusMessagetwo errorMsg={apiLoadingData?.errorWhileLoading} />
      )}

      {/* incase the data is found */}
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

                <RFQinfo
                  requestedData={requestedData}
                  handleImageClick={handleImageClick}
                />

                <div className="col-12 d-flex justify-content-start btn-modal-gap mb-4">
                  <ContactBtn
                    isLogin={isLogin}
                    handleIsLoggedInBtn={handleIsLoggedInBtn}
                    recieverUserId={requestedData?.factory?.userId}
                    baseUrl={baseUrl}
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
