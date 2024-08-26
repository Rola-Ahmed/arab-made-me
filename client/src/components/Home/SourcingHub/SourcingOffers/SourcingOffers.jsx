import { useNavigate } from "react-router-dom";
import "./SourcingOffers.css";

import { useEffect, useState } from "react";

import { getSourcingOffers } from "Services/sourcingOffer";
import SourcingOfferTable from "components/Sourcinghub/SourcingOffers/SourcingOfferTable";
import Loading from "components/Loading/Loading";
import { useAppTranslation } from "config.js";

export default function SourcingOffers() {
  let navigate = useNavigate();
  const { trans: t, currentLang } = useAppTranslation();

  // utils function
  let displayProductSize = 100;

  const [allSourcingReqData, setAllSourcingReqData] = useState([]);

  const [apiLoadingData, setapiLoadingData] = useState(true);

  async function fetchSourcingReqData() {
    let result = await getSourcingOffers(`size=${displayProductSize}`);
    if (result?.success) {
      setAllSourcingReqData(result.data?.sourcingoffers);
    }

    setapiLoadingData((prevValue) => ({
      ...prevValue,
      laoding: result?.loadingStatus,
      errorMsg: result?.error,
    }));
  }

  useEffect(() => {
    fetchSourcingReqData();
  }, []);

  return (
    <>
      {/* home page */}

      <p
        className={`fs-20-semi pb-3 pt-5 ${
          currentLang == "ar" && "ar-text-left fw-900"
        }`}
      >
        {t("translation:titles.factoryOffers")}
      </p>
      <div className="row position-relative">
        <div className="col-12">
          <div className="border-container">
            <SourcingOfferTable allSourcingReqData={allSourcingReqData} />
          </div>
        </div>

        {apiLoadingData?.laoding && (
          <>
            <div className="position-absolute error-float">
              {apiLoadingData?.errorMsg ? (
                <p className="fs-5 text-muted fw-bolder text-5 mt-5 pt-5 mx-auto">
                  {apiLoadingData?.errorMsg || "No records Found"}
                </p>
              ) : (
                <div className="d-flex justify-content-center">
                  <Loading />
                </div>
              )}
            </div>
          </>
        )}
        {allSourcingReqData?.length == 0 && !apiLoadingData?.laoding && (
          <div className="position-absolute error-float">
            <p className="fs-5 text-muted fw-bolder text-5 mt-5 pt-5 mx-auto">
              {"No records"}
            </p>
          </div>
        )}
      </div>

      <div className="btn-container-all cursor">
        <div
          className="get-all-btn text-decoration-none text-white cursor"
          onClick={() => {
            navigate("/sourcinghub/SourcingRequests");
          }}
        >
          Sourcing Hub
        </div>
      </div>
    </>
  );
}
