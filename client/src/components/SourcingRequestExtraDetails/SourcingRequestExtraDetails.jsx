import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { useNavigate, useSearchParams } from "react-router-dom";
import { getMonthName as getDate } from "utils/getMonthName";

import Footer from "components/main/Footer/Footer";
import Header from "components/main/Header/Header";
import Navbar from "components/main/Navbar/Navbar";
import LoadingForm from "components/Loading/LoadingForm";

import Carousel from "react-grid-carousel";
import { handleImageError } from "utils/ImgNotFound";
import { pdfIcon } from "constants/Images";
import UserNotAuthorized from "components/ActionMessages/UserNotAuthorized/UserNotAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerifiedModal/FactoryUnVerifiedModal";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg/IsLoggedInMsg";
import BecomomeAFactory from "components/ActionMessages/BecomomeAFactory/BecomomeAFactory";

function SourcingRequestExtraDetails() {
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [isLoading, setIsLoading] = useState({
    reqInfo: false,
    factoryInfo: false,
  });

  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const productId = searchParams.get("productId");
  const factoryName = searchParams.get("factoryName");
  const productName = searchParams.get("productName");
  const sourcingRequestId = searchParams.get("sourcingRequestId");

  const [PosData, setPosData] = useState();
  const [modalShow, setModalShow] = useState({
    isFactoryVerified: false,
    isLogin: false,
    isImporterVerified: false,
    BecomeAfactory: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  async function fetchReqData() {
    setIsLoading((prev) => ({
      ...prev,
      reqInfo: true,
    }));

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/sourcingRequests/${sourcingRequestId}`,
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setPosData(response.data.sourcingrequests);

        setIsLoading((prev) => ({
          ...prev,
          reqInfo: false,
        }));
      } else {
        setIsLoading((prev) => ({
          ...prev,
          reqInfo: true,
        }));
      }
    } catch (error) {
      setIsLoading((prev) => ({
        ...prev,
        reqInfo: true,
      }));
    }
  }

  useEffect(() => {
    fetchReqData();
  }, [sourcingRequestId]);

  // utils function
  let getMonthName = getDate;

  return (
    <>
      {/* user not logged in */}
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

      {/* user is importer */}
      <UserNotAuthorized
        show={modalShow.isImporterVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isImporterVerified: false,
          }))
        }
        userType="Factory"
      />
      {/* factory  not verified*/}

      <FactoryUnVerified
        show={modalShow.isFactoryVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isFactoryVerified: false,
          }))
        }
        // userType="Factory"
      />

      {/* defult user  */}
      <BecomomeAFactory
        show={modalShow.BecomeAfactory}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            BecomeAfactory: false,
          }))
        }
      />

      {/* if data is not loaded */}
      {isLoading?.factoryInfo && (
        <LoadingForm title="Sourcing Request Details" />
      )}

      {/* show data  */}
      {!isLoading?.factoryInfo && (
        <>
          <Navbar />
          <Header title="Sourcing Request Details " subTitle="PO" />
          <section id="view" className="send-po">
            {/* Grid  */}
            <div className="container container-po ">
              <div className="input-content ">
                <div className="title-text w-100 ">
                  <h5>Request details</h5>
                </div>
                <div className="row row-container w-100 ">
                  {/* <div className="row  row-gap"> */}
                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
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

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
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
                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
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
                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
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

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
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

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
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

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                    <div className="grid-gap-col">
                      <div className="form-group">
                        <label>available</label>
                        <input
                          className="form-control"
                          value={
                            PosData?.available ? "In Stock" : "Out Of Stock"
                          }
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
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

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
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

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                    <div className="grid-gap-col">
                      <div className="form-group">
                        <label>Deadline </label>
                        <input
                          className="form-control"
                          value={
                            `${getMonthName(
                              PosData?.deadline?.split("T")?.[0]
                            )}` || "Empty"
                          }
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                    <div className="grid-gap-col">
                      <div className="form-group">
                        <label>Preferred Countries </label>
                        <input
                          className="form-control"
                          value={
                            PosData?.preferredCountries?.join(", ") || "Empty"
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

                        <div className="form-control p-4 p-0 ">
                          <div className="row row-gap ">
                            {Object?.entries(
                              PosData?.specialCharacteristics
                            )?.map(([key, value], index) => (
                              <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12">
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

                            {Object?.entries(
                              PosData?.specialCharacteristics
                            )?.map(([key, value], index) => (
                              <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12">
                                {/* <div className="grid-gap-col"> */}
                                <div className="form-group">
                                  <label>{key} </label>
                                  <input
                                    className="form-control"
                                    value={value || "Empty"}
                                    readOnly
                                  />
                                </div>
                                {/* </div> */}
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

                  <div className="col-12">
                    <div className="form-group">
                      <label> Other Information</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={PosData?.otherInfoRequest || "Empty"}
                        readOnly
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      {/* <img
                        className="h-100 w-100 "
                        id={handleImageError}
                        src={"fvrfbtbyhg.phg"}
                        onError={handleImageError}
                      /> */}
                      <label>Documents</label>
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
                                  // setShowImagePop({
                                  //   display: true,
                                  //   imagePath: `${baseUrl_IMG}/${item}`,
                                  // });
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
                        <h5 className="text-muted text-center py-3 text-center w-100">
                          Empty
                        </h5>
                      )}
                    </div>
                  </div>
                </div>
                {/* </div> */}

                <div className="action row">
                  <div className="col-12">
                    <button
                      className="action-btn btn-1 w-100 submitButton"
                      onClick={() => {
                        if (currentUserData?.importerId !== null) {
                          setModalShow((prevVal) => ({
                            ...prevVal,
                            isImporterVerified: true,
                          }));

                          return;
                        }

                        if (
                          currentUserData?.factoryId !== null &&
                          (currentUserData?.factoryVerified === "0" ||
                            !currentUserData?.factoryEmailActivated)
                        ) {
                          setModalShow((prevVal) => ({
                            ...prevVal,
                            isFactoryVerified: true,
                          }));

                          return;
                        } else if (!isLogin) {
                          setModalShow((prevVal) => ({
                            ...prevVal,
                            isLogin: true,
                          }));

                          setisLoggedReDirect(
                            `/signIn/answerQuotation?sourcingRequestId=${sourcingRequestId}&productName=${productName}`
                          );
                          return;
                        }

                        if (
                          currentUserData?.importerId == null &&
                          currentUserData?.factoryId == null
                        ) {
                          setModalShow((prevVal) => ({
                            ...prevVal,
                            BecomeAfactory: true,
                          }));

                          return;
                        } else {
                          navigate(
                            `/answerQuotation?sourcingRequestId=${sourcingRequestId}&productName=${productName}`
                          );
                        }
                      }}
                    >
                      Send Quotation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </>
  );
}

export default SourcingRequestExtraDetails;
