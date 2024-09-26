import { useState, useEffect } from "react";

import axios from "axios";
import { baseUrl } from "config.js";

import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "components/main/Header/Header";
import ReadOnly from "components/Forms/Shared/ReadOnly";

import { getMonthName as getDate } from "utils/getMonthName";
import Loading from "components/Loading/Loading";
import FactoryInfo from "components/Forms/Shared/FactoryInfo";
import OfferInfo from "components/Shared/Dashboards/Forms/OfferInfo";
import MediaPopUp from "components/Shared/MediaPopUp/MediaPopUp";
import ErrorToast from "components/ErrorToast";
import useAuthFormChecks from "components/Forms/hooks/useAuthFormChecks";

function OneSoursingOffer() {
  let navigate = useNavigate();
  let currentUrl = window.location.pathname;

  // utils function
  let getMonthName = getDate;

  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const productId = searchParams.get("productId");
  const factoryName = searchParams.get("factoryName");
  // const productName = searchParams.get("productName");
  const factoryOffersId = searchParams.get("factoryOffersId");

  let [factoryDetails, setFactoryDetails] = useState({});
  const [isLoading, setIsLoading] = useState({
    pageLoading: false,
    reqInfo: false,
  });
  const [PosData, setPosData] = useState();

  async function fetchReqData() {
    setIsLoading((prev) => ({
      ...prev,
      reqInfo: true,
    }));

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/sourcingOffers/${factoryOffersId}`,
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setPosData(response.data.sourcingoffers);

        setIsLoading((prev) => ({
          ...prev,
          reqInfo: false,
        }));
      } else {
        setIsLoading((prev) => ({
          ...prev,
          reqInfo: true,
        }));
      }
    } catch (error) {
      setIsLoading((prev) => ({
        ...prev,
        reqInfo: true,
      }));
    }
  } // factory details
  async function fetchFactoryData() {
    setIsLoading((prev) => ({
      ...prev,
      pageLoading: true,
    }));
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/${factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.factories);
        setIsLoading((prev) => ({
          ...prev,
          pageLoading: false,
        }));
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  if (factoryId == null) {
    ErrorToast("Page Not Found");

    navigate("/");
  }

  useEffect(() => {
    fetchReqData();
  }, [factoryOffersId]);

  useEffect(() => {
    fetchFactoryData();
  }, [factoryId]);

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

  // checks if user is logged in
  // can user access this page
  // if page is loading
  const authChecks = useAuthFormChecks(
    isLoading,
    "Sourcing Offer",
    `${currentUrl}`
  );

  if (authChecks) {
    return authChecks;
  }

  return (
    <>
      <Header title="Sourcing Offer " />
      {isLoading?.loading && (
        <>
          {isLoading?.errorMsg ? (
            <p className="fs-5 text-muted fw-bolder text-5 my-5 py-5 mx-auto">
              {isLoading?.errorMsg || "No records Found"}
            </p>
          ) : (
            <div className=" d-flex justify-content-center py-5">
              <Loading title="Sourcing Offer Details" />
            </div>
          )}
        </>
      )}

      {!isLoading?.pageLoading && (
        <>
          <section id="view" className="send-po">
            {/* Factory description */}
            <div className="container container-po ">
              <FactoryInfo productDetails={factoryDetails} />
            </div>

            {/* Grid  */}
            <div className="container container-po ">
              <div className="input-content ">
                <OfferInfo
                  requestedData={PosData}
                  handleImageClick={handleImageClick}
                />
                <div className="title-text w-100 d-none">
                  <h5>Offer Details</h5>
                </div>
                <div className="row row-container w-100 d-none">
                  {/* <div className="row  row-gap"> */}
                  <div className="col-md-6 col-sm-12">
                    <ReadOnly
                      title="Product Name"
                      value={PosData?.productName}
                    />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <ReadOnly title="Quantity" value={PosData?.quantity} />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <ReadOnly title="sku" value={PosData?.sku} />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <ReadOnly title="hsnCode" value={PosData?.productHSNCode} />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <ReadOnly title="Price" value={PosData?.price} />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <ReadOnly
                      title="packing Conditions"
                      value={PosData?.packingConditions}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <ReadOnly
                      title="Quality Conditions"
                      value={PosData?.qualityConditions}
                    />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <ReadOnly
                      title="shipping Conditions"
                      value={PosData?.shippingConditions}
                    />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <ReadOnly
                      title="Delivery Terms"
                      value={PosData?.deliveryTerms}
                    />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <ReadOnly
                      title="payment Terms"
                      value={PosData?.paymentTerms}
                    />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <ReadOnly
                      title="available"
                      value={PosData?.available ? "In Stock" : "Out Of Stock"}
                    />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <ReadOnly
                      title="preferred Countries"
                      value={`${
                        PosData?.preferredCountries?.join(", ") || "All"
                      }  `}
                    />
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <ReadOnly
                      title="Created At"
                      value={getMonthName(PosData?.createdAt?.split("T")?.[0])}
                    />
                  </div>

                  {/* ---------------------------- */}

                  {PosData?.specialCharacteristics &&
                    Object?.keys(PosData?.specialCharacteristics)?.length >
                      0 && (
                      <div className="col-12 ">
                        <label className="fw-600 mb-1">
                          Product Characteristics
                        </label>

                        <div className="form-group form-control p-4 ">
                          <div className="row row-gap ">
                            {Object?.entries(
                              PosData?.specialCharacteristics
                            )?.map(([key, value], index) => (
                              <div className="col-6">
                                <ReadOnly title={key} value={value} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  {/* ----------------------------------------- */}

                  <div className="col-12">
                    <ReadOnly
                      title="Product Description"
                      value={PosData?.productDescription}
                    />
                  </div>
                </div>
                {/* </div> */}

                <div className="action row">
                  <div className="col-12">
                    <button
                      className="action-btn btn-1 w-100 submitButton"
                      onClick={() => {
                        navigate(
                          `purchasingOrder/fromSourcingReuqest?sourcingOfferId=${factoryOffersId}&factoryId=${factoryId}&factoryName=${factoryName}${
                            productId !== null ? `&productId=${productId}` : ""
                          }&productName=${PosData?.productName}`
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
        </>
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

export default OneSoursingOffer;
