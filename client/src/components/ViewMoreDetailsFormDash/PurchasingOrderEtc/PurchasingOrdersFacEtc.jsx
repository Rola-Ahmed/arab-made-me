import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { pdfIcon } from "constants/Images";

import { handleImageError } from "utils/ImgNotFound";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg/IsLoggedInMsg";
import BecomomeAFactory from "components/ActionMessages/BecomomeAFactory/BecomomeAFactory";

import { useNavigate, useSearchParams } from "react-router-dom";

import Carousel from "react-grid-carousel";
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
export default function PurchasingOrdersFacEtc() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const poId = searchParams.get("poId");

  const [apiLoadingData, setapiLoadingData] = useState(true);
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });

  const [PosData, setPosData] = useState();
  let [factoryDetails, setFactoryDetails] = useState({});

  async function fetchReqData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/factory/pos?include=importer`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        const matchedObject = response.data.pos.find((obj) => obj.id == poId);

        if (matchedObject) {
          setPosData(matchedObject);
        }

        setapiLoadingData(false);
      } else {
        setapiLoadingData(true);
      }
    } catch (error) {
      setapiLoadingData(true);
    }
  }

  useEffect(() => {
    fetchReqData();
  }, [poId]);
  async function fetchFactoryData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/${currentUserData?.factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.factories);
      } else if (response.data.message == "404 Not Found") {
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (currentUserData && currentUserData?.factoryId !== null) {
      fetchFactoryData();
    }
  }, [currentUserData]);

  // utils function
  let getMonthName = getDate;

  async function fetchImporterData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/importers/${currentUserData?.importerId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.importers);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (currentUserData && currentUserData?.importerId !== null) {
      fetchImporterData();
    }
  }, [currentUserData]);

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

      <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <div className="d-flex justify-content-between">
                    <p>Factory Information</p>
                    <button
                      className="edit-profile"
                      onClick={() => {
                        navigate("/factorydashboard/mircoSite#factorylogo");
                      }}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Factory Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={factoryDetails?.name || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Role</label>
                            <input
                              type="text"
                              className="form-control text-dark"
                              value="Factory"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representative phone number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={factoryDetails?.repPhone || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representative Name</label>
                            <input
                              className="form-control text-dark"
                              value={`${
                                factoryDetails?.repName == null
                                  ? " "
                                  : `${factoryDetails?.repName?.[0]}  ${factoryDetails?.repName?.[1]}`
                              }`}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label> Representative email</label>
                            <input
                              type="text"
                              className="form-control"
                              value={factoryDetails?.repEmail || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <div className="d-flex justify-content-between">
                    <p>Buyer Information</p>
                  </div>
                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representative Name</label>
                            <input
                              type="text"
                              className="form-control text-dark"
                              value={`${
                                PosData?.importer?.repName == null
                                  ? " "
                                  : `${PosData?.importer?.repName}`
                              }`}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label> Representative email</label>
                            <input
                              type="text"
                              className="form-control"
                              value={PosData?.importer?.repEmail || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representative phone number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={PosData?.importer?.repPhone || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Purchasing Order Details</p>
                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Product Name</label>
                            <input
                              className="form-control"
                              value={PosData?.productName || ""}
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
                              value={PosData?.status || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>shipping Conditions</label>
                            <input
                              className="form-control"
                              value={PosData?.shippingConditions || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>packing Conditions</label>
                            <input
                              className="form-control"
                              value={PosData?.packingConditions || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>payment Terms</label>
                            <input
                              className="form-control"
                              value={PosData?.paymentTerms || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>estimation Delay</label>
                            <input
                              className="form-control"
                              value={PosData?.estimationDelay || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label> Manufacturing Delay</label>
                            <input
                              className="form-control"
                              value={PosData?.timeOfManufacturingDelay || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>examination Delay</label>
                            <input
                              className="form-control"
                              value={PosData?.examinationDelay || ""}
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
                                  PosData?.createdAt?.split("T")?.[0]
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
                          {PosData?.timeLine.map((item, index) => (
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
                        <div className="form-group">
                          <label> Instructions</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={PosData?.instructions || ""}
                            readOnly
                          ></textarea>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label> company Quality Testing</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={PosData?.companyQualityTesting || ""}
                            readOnly
                          ></textarea>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label> conditionsOfDelays</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={PosData?.conditionsOfDelays || ""}
                            readOnly
                          ></textarea>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label>legalStamp</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={PosData?.legalStamp || ""}
                            readOnly
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {PosData?.docs?.length > 0 && (
                <div className="container-profile-input w-100">
                  <div className="title-contianer-input w-100">
                    <p> Documents</p>
                    <div className="w-100 ">
                      {/* ----------------------- */}
                      <div className="row grid-gap-col">
                        <div className="col-12">
                          {PosData?.docs ? (
                            <Carousel
                              cols={2}
                              rows={1}
                              gap={10}
                              scrollSnap={true}
                              loop
                              showDots
                              hideArrow={false}
                            >
                              {PosData?.docs?.map((item) => (
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
                      {/* </form> */}
                      {/* ----------------------- */}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
