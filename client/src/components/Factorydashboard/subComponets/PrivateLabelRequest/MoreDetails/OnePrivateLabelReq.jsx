import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "components/Loading/Loading";

import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import ProductDetails from "components/Forms/Shared/SelectedProductDetails";

import { getMonthName as getDate } from "utils/getMonthName";

// sub Components
import HeaderSection from "./HeaderSection";
import ImporterInfo from "components/Factorydashboard/Shared/ImporterInfo";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";
import { usePrivateLabel } from "./usePrivateLabel";
import ReadOnly from "components/Forms/Shared/ReadOnly";
import DisplayOneImage from "components/Shared/Dashboards/DisplayOneImage";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";

// utils function
export default function EtcPrivateLabelReq() {
  let { isLogin, requestedData, apiLoadingData } = usePrivateLabel();
  let navigate = useNavigate();

  // utils function
  let getMonthName = getDate;

  // popup image( used to see a bigger verison of the requested media )
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
      <HeaderSection />

      <div className="section factory-profile m-5 ">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {apiLoadingData?.reqData ? (
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
              ) : (
                <>
                  <ImporterInfo importerData={requestedData?.importer} />

                  <div className="container-profile-input w-100">
                    <div className="title-contianer-input w-100">
                      <p> Private Label Details</p>
                      <div className="w-100 ">
                        <div className="row  row-gap">
                          {requestedData?.productName !== null && (
                            <div className="col-6">
                              <ReadOnly
                                title="Product Name"
                                value={requestedData?.productName}
                                // value={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`}
                              />
                            </div>
                          )}

                          <div className="col-6">
                            <ReadOnly
                              title="quantity"
                              value={requestedData?.quantity}
                            />
                          </div>

                          <div className="col-6">
                            <ReadOnly
                              title="status"
                              value={requestedData?.status}
                            />
                          </div>
                          <div className="col-6">
                            <ReadOnly
                              title="shipping Conditions"
                              value={requestedData?.shippingConditions}
                            />
                          </div>

                          <div className="col-6">
                            <ReadOnly
                              title="shipping Type and Size"
                              value={requestedData?.shippingSize}
                            />
                          </div>

                          <div className="col-6">
                            <ReadOnly
                              title="supply Location"
                              value={requestedData?.supplyLocation}
                            />
                          </div>

                          <div className="col-6">
                            <ReadOnly
                              title="packing Conditions"
                              value={requestedData?.packingConditions}
                            />
                          </div>

                          <div className="col-6">
                            <ReadOnly
                              title="qualityConditions"
                              value={requestedData?.qualityConditions}
                            />
                          </div>

                          <div className="col-6">
                            <ReadOnly
                              title="Created At"
                              value={getMonthName(
                                requestedData?.createdAt?.split("T")?.[0]
                              )}
                            />
                          </div>

                          <div className="col-6">
                            <ReadOnly
                              title="Deadline "
                              value={getMonthName(
                                requestedData?.deadline?.split("T")?.[0]
                              )}
                            />
                          </div>

                          <div className="col-12">
                            <ReadOnly
                              title="More Details"
                              value={requestedData?.moreDetails}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {requestedData?.productId && (
                    <div className="container-profile-input w-100">
                      <ProductDetails productDetails={requestedData?.product} />
                    </div>
                  )}

                  {/* {requestedData?.docs?.length > 0 ? ( */}
                  <div className="container-profile-input w-100">
                    <div className="title-contianer-input w-100">
                      <p> Documents</p>
                      <DisplayMultiImages
                        handleImageClick={handleImageClick}
                        image={requestedData?.requestedData?.docs}
                      />
                    </div>
                  </div>

                  <div className="container-profile-input w-100">
                    <div className="title-contianer-input w-100">
                      <p> TradeMark</p>

                      <DisplayOneImage
                        handleImageClick={handleImageClick}
                        image={requestedData?.tradeMark}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-12 d-flex justify-content-start btn-modal-gap ">
                {requestedData && requestedData?.quoteId == null ? (
                  <button
                    className="btn-edit "
                    type="button"
                    onClick={() => {
                      navigate(
                        `/answerQuotation/PrivateLabel?id=${requestedData?.id}&productName=${requestedData?.productName}&userId=${requestedData?.importerId}`
                      );
                    }}
                  >
                    <p className="cursor">send Quote</p>
                  </button>
                ) : (
                  <button
                    className="btn-edit "
                    type="button"
                    onClick={() => {
                      navigate(
                        `/factorydashboard/editQuote/${requestedData?.quoteId}?privateLabelingId=${requestedData?.id}&productName=${requestedData?.productName}`
                      );
                    }}
                  >
                    <p className="cursor">Edit Quote</p>
                  </button>
                )}

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
