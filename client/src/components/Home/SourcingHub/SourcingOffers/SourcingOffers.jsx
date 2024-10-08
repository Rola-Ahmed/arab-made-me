import "./SourcingOffers.css";

import SourcingOfferTable from "components/Sourcinghub/SourcingOffers/SourcingOfferTable";
import Loading from "components/Loading/Loading";
import { useAppTranslation } from "config.js";
export default function SourcingOffers({
  allSourcingOffer,
  apiStatus,
  assessFormOPAuth,
}) {
  const { trans: t, currentLang } = useAppTranslation();

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
            <SourcingOfferTable
              allSourcingReqData={allSourcingOffer}
              assessFormOPAuth={assessFormOPAuth}
            />
          </div>
        </div>

        {/* loading or error case */}
        {apiStatus?.laoding && (
          <>
            <div className="position-absolute error-float">
              {apiStatus?.errorMsg ? (
                <p className="fs-15 text-muted fw-bolder  mt-5 pt-3 mx-auto w-fit-content">
                  {apiStatus?.errorMsg || "something went wrong"}
                </p>
              ) : (
                <div className="d-flex justify-content-center">
                  <Loading />
                </div>
              )}
            </div>
          </>
        )}

        {/* sucess state but data is empty */}

        {allSourcingOffer?.length == 0 && !apiStatus?.laoding && (
          <div className="position-absolute error-float">
            <p className="fs-15 text-muted fw-bolder  mt-5 pt-3 mx-auto w-fit-content text-center">
              {t("translation:searchResult.noItemsMessage1")}
              <br />
              {t("translation:searchResult.noItemsMessage2")}
            </p>{" "}
          </div>
        )}
      </div>
    </>
  );
}
