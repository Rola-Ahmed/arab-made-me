import { useState, useContext } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { useNavigate } from "react-router-dom";

import { baseUrl_IMG, useAppTranslation } from "config.js";

import Header from "components/main/Header/Header";
import "./product.css";

import Products from "components/Home/Products/Products";
import { handleImageError } from "utils/ImgNotFound";
import StarRating from "components/Shared/stars";
import { userDetails } from "Context/userType";
import { UserToken } from "Context/userToken";
// import { BtnDescription } from "constants/BtnDescription";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
// action btns
import HandleUsersBtnAccess, {
  handleIsLoggedInBtn,
} from "utils/actionBtns/HandleUsersBtnAccess"; // handleIsLoggedInBtn,
import DescritionPopUp from "components/Helpers/DescritionPopUp";
import DefaultUserNotAuthorizedModal from "components/ActionMessages/FormAccessControl/DefaultUserNotAuthorizedModal";

function Productpage(props) {
  let {
    productData,
    modalShow,
    setisLoggedReDirect,
    setModalShow,
    isLoggedReDirect,
  } = props;

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();
  const { trans: t } = useAppTranslation();

  const [description, setDescription] = useState("");

  // slider configrations

  const handleUserClickValidation1 = (loginPath) => {
    HandleUsersBtnAccess({
      currentUserData,
      isLogin,
      navigate,
      setModalShow,
      setisLoggedReDirect,
      loginPath,
    });
  };

  const handleUserClickValidLogin = (loginPath) => {
    handleIsLoggedInBtn({
      isLogin,
      navigate,
      setModalShow,
      setisLoggedReDirect,
      loginPath,
    });
  };

  // ---------------------------------------------------------------

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
      <DefaultUserNotAuthorizedModal
        show={modalShow.isDefaultUserNotAllowed}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isDefaultUserNotAllowed: false,
          }))
        }
        goToPath="userType"
      />

      <Header title="Product Page " />
      <section className="product-page-section1  home-padding-y">
        <div className="container">
          <div className="row product-parent">
            <div className="col-lg-5 product-images">
              <Swiper
                navigation={{
                  nextEl: ".main-slider-next",
                  prevEl: ".main-slider-prev ",
                }}
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="main-Swiper w-100 "
              >
                {productData?.productSlider?.map((item, index) => (
                  <SwiperSlide>
                    <img
                      src={`${baseUrl_IMG}/${item}`}
                      alt="Img"
                      onError={handleImageError}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="sub-swiper cursor position-relative"
              >
                {productData?.productSlider?.map((item, index) => (
                  <SwiperSlide>
                    <img
                      className="w-100 h-100 "
                      id={index}
                      src={`${baseUrl_IMG}/${item}`}
                      alt="Img"
                      onError={handleImageError}
                    />
                  </SwiperSlide>
                ))}

                <i className="fa-solid fa-chevron-left main-slider-prev rounded-4"></i>
                <i className="fa-solid fa-chevron-right main-slider-next  rounded-4"></i>
              </Swiper>
            </div>
            <div className="col-lg-4 parent2  text-truncate">
              <div className=" ">
                <div className="rating">
                  <div className="stars">
                    {productData?.productAverageRate && (
                      <StarRating
                        averageRating={productData?.productAverageRate}
                      />
                    )}
                  </div>

                  <div className="fs-14-med lh-normal fw-600">
                    {productData?.averageRate ?? 0} Rating
                  </div>
                </div>
                <div className="">
                  <p className="fs-20-semi text-truncate">
                    {/* product name */}
                    {productData?.name}
                  </p>
                </div>
              </div>
              <div className="sku w-100">
                <div className="avail">
                 
                  <p className="fw-400 fs-14-med text-muted-2 paddig-ava">
                    Availability:
                    <span
                      className={`fw-600 ${
                        productData?.available ? "text-success" : "text-danger"
                      }`}
                    >
                      {productData?.available ? "In Stock" : "Out of Stock"}
                    </span>
                  </p>
                </div>
                <div className="material  w-100">
                  {productData?.specialCharacteristics &&
                    Object.entries(productData?.specialCharacteristics)?.map(
                      ([key, value], index) => (
                        <div className="row  w-100">
                          <div className="col-4">
                            <p className="fw-400 fs-14-med text-muted-2">
                              {key}:{" "}
                              <span className="fw-600 text-black">{value}</span>
                            </p>
                          </div>
                        </div>
                      )
                    )}
                </div>
              </div>

              <div className="log">
                <div className="ar">
                  <div className="factory-logo">
                    <img
                      className="w-100 h-100 "
                      src={`${baseUrl_IMG}/${productData?.factory?.coverImage}`}
                      alt="factory"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="ar-texts">
                    <p className="fs-18-semi lh-normal">
                      {productData?.factory?.name}
                    </p>
                    <p className="fs-14-med fw-400 lh-normal">
                      {/* city, country */}

                      {`${productData?.city ? productData?.city + ", " : ""}`}
                      {productData?.country ?? ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pricing ">
                <div>
                  <p className=" fs-24-semi text-main-2 fw-600 ">
                    ${productData?.price}{" "}
                  </p>
                </div>

                {productData?.discount && (
                  <p className="  fw-600 lh-normal fs-14-semi">
                    {productData?.discount} OFF
                  </p>
                )}
              </div>
            </div>
            <div className="col-lg-2   h-100">
              <div className=" d-table-cell  ">
                <div className={"d-flex align-items-center"}>
                  <div
                    className="text-container  text-white fw-600 fs-15"
                    onClick={() => {
                      handleUserClickValidation1(
                        `privatelabel?factoryId=${productData?.factoryId}&factoryName=${productData?.factory?.name}&productId=${productData?.id}&productName=${productData?.name} `
                      );
                    }}
                  >
                    {t("BtnsDescription:privateLabelRequest.name")}
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={t("BtnsDescription:privateLabelRequest.description")}
                    onClick={() => {
                      setDescription(
                        t("BtnsDescription:privateLabelRequest.description")
                      );
                    }}
                  ></button>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="text-container text-white fw-600 fs-15"
                    onClick={() => {
                      handleUserClickValidation1(
                        `CustomerProductReq?factoryId=${productData?.factoryId}&factoryName=${productData?.factory?.name}&productId=${productData?.id}&productName=${productData?.name} `
                      );
                    }}
                  >
                    {t("BtnsDescription:customProductRequest.name")}
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={t(
                      "BtnsDescription:customProductRequest.description"
                    )}
                    onClick={() => {
                      setDescription(
                        t("BtnsDescription:customProductRequest.description")
                      );
                    }}
                  ></button>
                </div>

                <div className="d-flex align-items-center">
                  <div
                    className="text-container text-white fw-600 fs-15"
                    onClick={() => {
                      handleUserClickValidation1(
                        `whiteLabelings/form?factoryId=${productData?.factoryId}&factoryName=${productData?.factory?.name}&productId=${productData?.id}&productName=${productData?.name} `
                      );
                    }}
                  >
                    {t("BtnsDescription:whiteLabelRequest.name")}
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={t("BtnsDescription:whiteLabelRequest.description")}
                    onClick={() => {
                      setDescription(
                        t("BtnsDescription:whiteLabelRequest.description")
                      );
                    }}
                  ></button>
                </div>

                <div className="d-flex align-items-center">
                  <div
                    className="text-container text-white fw-600 fs-15"
                    onClick={() => {
                      handleUserClickValidation1(
                        `sendrfq?factoryId=${productData?.factoryId}&factoryName=${productData?.factory?.name}&productId=${productData?.id}&productName=${productData?.name} `
                      );
                    }}
                  >
                    {t("BtnsDescription:RFQ.sendRfq")}
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={t("BtnsDescription:RFQ.description")}
                    onClick={() => {
                      setDescription(t("BtnsDescription:RFQ.description"));
                    }}
                  ></button>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="text-container text-white fw-600 fs-15"
                    onClick={() => {
                      handleUserClickValidation1(
                        `purchasingOrder/fromSelectedProduct?factoryId=${productData?.factoryId}&factoryName=${productData?.factory?.name}&productId=${productData?.id}&productName=${productData?.name} `
                      );
                    }}
                  >
                    {t("BtnsDescription:PO.sendPo")}
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={t("BtnsDescription:PO.description")}
                    onClick={() => {
                      setDescription(t("BtnsDescription:PO.description"));
                    }}
                  ></button>
                </div>

                <div className="d-flex align-items-center">
                  <div
                    className="text-container text-white fw-600 fs-15 cursor"
                    onClick={() => {
                      handleUserClickValidLogin(
                        `contactsupplier?userId=${productData?.factory?.userId}&factoryName${productData?.factory?.name}`
                      );
                    }}
                  >
                    {t("BtnsDescription:contactSupplier.name")}
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={t("BtnsDescription:contactSupplier.description")}
                    onClick={() => {
                      setDescription(
                        t("BtnsDescription:contactSupplier.description")
                      );
                    }}
                  ></button>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="text-container text-white fw-600 fs-15"
                    onClick={() => {
                      handleUserClickValidation1(
                        `requestVisit?factoryId=${productData?.factoryId}&factoryName=${productData?.factory?.name}&productId=${productData?.id}&productName=${productData?.name} `
                      );
                    }}
                  >
                    {t("BtnsDescription:factoryVisitRequest.name")}
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={"BtnsDescription:factoryVisitRequest.description"}
                    onClick={() => {
                      setDescription(
                        "BtnsDescription:factoryVisitRequest.description"
                      );
                    }}
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-padding-b">
        <div className="container">
          <div className=" d-flex flex-column gap-32">
            <div>
              <h3>Specification</h3>
              <div className="d-flex flex-column gap-12 w-100  ">
                <p className="text-muted-2 fw-400 fs-14-semi">Description</p>
                <p>{productData?.description}</p>
              </div>
            </div>

            <hr />

            <div>
              <h3>Seller Profile</h3>
              <div className="d-flex flex-column gap-12 w-100">
                <p className="text-muted-2 fw-400 fs-14-semi">Description</p>
                <p>{productData?.factory?.description}</p>
              </div>
            </div>
            <hr />

            <div>
              <h3>Review</h3>
              <div className="d-flex flex-column gap-12 w-100">
                <p className="text-muted-2 fw-400 fs-14-semi">Description</p>
                <p>{/* No reviews */}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Products title={"Related Products"} />
      <DescritionPopUp
        show={description != ""}
        description={description}
        onClose={() => {
          setDescription("");
        }}
      />
    </>
  );
}

export default Productpage;
