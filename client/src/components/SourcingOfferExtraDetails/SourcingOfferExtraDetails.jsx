import React, { useState, useContext, useEffect } from "react";

import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { useNavigate, useSearchParams } from "react-router-dom";

import Footer from "components/main/Footer/Footer";
import Header from "components/main/Header/Header";
import Navbar from "components/main/Navbar/Navbar";
import LoadingForm from "components/Loading/LoadingForm";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerifiedModal/ImporterUnVerifiedModal";
import UserNotAuthorized from "components/ActionMessages/UserNotAuthorized/UserNotAuthorized";

import { getMonthName as getDate } from "utils/getMonthName";

function SourcingOfferExtraDetails() {
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);

  // utils function
  let getMonthName = getDate;

  let { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const productId = searchParams.get("productId");
  const factoryName = searchParams.get("factoryName");
  // const productName = searchParams.get("productName");
  const factoryOffersId = searchParams.get("factoryOffersId");

  let [factoryDetails, setFactoryDetails] = useState({});
  const [isLoading, setIsLoading] = useState({
    pageLoading: false,
    reqInfo: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");
  const [PosData, setPosData] = useState();
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });

  async function fetchReqData() {
    setIsLoading((prev) => ({
      ...prev,
      reqInfo: true,
    }));

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/sourcingOffers/${factoryOffersId}`,
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setPosData(response.data.sourcingoffers);

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
  } // factory details
  async function fetchFactoryData() {
    setIsLoading((prev) => ({
      ...prev,
      pageLoading: true,
    }));
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/${factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.factories);
        setIsLoading((prev) => ({
          ...prev,
          pageLoading: false,
        }));
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  if (factoryId == null) {
    localStorage.setItem("ToHomePage", "Page Not Found");

    navigate("/");
  }

  function handleButtonClick(loginPath, storgaeName) {
    if (
      currentUserData?.importerId !== null &&
      (currentUserData?.importerVerified === "0" ||
        !currentUserData?.importerEmailActivated)
    ) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isImporterVerified: true,
      }));
      return;
    }

    if (currentUserData?.factoryId !== null) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isFactoryVerified: true,
      }));
      return;
    }

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

  useEffect(() => {
    fetchReqData();
  }, [factoryOffersId]);

  useEffect(() => {
    fetchFactoryData();
  }, [factoryId]);

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

      <ImporterUnVerified
        show={modalShow.isImporterVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isImporterVerified: false,
          }))
        }
      />

      <UserNotAuthorized
        show={modalShow.isFactoryVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isFactoryVerified: false,
          }))
        }
        userType="Buyer"
      />

      {isLoading?.pageLoading && <LoadingForm title="Send PO " subTitle="PO" />}

      {!isLoading?.pageLoading && (
        <>
          <Navbar />
          <Header title="Send PO " subTitle="PO" />
          <section id="view" className="send-po">
            {/* Factory description */}
            <div className="container container-po ">
              <div className="input-content ">
                <div className="title-text w-100 ">
                  <h5>Factory Details</h5>
                </div>

                <div className="row row-container w-100 ">
                  <div className="col-md-6 col-sm-12">
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

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Representative Name</label>
                      <input
                        type="text"
                        className="form-control text-dark"
                        id="repName"
                        name="repName"
                        value={factoryDetails?.repName || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Representative Email</label>
                      <input
                        type="text"
                        className="form-control text-dark"
                        id="repEmail"
                        name="repEmail"
                        value={factoryDetails?.repEmail}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Representative phone number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="repPhone"
                        name="repPhone"
                        value={factoryDetails?.repPhone}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>description</label>
                      <textarea
                        type="text"
                        className="form-control"
                        value={factoryDetails?.description || ""}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid  */}
            <div className="container container-po ">
              <div className="input-content ">
                <div className="title-text w-100 ">
                  <h5>Offer Details</h5>
                </div>
                <div className="row row-container w-100 ">
                  {/* <div className="row  row-gap"> */}
                  <div className="col-md-6 col-sm-12">
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

                  <div className="col-md-6 col-sm-12">
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

                  <div className="col-md-6 col-sm-12">
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

                  <div className="col-md-6 col-sm-12">
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
                  <div className="col-md-6 col-sm-12">
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
                  <div className="col-md-6 col-sm-12">
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

                  <div className="col-md-6 col-sm-12">
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

                  <div className="col-md-6 col-sm-12">
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

                  <div className="col-md-6 col-sm-12">
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

                  <div className="col-md-6 col-sm-12">
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

                  <div className="col-md-6 col-sm-12">
                    <div className="grid-gap-col">
                      <div className="form-group">
                        <label>Delivery Terms</label>
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

                  <div className="col-md-6 col-sm-12">
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

                  <div className="col-md-6 col-sm-12">
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
                              <div className="col-md-6 col-sm-12">
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
                {/* </div> */}

                <div className="action row">
                  <div className="col-12">
                    <button
                      className="action-btn btn-1 w-100 submitButton"
                      onClick={() => {
                        handleButtonClick(
                          `purchasingOrder?sourcingOfferId=${factoryOffersId}&factoryId=${factoryId}&factoryName=${factoryName}${
                            productId !== null ? `&productId=${productId}` : ""
                          }&productName=${PosData?.productName}`,
                          "ToPurchasingOrder"
                        );
                      }}
                      // onClick={() => {
                      //   navigate(
                      //     `/purchasingOrder?sourcingOfferId=${factoryOffersId}&factoryId=${factoryId}&factoryName=${factoryName}${
                      //       productId !== null ? `&productId=${productId}` : ""
                      //     }&productName=${PosData?.productName}`
                      //   );
                      // }}
                    >
                      Send PO
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

export default SourcingOfferExtraDetails;
