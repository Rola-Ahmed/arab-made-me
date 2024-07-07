import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { pdfIcon } from "constants/Images";

import { handleImageError } from "utils/ImgNotFound";

import { useNavigate, useSearchParams } from "react-router-dom";

import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
// import BecomomeAFactory from "components/ActionMessages/BecomomeAFactory/BecomomeAFactory";

import Carousel from "react-grid-carousel";
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import ContactBtn from "components/Importerdashboard/Shared/ContactBtn";
export default function PrivateLabelReqEtc() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const privateLabelId = searchParams.get("privateLabelId");

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
  const [isLoggedReDirect, setisLoggedReDirect] = useState([]);

  const [PosData, setPosData] = useState();
  let [factoryDetails, setFactoryDetails] = useState({});

  async function fetchFactoriesData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/importers/importer/privateLabelings?include=factory`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        const matchedObject = response.data.privateLabelings.find(
          (obj) => obj.id == privateLabelId
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
  }, [privateLabelId]);

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

  function handleIsLoggedInBtn(loginPath) {
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
        <SubPageUtility currentPage="More Details" PrevPage="Private Labels" />
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Private Label Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/PrivateLabel");
                }}
              >
                <p className="cursor">Private Label Requests</p>
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
                  <p>Factory Information</p>

                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Factory Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={PosData?.factory?.name || ""}
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
                              value={PosData?.factory?.repPhone || ""}
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
                                PosData?.factory?.repName == null
                                  ? " "
                                  : `${PosData?.factory?.repName?.[0]}  ${PosData?.factory?.repName?.[1]}`
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
                              value={PosData?.factory?.repEmail || ""}
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
                  <p> Private Label Details</p>
                  <div className="w-100 ">
                    <div className="row  row-gap">
                      {PosData?.productName !== null && (
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
                      )}

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

                      <div className="col-12">
                        <div className="form-group">
                          <label> More Details</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={PosData?.moreDetails || ""}
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

              <div className="col-12 d-flex justify-content-start btn-modal-gap mb-4">
                {/* <button
                  className="btn-edit d-none  "
                  type="button"
                  onClick={() => {
                    handleIsLoggedInBtn(
                      `contactsupplier?userId=${PosData?.factory?.userId}&factoryName=${PosData?.factory?.name}`
                    );
                  }}
                >
                  <p className="cursor ">Contact Supplier</p>
                </button> */}
                <ContactBtn
                  isLogin={isLogin}
                  handleIsLoggedInBtn={handleIsLoggedInBtn}
                  recieverUserId={PosData?.factory?.userId}
                  baseUrl={baseUrl}
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
