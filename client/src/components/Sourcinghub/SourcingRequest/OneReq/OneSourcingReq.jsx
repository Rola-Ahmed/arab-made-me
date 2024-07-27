import { useState, useContext, useEffect } from "react";
import { baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { useNavigate, useSearchParams } from "react-router-dom";
import { getMonthName as getDate } from "utils/getMonthName";

import Header from "components/main/Header/Header";

import Carousel from "react-grid-carousel";
import { handleImageError } from "utils/ImgNotFound";
import { pdfIcon } from "constants/Images";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import BecomomeAFactory from "components/ActionMessages/BecomeAFactory/BecomeAFactory";
import { getOneSourcingReq } from "Services/sourcingReuqest";
import Loading from "components/Loading/Loading";
import ReadOnly from "components/Forms/Shared/ReadOnly";

function OneSourcingReq() {
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [isLoading, setIsLoading] = useState({
    loading: true,
    errorMsg: "",
  });

  const [searchParams] = useSearchParams();
  const productName = searchParams.get("productName");
  const sourcingRequestId = searchParams.get("sourcingRequestId");

  const [PosData, setPosData] = useState();
  let sendQuote = `answerQuotation/SourcingReq?id=${sourcingRequestId}&productName=${productName}&userId=${PosData?.importerId}`;

  const [modalShow, setModalShow] = useState({
    isFactoryVerified: false,
    isLogin: false,
    isImporterVerified: false,
    BecomeAfactory: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  async function fetchReqData() {
    let result = await getOneSourcingReq(sourcingRequestId, "include=importer");
    if (result?.success) {
      setPosData(result.data.sourcingrequests);
    }
    setIsLoading((prev) => ({
      ...prev,
      loading: result?.loadingStatus,
      errorMsg: result?.error,
    }));
  }

  useEffect(() => {
    fetchReqData();
  }, [sourcingRequestId]);

  // utils function
  let getMonthName = getDate;

  return (
    <>
      <Header title="Sourcing Request " />
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
      {isLoading?.loading && (
        <>
          {isLoading?.errorMsg ? (
            <p className="fs-5 text-muted fw-bolder text-5 my-5 py-5 mx-auto">
              {isLoading?.errorMsg || "No records Found"}
            </p>
          ) : (
            <div className=" d-flex justify-content-center py-5">
              <Loading title="Sourcing Request Details" />
            </div>
          )}
        </>
      )}

      {/* show data  */}
      {!isLoading?.loading && (
        <>
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
                    <ReadOnly
                      title="Product Name"
                      value={PosData?.productName}
                    />
                  </div>

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                    <ReadOnly title="Quantity" value={PosData?.quantity} />
                  </div>

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                    <ReadOnly
                      title="packing Conditions"
                      value={PosData?.packingConditions}
                    />
                  </div>

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                    <ReadOnly
                      title="Quality Conditions"
                      value={PosData?.qualityConditions}
                    />
                  </div>

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                    <ReadOnly
                      title="shipping Conditions"
                      value={PosData?.shippingConditions}
                    />
                  </div>

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                    <ReadOnly
                      title="payment Terms"
                      value={PosData?.paymentTerms}
                    />
                  </div>

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                    <ReadOnly
                      title="available"
                      value={PosData?.available ? "In Stock" : "Out Of Stock"}
                    />
                  </div>

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                    <ReadOnly
                      title="Created At"
                      value={getMonthName(PosData?.createdAt?.split("T")?.[0])}
                    />
                  </div>

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                    <ReadOnly
                      title="Deadline "
                      value={getMonthName(PosData?.deadline?.split("T")?.[0])}
                    />
                  </div>

                  <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                    <ReadOnly
                      title="Preferred Countries"
                      value={PosData?.preferredCountries?.join(", ") || "Empty"}
                    />
                  </div>

                  {/* ---------------------------- */}

                  {PosData?.specialCharacteristics &&
                    Object?.keys(PosData?.specialCharacteristics)?.length >
                      0 && (
                      <div className="col-12 ">
                        <label className="fw-600 mb-1">
                          Product Characteristics
                        </label>

                        <div className="form-control p-4 p-0 ">
                          <div className="row row-gap ">
                            {Object?.entries(
                              PosData?.specialCharacteristics
                            )?.map(([key, value], index) => (
                              <div className="col-6">
                                <ReadOnly title={key} value={value} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  {/* ----------------------------------------- */}

                  <div className="col-12">
                    <ReadOnly
                      title="Product Description"
                      value={PosData?.productDescription}
                    />
                  </div>

                  <div className="col-12">
                    <ReadOnly
                      title="Other Information"
                      value={PosData?.otherInfoRequest}
                    />
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

                          setisLoggedReDirect(`/signIn/${sendQuote}`);
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
                          navigate(`/${sendQuote}`);
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
        </>
      )}
    </>
  );
}

export default OneSourcingReq;
