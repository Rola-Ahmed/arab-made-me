import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-grid-carousel";
import Loading from "components/Loading/Loading";

import { baseUrl_IMG } from "config.js";

import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

// utils
import { handleImageError } from "utils/ImgNotFound";
import { getMonthName as getDate } from "utils/getMonthName";

// constans
import { pdfIcon } from "constants/Images";

// sub Components
import HeaderSection from "./HeaderSection";
import FactoryInfo from "components/Factorydashboard/Shared/FactoryInfo";
import ImporterInfo from "components/Factorydashboard/Shared/ImporterInfo";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";

// utils function
export default function EtcPrivateLabelReq(props) {
  let { requestedData, apiLoadingData, isLogin } = props;

  // console.log("Edededdede", requestedData, apiLoadingData);
  let navigate = useNavigate();

  // utils function
  let getMonthName = getDate;

  // popup image( used to see a bigger verison of the requested media )
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });

  return (
    <>
      <HeaderSection />

      <div className="section factory-profile m-5 ">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              <FactoryInfo />

              <ImporterInfo importerData={requestedData?.importer} />

              {apiLoadingData?.reqData ? (
                <div className="d-flex justify-content-center w-100">
                  <Loading />
                </div>
              ) : (
                <>
                  <div className="container-profile-input w-100">
                    <div className="title-contianer-input w-100">
                      <p> Private Label Details</p>
                      <div className="w-100 ">
                        <div className="row  row-gap">
                          {requestedData?.productName !== null && (
                            <div className="col-6">
                              <div className="grid-gap-col">
                                <div className="form-group">
                                  <label>Product Name</label>
                                  <input
                                    className="form-control"
                                    value={requestedData?.productName || ""}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="col-6">
                            <div className="grid-gap-col">
                              <div className="form-group">
                                <label>status</label>
                                <input
                                  className="form-control"
                                  value={requestedData?.status || ""}
                                  readOnly
                                />
                              </div>
                            </div>
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

                          <div className="col-12">
                            <div className="form-group">
                              <label> More Details</label>
                              <textarea
                                className="form-control"
                                rows="3"
                                value={requestedData?.moreDetails || ""}
                                readOnly
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {requestedData?.docs?.length > 0 && (
                    <div className="container-profile-input w-100">
                      <div className="title-contianer-input w-100">
                        <p> Documents</p>
                        <div className="w-100 ">
                          {/* ----------------------- */}
                          <div className="row grid-gap-col">
                            <div className="col-12">
                              {requestedData?.docs ? (
                                <Carousel
                                  cols={2}
                                  rows={1}
                                  gap={10}
                                  scrollSnap={true}
                                  loop
                                  showDots
                                  hideArrow={false}
                                >
                                  {requestedData?.docs?.map((item) => (
                                    <Carousel.Item>
                                      <div
                                        className="dots-slider-img w-100  cursor"
                                        onClick={() => {
                                          setShowImagePop({
                                            display: true,
                                            imagePath: `${baseUrl_IMG}/${item}`,
                                          });
                                        }}
                                      >
                                        <img
                                          className="h-100 w-100 "
                                          id={handleImageError}
                                          src={
                                            item?.includes("pdf")
                                              ? pdfIcon
                                              : `${baseUrl_IMG}/${item}`
                                          }
                                          alt={item?.pdfFile?.name?.includes(
                                            "pdf"
                                          )}
                                          onError={handleImageError}
                                        />
                                      </div>
                                    </Carousel.Item>
                                  ))}
                                </Carousel>
                              ) : (
                                <h5 className="text-muted text-center py-3">
                                  Empty
                                </h5>
                              )}
                            </div>
                          </div>
                          {/* </form> */}
                          {/* ----------------------- */}
                        </div>
                      </div>
                    </div>
                  )}
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
