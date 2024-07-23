import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { pdfIcon } from "constants/Images";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { handleImageError } from "utils/ImgNotFound";
import ContactBtn from "components/Importerdashboard/Shared/ContactBtn";

import { useNavigate, useSearchParams } from "react-router-dom";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

import Carousel from "react-grid-carousel";
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
export default function QuotationsEtc() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const quotationsId = searchParams.get("quotationsId");

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
        url: `${baseUrl}/importers/importer/quotations?include=factory`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        const matchedObject = response.data.quotations.find(
          (obj) => obj.id == quotationsId
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
  }, [quotationsId]);

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

  // async function UpdateData(status) {
  //   setapiLoadingData(true);

  //   try {
  //     let config = {
  //       method: "put",
  //       url: `${baseUrl}/quotations/${quotationsId}`,
  //       headers: {
  //         authorization: isLogin,
  //       },
  //       data: {
  //         status: status,
  //       },
  //     };

  //     const response = await axios.request(config);

  //     if (response?.data?.message == "done") {
  //       setPosData((prevVal) => ({
  //         ...prevVal,
  //         status: status,
  //       }));

  //       if (status !== "seen") {
  //         toast("Status Updated", {
  //           position: "top-center",
  //           autoClose: 5000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           draggable: true,
  //           theme: "colored",
  //           type: "success",
  //         });
  //       }
  //     } else {
  //       if (status !== "seen") {
  //         toast("Something Went Wrong, please try Again Later", {
  //           position: "top-center",
  //           autoClose: 5000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           draggable: true,
  //           theme: "colored",
  //           type: "error",
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     if (status !== "seen") {
  //       toast("Something Went Wrong, please try Again Later", {
  //         position: "top-center",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         draggable: true,
  //         theme: "colored",
  //         type: "error",
  //       });
  //     }
  //   }
  // }

  // useEffect(() => {
  //   setPosData();

  //   if (
  //     PosData &&
  //     PosData?.status !== "rejected" &&
  //     PosData?.status !== "accepted"
  //   ) {
  //     UpdateData("seen");
  //   }
  // }, [quotationsId, PosData && PosData?.status == "open"]);

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
        distination={isLoggedReDirect}
      />

      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="Quotations" />
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Quotations Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/AllQuotations");
                }}
              >
                <p className="cursor">Quotations</p>
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
                  <p> Quotations Details</p>
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
                            <label>Min Quantity</label>
                            <input
                              className="form-control"
                              value={PosData?.minQuantity || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Price</label>
                            <input
                              className="form-control"
                              value={PosData?.price || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Discounts</label>
                            <input
                              className="form-control"
                              value={PosData?.discounts || ""}
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
                            <label>timeForDelivery</label>
                            <input
                              className="form-control"
                              value={PosData?.timeForDelivery || ""}
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
                          <label> Other Information</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={PosData?.notes || ""}
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
                <button
                  className="btn-edit border-btn bg-white d-none"
                  type="button"
                  onClick={() => {
                    // UpdateData("accepted");
                  }}
                >
                  <p className="cursor text-success">Accept Request</p>
                </button>
                <button
                  className="btn-edit  border-btn bg-white d-none"
                  type="button"
                  onClick={() => {
                    // UpdateData("rejected");
                  }}
                >
                  <p className="cursor text-danger">Reject Request</p>
                </button>
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
