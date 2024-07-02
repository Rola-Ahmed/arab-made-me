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
export default function OffersFacEtc() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isFactory: false,
  });

  const [searchParams] = useSearchParams();
  const factoryOffersId = searchParams.get("factoryOffersId");

  const [apiLoadingData, setapiLoadingData] = useState(true);

  const [PosData, setPosData] = useState();
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });

  async function fetchReqData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/factory/offers`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        // setPosData(response?.data?.sourcingOffers);

        const matchedObject = response.data.offers.find(
          (obj) => obj.id == factoryOffersId
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
    fetchReqData();
  }, [factoryOffersId]);

  // utils function
  let getMonthName = getDate;

  // auth validation
  useEffect(() => {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));
    } else {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: false,
      }));
    }

    if (currentUserData?.factoryId !== undefined) {
      if (currentUserData?.factoryId === null) {
        setapiLoadingData(true);

        setModalShow((prevVal) => ({
          ...prevVal,
          isFactory: true,
        }));
      } else {
        setModalShow((prevVal) => ({
          ...prevVal,
          isFactory: false,
        }));
      }
    }
  }, [currentUserData, isLogin]);

  return (
    <>
      <IsLoggedIn
        show={modalShow.isLogin}
        distination={`sigin/`}
        bgBlur={"bg-blur"}
      />
      <BecomomeAFactory
        show={modalShow.isFactory}
        // onHide={() =>
        //   setModalShow((prevVal) => ({
        //     ...prevVal,
        //     isFactory: false,
        //   }))
        // }
        bgBlur={"bg-blur"}
      />

      {isLogin && (
        <>
          <div id="view" className="m-4 order-section  ">
            <SubPageUtility
              currentPage="More Details"
              PrevPage="Offer Details"
            />

            <div>
              <div className=" d-flex justify-content-between align-items-center w-100 ">
                <h2>Offer Details</h2>

                <div className="btn-container">
                  <button
                    type="button"
                    className="order-btn-1"
                    onClick={() => {
                      navigate("/factorydashboard/AllFactoryOffers");
                    }}
                  >
                    <p className="cursor"> Offers</p>
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
                      <p> Offer Details</p>
                      <div className="w-100 ">
                        <div className="row  row-gap">
                          <div className="col-6">
                            <div className="grid-gap-col">
                              <div className="form-group">
                                <label>Product Name</label>
                                <input
                                  className="form-control"
                                  value={PosData?.productName || "Empty"}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="grid-gap-col">
                              <div className="form-group">
                                <label>sku</label>
                                <input
                                  className="form-control"
                                  value={PosData?.sku || "Empty"}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="grid-gap-col">
                              <div className="form-group">
                                <label>hsnCode</label>
                                <input
                                  className="form-control"
                                  value={PosData?.productHSNCode || "Empty"}
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
                                  value={PosData?.price || "Empty"}
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
                                  value={PosData?.packingConditions || "Empty"}
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
                                  value={PosData?.qualityConditions || "Empty"}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="grid-gap-col">
                              <div className="form-group">
                                <label>Shipping Conditions</label>
                                <input
                                  className="form-control"
                                  value={PosData?.shippingConditions || "Empty"}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="grid-gap-col">
                              <div className="form-group">
                                <label>Delivery Terms</label>
                                <input
                                  className="form-control"
                                  value={PosData?.deliveryTerms || "Empty"}
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
                                  value={PosData?.paymentTerms || "Empty"}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="grid-gap-col">
                              <div className="form-group">
                                <label>available</label>
                                <input
                                  className="form-control"
                                  value={
                                    PosData?.available
                                      ? "In Stock"
                                      : "Out Of Stock"
                                  }
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="grid-gap-col">
                              <div className="form-group">
                                <label>Delivery Terms</label>
                                <input
                                  className="form-control"
                                  value={
                                    PosData?.preferredCountries?.join(", ") ||
                                    "Empty"
                                  }
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
                                  value={PosData?.quantity || "Empty"}
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
                                    )}` || "Empty"
                                  }
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          {/* ---------------------------- */}

                          {PosData?.specialCharacteristics &&
                            Object?.keys(PosData?.specialCharacteristics)
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
                                      PosData?.specialCharacteristics
                                    )?.map(([key, value], index) => (
                                      <div className="col-6">
                                        <div className="grid-gap-col">
                                          <div className="form-group">
                                            <label>{key} </label>
                                            <input
                                              className="form-control"
                                              value={value || "Empty"}
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
                              <label> Product Description</label>
                              <textarea
                                className="form-control"
                                rows="3"
                                value={PosData?.productDescription || "Empty"}
                                readOnly
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="container-profile-input w-100">
                    <div className="title-contianer-input w-100">
                      <p> Product Images</p>
                      <div className="w-100 ">
                        {/* ----------------------- */}
                        <div className="row grid-gap-col">
                          <div className="col-12">
                            {PosData?.images !== null && PosData?.images ? (
                              <Carousel
                                cols={2}
                                rows={1}
                                gap={10}
                                scrollSnap={true}
                                loop
                                showDots
                                hideArrow={false}
                              >
                                {PosData?.images?.map((item) => (
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

                  {/* <div className="col-12 d-flex justify-content-start btn-modal-gap">
                    
                    <button className="btn-edit " type="button">
                      <p className="cursor">Edit Offer</p>
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </>
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
