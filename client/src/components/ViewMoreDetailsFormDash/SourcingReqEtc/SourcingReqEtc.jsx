import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Carousel from "react-grid-carousel";
import axios from "axios";

import { baseUrl, baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

import { handleImageError } from "utils/ImgNotFound";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import { pdfIcon } from "constants/Images";

import { getMonthName as getDate } from "utils/getMonthName";

export default function SourcingReqEtc() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const sourcingReqId = searchParams.get("sourcingReqId");

  const [apiLoadingData, setapiLoadingData] = useState(true);
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState([]);

  const [PosData, setPosData] = useState();
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });
  let [factoryDetails, setFactoryDetails] = useState({});

  async function fetchFactoriesData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/importers/importer/sourcingRequests`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        const matchedObject = response.data.sourcingRequests.find(
          (obj) => obj.id == sourcingReqId
        );

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
    fetchFactoriesData();
  }, [sourcingReqId]);

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

  // function handleIsLoggedInBtn(loginPath, storgaeName) {
  //   if (!isLogin) {
  //     setModalShow((prevVal) => ({
  //       ...prevVal,
  //       isLogin: true,
  //     }));
  //
  //     setisLoggedReDirect(`/signIn/${loginPath}`);
  //     return;
  //   }

  //

  //   navigate(`/${loginPath}`);
  // }

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
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Sourcing Request Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/AllSourcingRequests");
                }}
              >
                <p className="cursor">Sourcing Requests </p>
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
                    <p>Buyer Information</p>

                    <button
                      className="edit-profile"
                      onClick={() => {
                        navigate(
                          "/importerdashboard/importerProfile#profileImage"
                        );
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
                            <label>Representative Name</label>
                            <input
                              type="text"
                              className="form-control text-dark"
                              value={`${
                                factoryDetails?.repName == null
                                  ? " "
                                  : `${factoryDetails?.repName}`
                              }`}
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
                              value="Buyer"
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Sourcing Request Details</p>
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
                            <label>Quantity</label>
                            <input
                              className="form-control"
                              value={PosData?.quantity || ""}
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
                            <label>Quality Conditions</label>
                            <input
                              className="form-control"
                              value={PosData?.qualityConditions || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>preferredCountries</label>
                            <input
                              className="form-control"
                              value={
                                PosData?.preferredCountries?.join(", ") || ""
                              }
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
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Deadline</label>
                            <input
                              className="form-control"
                              value={
                                `${getMonthName(
                                  PosData?.deadline?.split("T")?.[0]
                                )}` || ""
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {/* ---------------------------- */}

                      {PosData?.specialCharacteristics &&
                        Object?.keys(PosData?.specialCharacteristics)?.length >
                          0 && (
                          <div className="col-12 ">
                            <div className="grid-gap-col">
                              <div className="form-group">
                                <label>Product Characteristics</label>
                              </div>
                            </div>

                            <div className="form-group form-control p-4 ">
                              <div className="row row-gap">
                                {Object?.entries(
                                  PosData?.specialCharacteristics
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
                          <label>Product Description</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={PosData?.productDescription || ""}
                            readOnly
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label> Other Information</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={PosData?.otherInfoRequest || ""}
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

              <div className="col-12 d-flex justify-content-start btn-modal-gap"></div>
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
