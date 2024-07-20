import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "components/Loading/Loading";

// import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

import ImporterInfo from "components/Factorydashboard/Shared/ImporterInfo";
import HeaderSection from "./HeaderSection";
import { getMonthName as getDate } from "utils/getMonthName";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";
import { useSpmf } from "./useSpmf";
import ReadOnly from "components/Forms/Shared/ReadOnly";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import DisplayOneImage from "components/Shared/Dashboards/DisplayOneImage";

export default function EtcCustomProductReq() {
  let navigate = useNavigate();

  let getMonthName = getDate;
  let { isLogin, requestedData, apiLoadingData } = useSpmf();

  console.log("requestedData",requestedData)
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
      {/* <IsLoggedIn
        show={modalShow.isLogin}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
      /> */}

      <HeaderSection />

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

      {!apiLoadingData?.reqData && <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {/* contains its own fetch i just called it */}
              <ImporterInfo importerData={requestedData?.importer} />
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Custom Product Details</p>
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
                          value={requestedData?.packingType}
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

                      {/* ---------------------------- */}

                      {requestedData?.specialCharacteristics &&
                        Object.keys(requestedData?.specialCharacteristics)
                          ?.length > 0 && (
                          <div className="col-12 ">
                            <label className="fw-600 mb-1">
                              Product Characteristics
                            </label>

                            <div className="form-group form-control p-4 ">
                              <div className="row row-gap">
                                {Object?.entries(
                                  requestedData?.specialCharacteristics
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
                          title="Technical Specifications"
                          value={requestedData?.technicalSpecifications}
                        />
                      </div>

                      <div className="col-12">
                        <ReadOnly
                          title="inqueries"
                          value={requestedData?.inqueries}
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
                    image={requestedData?.tradeMark}
                  />
                </div>
              </div>

              <div className="col-12 d-flex justify-content-start btn-modal-gap">
                {requestedData && requestedData?.quoteId == null ? (
                  <button
                    className="btn-edit "
                    type="button"
                    onClick={() => {
                      navigate(
                        `/answerQuotation/spmf?id=${requestedData?.id}&productName=${requestedData?.productName}&userId=${requestedData?.importerId}`
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
                        `/factorydashboard/editQuote/${requestedData?.quoteId}?specialManufacturingRequestId=${requestedData?.id}&productName=${requestedData?.productName}`
                      );
                    }}
                  >
                    <p className="cursor">Edit Quote</p>
                  </button>
                )}

                <button
                  className="btn-edit border-btn bg-white d-none "
                  type="button"
                  onClick={() => {
                    navigate(
                      `/contactsupplier?userId=${requestedData?.importer?.userId}&importerName=${requestedData?.importer?.name}`
                    );
                  }}
                >
                  <p className="cursor text-success text-dark">Contact Buyer</p>
                </button>
                <ContactBtn
                  isLogin={isLogin}
                  recieverUserId={requestedData?.importer?.userId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>}
      

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
