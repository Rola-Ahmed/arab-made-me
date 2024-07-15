import { useEffect, useState, useContext } from "react";
import { baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { pdfIcon } from "constants/Images";

import { handleImageError } from "utils/ImgNotFound";
import { useNavigate, useSearchParams } from "react-router-dom";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import Carousel from "react-grid-carousel";
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { getMonthName as getDate } from "utils/getMonthName";

import ImporterInfo from "components/Factorydashboard/Shared/ImporterInfo";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";

import { getOneRFQ } from "Services/rfq";
import { getQuotes } from "Services/FactoryRequests/quotations";
import { updateRFQ } from "Services/FactoryRequests/rfq";
export default function OneRfqs() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const rfqReqId = searchParams.get("rfqReqId");

  const [apiLoadingData, setApiLoadingData] = useState(true);
  const [error, setError] = useState(true);

  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });

  const [requestedData, setRequestedData] = useState({ quoteId: null });

  async function fetchReqData() {
    setApiLoadingData(true);

    let result = await getOneRFQ(rfqReqId, "include=importer");

    if (result?.success) {
      setRequestedData((prevData) => ({
        ...prevData,
        ...result.data.quotationrequests,
      }));
    } else {
      setError(result?.error);
    }
    setApiLoadingData(false);

    const QouteIdConfigResp = await getQuotes(
      {},
      {
        authorization: isLogin,
      }
    );

    if (QouteIdConfigResp?.success) {
      // Extract the quotations array from the response
      const { quotations } = QouteIdConfigResp.data;

      quotations.forEach((item) => {
        if (item.quotationRequestId == rfqReqId) {
          // Use item.id to match with privateLabelId
          setRequestedData((prevData) => ({
            ...prevData,
            quoteId: item.id, // Use item.id directly
          }));
        }
      });
    }
  }

  async function UpdateData(status) {
    setApiLoadingData(true);

    let response = await updateRFQ(
      rfqReqId,
      { authorization: isLogin },
      { status: status }
    );
    if (response?.success) {
      setRequestedData((prevVal) => ({
        ...prevVal,
        status: status,
      }));
    }
  }

  useEffect(() => {
    // fetch inial data
    fetchReqData();
    // Check if data is being opened for the first time
    // call if once the page is loaded

    if (requestedData && requestedData.status === "open") {
      UpdateData("seen");
    }
  }, [rfqReqId, requestedData]);

  // utils function
  let getMonthName = getDate;

  return (
    <>
     

      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="RFQs" />

        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2 className="">RFQ Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/factorydashboard/RfqRequests");
                }}
              >
                <p className="cursor">RFQ Requests </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              <ImporterInfo importerData={requestedData?.importer} />

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> RFQ Details</p>
                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="form-group">
                          <label>Product Name</label>
                          <input
                            className="form-control"
                            value={requestedData?.productName || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>Quantity</label>
                          <input
                            className="form-control"
                            value={requestedData?.quantity || ""}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label>shipping Conditions</label>
                          <input
                            className="form-control"
                            value={requestedData?.shippingConditions || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>packing Conditions</label>
                          <input
                            className="form-control"
                            value={requestedData?.packingConditions || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>payment Terms</label>
                          <input
                            className="form-control"
                            value={requestedData?.paymentTerms || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>Quality Conditions</label>
                          <input
                            className="form-control"
                            value={requestedData?.qualityConditions || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>status</label>
                          <input
                            className="form-control"
                            value={requestedData?.status || ""}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-6">
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
                      <div className="col-6">
                        <label>Deadline</label>
                        <input
                          className="form-control"
                          value={
                            `${getMonthName(
                              requestedData?.deadline?.split("T")?.[0]
                            )}` || ""
                          }
                          readOnly
                        />
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label> Other Information</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={requestedData?.otherInfoRequest || ""}
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
                                      alt={item?.pdfFile?.name?.includes("pdf")}
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
                    </div>
                  </div>
                </div>
              )}

              <div className="col-12 d-flex justify-content-start btn-modal-gap">
                {requestedData && requestedData?.quoteId == null ? (
                  <button
                    className="btn-edit "
                    type="button"
                    onClick={() => {
                      navigate(
                        `/answerQuotation?quotationRequestId=${requestedData?.id}&productName=${requestedData?.productName}&userId=${requestedData?.importerId}&productId=${requestedData?.productId}`
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
                        `/factorydashboard/editQuote/${requestedData?.quoteId}?quotationRequestId=${requestedData?.id}&productName=${requestedData?.productName}`
                      );
                    }}
                  >
                    <p className="cursor">Edit Quote</p>
                  </button>
                )}

                <button
                  className="btn-edit border-btn bg-white  d-none"
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
