import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Carousel from "react-grid-carousel";
import { useNavigate, useSearchParams } from "react-router-dom";

import { baseUrl, baseUrl_IMG } from "config.js";
import { UserToken } from "Context/userToken";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

import { pdfIcon } from "constants/Images";
import { handleImageError } from "utils/ImgNotFound";

import FactoryInfo from "components/Factorydashboard/Shared/FactoryInfo";
import ImporterInfo from "components/Factorydashboard/Shared/ImporterInfo";
import HeaderSection from "./HeaderSection";
import { getMonthName as getDate } from "utils/getMonthName";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";

export default function EtcCustomProductReq() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);
  let getMonthName = getDate;

  const [searchParams] = useSearchParams();
  const customProductId = searchParams.get("customProductId");

  const [apiLoadingData, setapiLoadingData] = useState(true);
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });

  const [requestedData, setRequestedData] = useState({ quoteId: null });

  async function fetchReqData() {
    setapiLoadingData(true);

    // check if private label has qoutations

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/spmfs/${customProductId}?include=importer`,
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        // setRequestedData(response.data.specialmanufacturingrequests);

        setRequestedData((prevData) => ({
          ...prevData,
          ...response.data.specialmanufacturingrequests,
        }));

        setapiLoadingData(false);
      } else {
        setapiLoadingData(true);
      }
    } catch (error) {
      setapiLoadingData(true);
    }

    try {
      let QouteIdConfig = {
        method: "get",
        url: `${baseUrl}/factories/factory/quotations`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(QouteIdConfig);

      if (response?.data?.message == "done") {
        const { quotations } = response.data;

        quotations.forEach((item) => {
          if (item.specialManufacturingRequestId == customProductId) {
            // Use item.id to match with privateLabelId
            setRequestedData((prevData) => ({
              ...prevData,
              quoteId: item.id, // Use item.id directly
            }));
          }
        });

        setapiLoadingData(false);
      } else {
        setapiLoadingData(true);
      }
    } catch (error) {
      setapiLoadingData(true);
    }
  }

  async function UpdateData(status) {
    setapiLoadingData(true);

    try {
      let config = {
        method: "put",
        url: `${baseUrl}/spmfs/factory/${customProductId}`,
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

    if (
      requestedData &&
      requestedData?.status !== "rejected" &&
      requestedData?.status !== "accepted"
    ) {
      UpdateData("seen");
    }
  }, [customProductId, requestedData && requestedData?.status == "open"]);

  return (
    <>
      <ToastContainer />

      <IsLoggedIn
        show={modalShow.isLogin}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
      />

      <HeaderSection />

      <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              {/* contains its own fetch i just called it */}
              <FactoryInfo />
              <ImporterInfo importerData={requestedData?.importer} />
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Custom Product Details</p>
                  <div className="w-100 ">
                    <div className="row  row-gap">
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

                      {/* ---------------------------- */}

                      {requestedData?.specialCharacteristics &&
                        Object?.keys(requestedData?.specialCharacteristics)
                          ?.length > 0 && (
                          <div className="col-12 ">
                            <div className="grid-gap-col">
                              <div className="form-group">
                                <label>Product Characteristics</label>
                              </div>
                            </div>

                            <div className="form-group form-control p-4 ">
                              <div className="row row-gap">
                                {Object?.entries(
                                  requestedData?.specialCharacteristics
                                )?.map(([key, value], index) => (
                                  <div className="col-6">
                                    <div className="grid-gap-col">
                                      <div className="form-group">
                                        <label>{key} </label>
                                        <input
                                          className="form-control"
                                          value={value || ""}
                                          readOnly
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      {/* ----------------------------------------- */}

                      <div className="col-12">
                        <div className="form-group">
                          <label> Technical Specifications</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={requestedData?.technicalSpecifications || ""}
                            readOnly
                          ></textarea>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label>inqueries</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={requestedData?.inqueries || ""}
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
                                      // }
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
                      {/* </form> */}
                      {/* ----------------------- */}
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
                        `/answerQuotation?specialManufacturingRequestId=${requestedData?.id}&productName=${requestedData?.productName}&userId=${requestedData?.importerId}`
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
