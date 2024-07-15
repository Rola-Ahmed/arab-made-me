import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { pdfIcon } from "constants/Images";

import { handleImageError } from "utils/ImgNotFound";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import Carousel from "react-grid-carousel";
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { getMonthName as getDate } from "utils/getMonthName";

import ImporterInfo from "components/Factorydashboard/Shared/ImporterInfo";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";

export default function EtcRfq() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const rfqReqId = searchParams.get("rfqReqId");

  const [apiLoadingData, setApiLoadingData] = useState(true);
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState([]);

  const [requestedData, setRequestedData] = useState({ quoteId: null });

  async function fetchReqData() {
    setApiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/rfqs/${rfqReqId}?include=importer`,
        headers: {
          authorization: isLogin,
        },
      };

      // check if private label has qoutations

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setRequestedData((prevData) => ({
          ...prevData,
          ...response.data.quotationrequests,
        }));

        setApiLoadingData(false);
      } else {
        setApiLoadingData(true);
      }
    } catch (error) {
      setApiLoadingData(true);
    }

    let QouteIdConfig = {
      method: "get",
      url: `${baseUrl}/factories/factory/quotations`,
      headers: {
        authorization: isLogin,
      },
    };

    try {
      const response2 = await axios(QouteIdConfig);

      if (response2.data.message === "done") {
        // Extract the quotations array from the response
        const { quotations } = response2.data;

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
    } catch (error) {}
  }

  async function UpdateData(status) {
    setApiLoadingData(true);

    try {
      let config = {
        method: "put",
        url: `${baseUrl}/rfqs/factory/${rfqReqId}`,
        headers: {
          authorization: isLogin,
        },
        data: {
          status: status,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setRequestedData((prevVal) => ({
          ...prevVal,
          status: status,
        }));

        if (status !== "seen") {
          toast("Status Updated", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            theme: "colored",
            type: "success",
          });
        }
      } else {
        if (status !== "seen") {
          toast("Something Went Wrong, please try Again Later", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            theme: "colored",
            type: "error",
          });
        }
      }
    } catch (error) {
      if (status !== "seen") {
        toast("Something Went Wrong, please try Again Later", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          theme: "colored",
          type: "error",
        });
      }
    }
  }

  useEffect(() => {
    fetchReqData();

    // call if once the page is loaded
    if (
      requestedData &&
      requestedData?.status !== "rejected" &&
      requestedData?.status !== "accepted"
    ) {
      UpdateData("seen");
    }
  }, [rfqReqId, requestedData && requestedData?.status == "open"]);

  // utils function
  let getMonthName = getDate;

  function handleIsLoggedInBtn(loginPath, storgaeName) {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));

      setisLoggedReDirect(`/signIn/${loginPath}`);
      return;
    }

    navigate(`/${loginPath}`);
  }

  return (
    <>
      <IsLoggedIn
        show={modalShow.isLogin}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
        distination={isLoggedReDirect}
      />

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
