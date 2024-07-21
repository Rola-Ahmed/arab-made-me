import { useState } from "react";

import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
// import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
// import BecomomeAFactory from "components/ActionMessages/BecomeAFactory/BecomeAFactory";

import { useNavigate } from "react-router-dom";
import { useOnePo } from "./useOnePo";

// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import ImporterInfo from "components/Factorydashboard/Shared/ImporterInfo";
import ReadOnly from "components/Forms/Shared/ReadOnly";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import DisplayOneImage from "components/Shared/Dashboards/DisplayOneImage";
import Loading from "components/Loading/Loading";
import ProductDetails from "components/Forms/Shared/SelectedProductDetails";

export default function OnePo() {
  let navigate = useNavigate();
  let { isLogin, requestedData, apiLoadingData } = useOnePo();

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

  // utils function
  let getMonthName = getDate;

  return (
    <>
      <div id="view" className="m-4 order-section  ">
        <SubPageUtility
          currentPage="More Details"
          PrevPage="Purchasing Offer Details"
        />
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Purchasing Order Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/purchasingOrders");
                }}
              >
                <p className="cursor">All Purchasing Order</p>
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
                {/* contains its own fetch i just called it */}
                <ImporterInfo importerData={requestedData?.importer} />

                {requestedData?.productId && (
                  <div className="container-profile-input w-100">
                    <ProductDetails productDetails={requestedData?.product} />
                  </div>
                )}

                <div className="container-profile-input w-100">
                  <div className="title-contianer-input w-100">
                    <p> Purchasing Order Details</p>
                    <div className="w-100 ">
                      <div className="row  row-gap">
                        <div className="col-6">
                          <ReadOnly
                            title="Product Name"
                            value={requestedData?.productName}
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
                            title="deadline"
                            value={requestedData?.deadline}
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
                            value={requestedData?.shippingTypeAndSize}
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
                            value={requestedData?.qualityConditions}
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
                            title="payment Terms"
                            value={requestedData?.paymentTerms}
                          />
                        </div>

                        <div className="col-6">
                          <div className="grid-gap-col">
                            <div className="form-group">
                              <label>Created At </label>
                              <input
                                className="form-control"
                                value={
                                  `${getMonthName(
                                    requestedData?.createdAt?.split("T")?.[0]
                                  )}` || ""
                                }
                                readOnly
                              />
                            </div>
                          </div>
                        </div>

                        {/* ---------------------------- */}

                        <div className="col-12 ">
                          <div className="grid-gap-col">
                            <div className="form-group">
                              <label>Time Line</label>
                            </div>
                          </div>

                          {/* <div className="form-group form-control "> */}
                          <div className="form-group form-control p-4 ">
                            {requestedData?.timeLine.map((item, index) => (
                              <div className="row  row-gap">
                                <div className="col-6">
                                  <div className="grid-gap-col">
                                    <div className="form-group">
                                      <label>Date {index + 1}</label>
                                      <input
                                        className="form-control"
                                        value={
                                          `${getMonthName(
                                            item?.date?.split("T")?.[0]
                                          )}` || ""
                                        }
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="col-6">
                                  <div className="grid-gap-col">
                                    <div className="form-group">
                                      <label forhtml="specialCharDesc">
                                        Quantity {index + 1}
                                      </label>
                                      <input
                                        className="form-control"
                                        value={item.quantity}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* </div> */}
                          </div>
                        </div>
                        {/* ----------------------------------------- */}

                        <div className="col-12">
                          <ReadOnly
                            title="Instructions"
                            value={requestedData?.instructions}
                          />
                        </div>
                        <div className="col-12">
                          <ReadOnly
                            title="Instructions"
                            value={requestedData?.conditionsOfDelays}
                          />
                        </div>

                        <div className="col-12">
                          <ReadOnly
                            title="Time Of Manufacturing Delay"
                            value={requestedData?.timeOfManufacturingDelay}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container-profile-input w-100">
                  <div className="title-contianer-input w-100">
                    <p> Documents</p>
                    <DisplayMultiImages
                      handleImageClick={handleImageClick}
                      images={requestedData?.docs}
                    />
                  </div>
                </div>

                <div className="container-profile-input w-100">
                  <div className="title-contianer-input w-100">
                    <p> TradeMark</p>

                    <DisplayOneImage
                      handleImageClick={handleImageClick}
                      image={requestedData?.legalStamp}
                    />
                  </div>
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
