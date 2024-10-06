import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "components/main/Header/Header";
import FactoryInfo from "components/Forms/Shared/FactoryInfo";
import OfferInfo from "components/Shared/Dashboards/Forms/OfferInfo";
import MediaPopUp from "components/Shared/MediaPopUp/MediaPopUp";
import ErrorToast from "components/ErrorToast";
import useAuthFormChecks from "components/Forms/hooks/useAuthFormChecks";
import { getOneSourcingOffer } from "Services/sourcingOffer";
import { useAppTranslation } from "config";

function OneSourcingOffer() {
  const navigate = useNavigate();
  const currentUrl = window.location.pathname;
  const { trans: t } = useAppTranslation();
  // const getMonthName = getDate;

  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const productId = searchParams.get("productId");
  // const productName = searchParams.get("productName");
  const factoryName = searchParams.get("factoryName");
  const factoryOffersId = searchParams.get("factoryOffersId");

  const [isLoading, setIsLoading] = useState({
    pageLoading: true,
    errorCause: null,
  });
  const [posData, setPosData] = useState(null);
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });

  const handleFetchData = async () => {
    const result = await getOneSourcingOffer(
      factoryOffersId,
      "include=factory"
    );
    if (result?.success) {
      setPosData(result.data.sourcingoffers);
    }
    setIsLoading({
      pageLoading: result?.loadingStatus,
      errorCause: result?.error,
    });
  };

  useEffect(() => {
    handleFetchData();
  }, [factoryOffersId]);

  if (!factoryId) {
    ErrorToast("Page Not Found");
    navigate("/");
  }

  // checks if user is logged in
  // can user access this page
  // if page is loading
  const authChecks = useAuthFormChecks(isLoading, "Sourcing Offer", currentUrl);
  if (authChecks) return authChecks;

  const handleImageClick = (imagePath) => {
    setShowImagePop({
      display: true,
      imagePath,
    });
  };
  return (
    <>
      <Header title="Sourcing Offer" />
      {isLoading.errorCause && (
        <p className="fs-5 text-muted fw-bolder text-5 my-5 py-5 mx-auto text-center">
          {isLoading.errorCause}
        </p>
      )}
      {!isLoading.pageLoading && (
        <section id="view" className="send-po ">
          <div className="container container-po">
            <FactoryInfo productDetails={posData?.factory} />
          </div>
          <div className="container container-po">
            <div className="input-content">
              <OfferInfo
                requestedData={posData}
                handleImageClick={handleImageClick}
              />

              <div className="action row">
                <div className="col-12">
                  <button
                    className="action-btn btn-1 w-100 submitButton"
                    onClick={() => {
                      navigate(
                        `/purchasingOrder/fromSourcingReuqest?sourcingOfferId=${factoryOffersId}&factoryId=${factoryId}&factoryName=${factoryName}${
                          productId !== null ? `&productId=${productId}` : ""
                        }&productName=${posData?.productName}`
                      );
                    }}
                  >
                    Send PO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <MediaPopUp
        show={showImagePop.display}
        onHide={() => setShowImagePop({ display: false, imagePath: "" })}
        showImagePop={showImagePop.imagePath}
      />
    </>
  );
}

export default OneSourcingOffer;
