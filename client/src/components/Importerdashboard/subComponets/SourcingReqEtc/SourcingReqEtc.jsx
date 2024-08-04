import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";

import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

import SourcingRequestInfo from "components/Shared/Dashboards/Forms/SourcingRequestInfo";

import FactoryInfo from "components/Forms/Shared/FactoryInfo";

export default function SourcingReqEtc() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);

  const [searchParams] = useSearchParams();
  const sourcingReqId = searchParams.get("sourcingReqId");

  const [apiLoadingData, setapiLoadingData] = useState(true);

  const [PosData, setPosData] = useState();
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });

  async function fetchFactoriesData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/importers/importer/sourcingRequests?include=factory`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        const matchedObject = response.data.sourcingRequests.find(
          (obj) => obj.id == sourcingReqId
        );

        if (matchedObject) {
          setPosData(matchedObject);
        }

        setapiLoadingData(false);
      } else {
        setapiLoadingData(true);
      }
    } catch (error) {
      setapiLoadingData(true);
    }
  }

  useEffect(() => {
    fetchFactoriesData();
  }, [sourcingReqId]);

  // utils function

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

      <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {/* factory info */}
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <FactoryInfo productDetails={PosData?.factory} />
                </div>
              </div>

              <SourcingRequestInfo
                requestedData={PosData}
                handleImageClick={handleImageClick}
              />
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
