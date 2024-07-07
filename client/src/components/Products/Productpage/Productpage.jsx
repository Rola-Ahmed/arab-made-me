import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { baseUrl_IMG } from "config.js";

import Header from "components/main/Header/Header";
import "./product.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Products from "components/Home/Products/Products";
import { handleImageError } from "utils/ImgNotFound";
import StarRating from "components/Shared/stars";
import { userDetails } from "Context/userType";
import { UserToken } from "Context/userToken";
import { BtnDescription } from "constants/BtnDescription";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
// action btns
import HandleUsersBtnAccess, {
  handleIsLoggedInBtn,
} from "utils/actionBtns/HandleUsersBtnAccess"; // handleIsLoggedInBtn,

import Carousel from "react-grid-carousel";

function Productpage(props) {
  let {
    productData,
    modalShow,
    setisLoggedReDirect,
    setModalShow,
    isLoggedReDirect,
  } = props;
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();

  let [sliceDots, setSliceDots] = useState({ start: 0, end: 4 });
  let [currentSliderIndex, setCurrentSliderIndex] = useState(2);
  const [description, setDescription] = useState("");

  // slider configrations
  const sliderRef = useRef(null);
  const settings = {
    dots: false,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
  };

  const next = (index) => {
    sliderRef.current.slickGoTo(index);
    setCurrentSliderIndex(index);
  };
  // used for slider  inorder to highlit and update the current slider btn next
  function getMiddleItemsNext() {
    const array = Array.from(
      { length: productData?.productSlider?.length },
      (_, index) => index + 0
    );

    let middleItems = array.slice(sliceDots.start + 4, sliceDots.end + 4);
    const middleIndex = Math.floor(middleItems.length / 2);

    setSliceDots({ start: sliceDots.start + 4, end: sliceDots.end + 4 });

    sliderRef.current.slickGoTo(middleItems[middleIndex]);
    setCurrentSliderIndex(middleItems[middleIndex]);
  }

  // used for slider  inorder to highlit and update the current slider btn prev

  function getMiddleItemsPrev() {
    const array = Array.from(
      { length: productData?.productSlider?.length },
      (_, index) => index + 0
    );

    let middleItems = array.slice(sliceDots.start - 4, sliceDots.end - 4);
    const middleIndex = Math.floor(middleItems.length / 2);

    setSliceDots({ start: sliceDots.start - 4, end: sliceDots.end - 4 });

    sliderRef.current.slickGoTo(middleItems[middleIndex]);
    setCurrentSliderIndex(middleItems[middleIndex]);
  }

  // -------------------------------btn actions--------------------------------

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

      <Header title="Product Page "  />
      <section className="product-page-section1">
        <div className="container">
          <div className="row product-parent">
            <div className="col-lg-5 product-images">
              <Slider ref={sliderRef} {...settings}>
                {productData?.productSlider?.map((item, index) => (
                  <div className="product-slide-img">
                    <img
                      src={`${baseUrl_IMG}/${item}`}
                      alt="Img"
                      // style={{ height:"20px" }}
                      onError={handleImageError}
                    />
                    {/* {index} */}
                  </div>
                ))}
              </Slider>

              <div style={{ width: "35vw" }}>
                <Carousel
                  cols={4}
                  rows={1}
                  gap={10}
                  // loop
                  scrollSnap={true}
                  // hideArrow={false}
                  // className={`d-grid`}
                  // style={{ width: "88vw" }}
                  arrowLeft={
                    <div
                      className="arrow-btn   "
                      onClick={() => getMiddleItemsPrev()}
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </div>
                  }
                  arrowRight={
                    <div
                      className="arrow-btn "
                      onClick={() => getMiddleItemsNext()}
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </div>
                  }
                >
                  {productData?.productSlider?.map((item, index) => (
                    <Carousel.Item>
                      <div
                        className={`dots-slider-img ${
                          currentSliderIndex === index ? "active-dot" : " "
                        }`}
                      >
                        <img
                          className="w-100 h-100 "
                          onClick={() => next(index)}
                          id={index}
                          src={`${baseUrl_IMG}/${item}`}
                          alt="Img"
                          onError={handleImageError}
                        />
                      </div>
                      {/* {index} */}
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </div>
            <div className="col-lg-4 parent2  text-truncate">
              <div className=" ">
                <div className="rating">
                  <div className="stars">
                    {productData?.productAverageRate ? (
                      <StarRating
                        averageRating={productData?.productAverageRate}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="text-product-1">
                    {productData?.averageRate ?? 0} Rating
                  </div>
                </div>
                <div className="">
                  <p className="text-product-2 text-truncate">
                    {/* product name */}
                    {productData?.name}
                  </p>
                </div>
              </div>
              <div className="sku w-100">
                <div className="avail">
                  <p className="skkkkku">
                    Sku:<span>{productData?.sku}</span>
                  </p>
                  <p className="skkkkku paddig-ava">
                    Availability:
                    <span className="stock">
                      {productData?.available ? "In Stock" : "Out of Stock"}
                    </span>
                  </p>
                </div>
                <div className="material  w-100">
                  {productData?.specialCharacteristics &&
                    Object.entries(productData?.specialCharacteristics).map(
                      ([key, value], index) => (
                        <div className="row  w-100">
                          <div className="col-4">
                            <p className="skkkkku">
                              {key}: <span>{value}</span>
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
                    <p className="text-product-3">
                      {productData?.factory?.name}
                    </p>
                    <p className="text-product-4">
                      {/* city, country */}

                      {`${productData?.city ? productData?.city + ", " : ""}`}
                      {productData?.country ?? ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pricing">
                <div>
                  <p className="text-product-5">${productData?.price} </p>
                </div>

                {productData?.discount ? (
                  <div className="sale">{productData?.discount} OFF</div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-lg-2   h-100">
              <div className="parent-buttons-container d-table-cell ">
                <div className="d-flex align-items-center">
                  <div
                    className="text-container"
                    onClick={() => {
                      handleUserClickValidation1(
                        `privatelabel?factoryId=${productData?.factoryId}&factoryName=${productData?.factory?.name}&productId=${productData?.id}&productName=${productData?.name} `
                      );
                    }}
                  >
                    <p className="cursor"> Private Label Request</p>
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={BtnDescription.privateLabelRequest}
                    onClick={() => {
                      setDescription(BtnDescription.privateLabelRequest);
                    }}
                  ></button>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="text-container"
                    onClick={() => {
                      handleUserClickValidation1(
                        `CustomerProductReq?factoryId=${productData?.factoryId}&factoryName=${productData?.factory?.name}&productId=${productData?.id}&productName=${productData?.name} `
                      );
                    }}
                  >
                    <p className="cursor">Custom Product Request</p>
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={BtnDescription.customProductRequest}
                    onClick={() => {
                      setDescription(BtnDescription.customProductRequest);
                    }}
                  ></button>
                </div>

                <div className="d-flex align-items-center">
                  <div
                    className="text-container"
                    onClick={() => {
                      handleUserClickValidation1(
                        `whiteLabelings/form?factoryId=${productData?.factoryId}&factoryName=${productData?.factory?.name}&productId=${productData?.id}&productName=${productData?.name} `
                      );
                    }}
                  >
                    <p className="cursor"> White Label Request</p>
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={BtnDescription.whiteLabelRequest}
                    onClick={() => {
                      setDescription(BtnDescription.whiteLabelRequest);
                    }}
                  ></button>
                </div>

                <div className="d-flex align-items-center">
                  <div
                    className="text-container"
                    onClick={() => {
                      handleUserClickValidation1(
                        `sendrfq?factoryId=${productData?.factoryId}&factoryName=${productData?.factory?.name}&productId=${productData?.id}&productName=${productData?.name} `
                      );
                    }}
                  >
                    <p className="cursor">Send RFQ</p>
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={BtnDescription.RFQ}
                    onClick={() => {
                      setDescription(BtnDescription.RFQ);
                    }}
                  ></button>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="text-container"
                    onClick={() => {
                      handleUserClickValidation1(
                        `purchasingOrder/fromSelectedProduct?factoryId=${productData?.factoryId}&factoryName=${productData?.factory?.name}&productId=${productData?.id}&productName=${productData?.name} `
                      );
                    }}
                  >
                    <p className="cursor">Send PO</p>
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={BtnDescription.PO}
                    onClick={() => {
                      setDescription(BtnDescription.PO);
                    }}
                  ></button>
                </div>

                <div className="d-flex align-items-center">
                  <div
                    className="text-container cursor"
                    onClick={() => {
                      handleUserClickValidLogin(
                        `contactsupplier?userId=${productData?.factory?.userId}&factoryName${productData?.factory?.name}`
                      );
                    }}
                  >
                    <p className="cursor">Contact Supplier</p>
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={BtnDescription.contactSupplier}
                    onClick={() => {
                      setDescription(BtnDescription.contactSupplier);
                    }}
                  ></button>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="text-container"
                    onClick={() => {
                      handleUserClickValidation1(
                        `requestVisit?factoryId=${productData?.factoryId}&factoryName=${productData?.factory?.name}&productId=${productData?.id}&productName=${productData?.name} `
                      );
                    }}
                  >
                    <p className="cursor">Factory Visit Request</p>
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0 ms-1"
                    title={BtnDescription.factoryVisitRequest}
                    onClick={() => {
                      setDescription(BtnDescription.factoryVisitRequest);
                    }}
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="de">
        <div className="container">
          <div className="details">
            <div>
              <h3>Specification</h3>
              <div className="instant-nav">
                <p className="main-details">Description</p>
                <p>{productData?.description}</p>
              </div>
            </div>

            <hr />

            <div>
              <h3>Seller Profile</h3>
              <div className="instant-nav">
                <p className="main-details">Description</p>
                <p>{productData?.factory?.description}</p>
              </div>
            </div>
            <hr />

            <div>
              <h3>Review</h3>
              <div className="instant-nav">
                <p className="main-details">Description</p>
                <p>{/* No reviews */}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Products title={"Related Products"} />
    </>
  );
}

export default Productpage;
