import React, { useEffect, useState, useContext, useRef } from "react";
import "./TopFactories.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";
import CustomSlider from "react-slick";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HandleUsersBtnAccess, {
  handleIsLoggedInBtn,
} from "utils/actionBtns/HandleUsersBtnAccess";

import Carousel from "react-grid-carousel";
import { Link, useNavigate } from "react-router-dom";
import { UserToken } from "Context/userToken";
// modals
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerifiedModal/ImporterUnVerifiedModal";
import UserNotAuthorized from "components/ActionMessages/UserNotAuthorized/UserNotAuthorized";
import DescritionPopUp from "components/Helpers/DescritionPopUp";

import { userDetails } from "Context/userType";

import { handleImageError } from "utils/ImgNotFound";
// static variabls
import { BtnDescription } from "constants/BtnDescription";
import DropdownActionBtnsFactory from "components/Shared/DropdownActionBtns/FactoryBtns/DropdownActionBtnsFactory";

export default function TopFactories() {
  const [allFactoriesData, setAllFactoriesData] = useState([]);

  const sliderRef = useRef();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  const numOfFactoriesFetch = 50;
  // const numOfFactoriesFetch = 2;

  let navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );

  // action verification
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");
  let [factoryHasProduct, setFactoryHasProduct] = useState({
    status: false,
    location: "",
  });

  async function fetchFactoriesData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories?size=${numOfFactoriesFetch}`,
      };

      const response = await axios.request(config);
      setAllFactoriesData(
        response.data.factories.filter((item) => item?.factoryId !== null)
      );
      const uniqueIds = [
        ...new Set(
          response.data.factories
            .map((obj) => obj.id) // Extract all factoryIds
            .filter((id) => id !== null) // Filter out null values
        ),
      ];

      setUniqueFactoryIDofProducts(uniqueIds);
    } catch (error) {}
  }
  const getFactoryProduct = async (factoryId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/factories/products/${factoryId}?size=100`
      );

      let productCoverImg = [];
      let productName = [];
      let productId = [];

      response.data.products.map((item) => {
        if (item.coverImage !== null) {
          productCoverImg.push(item.coverImage);
        }
        productName.push(item.name);
        productId.push(item.id);
      });

      setAllFactoriesData((prevData) =>
        prevData.map((item) =>
          item?.id === factoryId
            ? {
                ...item,
                productCoverImg: productCoverImg,
                productName: productName,
                productId: productId,
                productLength: response.data.products?.length,
              }
            : item
        )
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchFactoriesData();
  }, []);

  useEffect(() => {
    if (uniqueFactoryIDofProducts !== null) {
      uniqueFactoryIDofProducts?.map((factoryId) => (
        <>{getFactoryProduct(factoryId)}</>
      ));
    }
  }, [uniqueFactoryIDofProducts]);

  // slider setting
  const settings = {
    dots: true,
    fade: true,
    arrows: false,
    appendDots: (dots) => (
      <div
        style={{
          height: "1rem",
          bottom: "1.5rem",
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          top: "10rem",
          zIndex: 1,
        }}
      >
        {dots}
      </div>
    ),

    focusOnSelect: true,
  };
  const settingsMain = {
    // dots: false,
    // fade: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1398,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },

      {
        breakpoint: 989,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 539,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  function DirectToFactoryPage(factoryId, factoryName) {
    navigate(`/factoryPage/${factoryId}-${factoryName}`);
  }

  const handleBtnCheckIfProductExisit = (
    loginPath,
    productLength,
    id,
    name
  ) => {
    if (productLength == 0) {
      setFactoryHasProduct({
        status: true,
        location: `factoryId=${id}&factoryName=${name}`,
      });
      return;
    }
    handleUserClickValidation1(loginPath);
  };
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

  const handleQuestionMarkClick = (desc) => {
    setDescription(desc);
    setModalShow((prevVal) => ({
      ...prevVal,
      displayDescr: true,
    }));
  };

  return (
    <>
      <section className="top-factories margin-sm-screen ">
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

        <div className="container topFactory  ">
          <div className="header-size d-flex justify-content-between align-content-end">
            <div>
              <h2 className="header-Title"> Factories</h2>
              <p className="sub-Title">
                Everything you need to know about the product and billing.
              </p>
            </div>
            <div className="d-flex arrow-container">
              <div
                className={`arrow-btn   `}
                onClick={() => sliderRef.current.slickPrev()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M11.625 14.25L6.375 9L11.625 3.75"
                    stroke="#131313"
                    stroke-width="1.875"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {/* </button> */}
              </div>

              <div
                // disabled
                className={`arrow-btn  `}
                onClick={() => sliderRef.current.slickNext()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M6.375 3.75L11.625 9L6.375 14.25"
                    stroke="#131313"
                    stroke-width="1.875"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="factoryCard  container m-0 p-0 overflow-hidden ">
            <Slider {...settingsMain} ref={sliderRef}>
              {allFactoriesData.map((factoryitem, factoryindex) => (
                // <div className="col-sm-12 col-xl-4 col-xxl-3  col-lg-4  col-md-6 m-0  px-1">
                <div className="card " key={factoryindex}>
                  {factoryitem?.images?.length > 0 ? (
                    <Link
                      className="cursor"
                      to={`/factoryPage/${factoryitem.id}-${factoryitem.name}`}
                    >
                      <CustomSlider {...settings}>
                        {factoryitem?.images?.map((item, index) => (
                          <img
                            src={`${baseUrl_IMG}/${item}`}
                            className="sliderImg"
                            alt={`slide ${item} `}
                            onError={handleImageError}
                          />
                        ))}
                      </CustomSlider>
                    </Link>
                  ) : (
                    <Link
                      className="cursor"
                      to={`/factoryPage/${factoryitem.id}-${factoryitem.name}`}
                    >
                      <img
                        src={`handleImageError`}
                        className="sliderImg w-100"
                        alt={`no image slider`}
                        onError={handleImageError}
                      />
                    </Link>
                  )}

                  <div className="card-body cardBody">
                    <div className="subCard">
                      <div
                        className="card-title d-flex w-100 cursor"
                        onClick={() =>
                          DirectToFactoryPage(
                            factoryitem?.id,
                            factoryitem?.name
                          )
                        }
                      >
                        <div className="imgLogo">
                          <img
                            className={`m-0 p-0 w-100 h-100 borderContainer`}
                            src={`${baseUrl_IMG}/${factoryitem?.coverImage}`}
                            alt={`slide ${factoryindex} `}
                            onError={handleImageError}
                          />
                        </div>
                        <div className="title fac">
                          <h2 className=" fac-title text-truncate">
                            {factoryitem?.name}
                          </h2>
                          <p>
                            {/* city, country */}

                            {`${
                              factoryitem?.city ? factoryitem?.city + ", " : ""
                            }`}
                            {factoryitem?.country ?? ""}
                          </p>
                        </div>
                      </div>
                      <div
                        className="subText w-100 cursor"
                        onClick={() =>
                          DirectToFactoryPage(
                            factoryitem?.id,
                            factoryitem?.name
                          )
                        }
                      >
                        <div>
                          <p className="text-expand">
                            Export History:
                            <span>
                              {factoryitem?.importingCountries?.length > 0
                                ? factoryitem?.importingCountries?.map(
                                    (item) => ` ${item} ,`
                                  )
                                : " All"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="profile-img w-100  ">
                        {factoryitem?.productCoverImg?.length > 0 && (
                          <Carousel
                            cols={5}
                            rows={1}
                            // gap={0}
                            // scrollSnap={true}
                            loop
                            showDots
                            autoPlay={5000}
                            scrollSnap={true}
                            stopOnHover={true}
                            // dotColorActive={'yellow'}
                            // dotColorInactive={'gray'}
                            // showThumbs={true}
                            // thumbWidth={20}
                            interval={3000}
                            arrowLeft={
                              <div className="arrow-btn-2 arrowL position-absolute  ">
                                <i className="fa-solid fa-chevron-left"></i>
                              </div>
                            }
                            arrowRight={
                              <div className="arrow-btn-2 arrowR position-absolute  ">
                                <i className="fa-solid fa-chevron-right"></i>
                              </div>
                            }
                            responsiveLayout={[
                              {
                                breakpoint: 1398,
                                cols: 5,
                              },
                              {
                                breakpoint: 767,
                                cols: 9,
                                gap: 10,
                              },

                              {
                                breakpoint: 539,
                                cols: 7,
                              },
                              {
                                breakpoint: 426,
                                cols: 5,
                                gap: 10,
                              },
                              {
                                breakpoint: 376,
                                cols: 4,
                                gap: 10,
                              },
                            ]}
                            mobileBreakpoint={300}
                          >
                            {factoryitem?.productCoverImg?.map(
                              (item, index) => (
                                <Carousel.Item>
                                  <div
                                    className="subProfileCont cursor"
                                    onClick={() => {
                                      localStorage.setItem(
                                        "ToProductPage",
                                        true
                                      );
                                      navigate(
                                        `/productPage/${factoryitem?.productId?.[0]}-${factoryitem?.productName?.[0]}`
                                      );
                                    }}
                                  >
                                    <img
                                      src={`${baseUrl_IMG}/${item}`}
                                      className="w-100 h-100"
                                      alt={`slide ${item} `}
                                      onError={handleImageError}
                                    />
                                  </div>
                                </Carousel.Item>
                              )
                            )}
                          </Carousel>
                        )}
                      </div>

                      <div
                        className="subText w-100 cursor"
                        onClick={() =>
                          DirectToFactoryPage(
                            factoryitem?.id,
                            factoryitem?.name
                          )
                        }
                      >
                        <div className="text-truncate">
                          <p className="text-truncate">
                            products:{" "}
                            <span>
                              {factoryitem?.productName?.length > 0
                                ? factoryitem?.productName?.map(
                                    (item) => ` ${item} ,`
                                  )
                                : " none"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center   w-100">
                        <div className="call-btns d-flex justify-content-between  align-items-center w-100  pe-2">
                          {currentUserData?.datacompletelyLoaded ? (
                            <button className="btn-call-1  cursor px-5 ">
                              <div className="btn-text text-decoration-none cursor text-white">
                                <i className="fas fa-spinner fa-spin text-white"></i>
                              </div>
                            </button>
                          ) : (
                            <button
                              className="btn-call-1  cursor "
                              onClick={() => {
                                handleUserClickValidation1(
                                  `privatelabel?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name} `
                                );

                                // return
                              }}
                            >
                              <div className="btn-text text-decoration-none cursor text-white">
                                Private Label Request
                              </div>
                            </button>
                          )}

                          {currentUserData?.datacompletelyLoaded ? (
                            <button className="btn-call-2  cursor px-5 bg-white ">
                              <div className="btn-text text-decoration-none cursor ">
                                <i className="fas fa-spinner fa-spin text-dark"></i>
                              </div>
                            </button>
                          ) : (
                            <div
                              className=" btn-call-2 padd text-dark text-decoration-none cursor"
                              onClick={() => {
                                handleUserClickValidLogin(
                                  `contactsupplier?userId=${factoryitem?.userId}&factoryName=${factoryitem?.name}`
                                );
                              }}
                            >
                              <i
                                class="fa-regular fa-comments fa-2x"
                                style={{ fontSize: "1.5rem" }}
                              ></i>
                            </div>
                          )}
                        </div>

                        <div className=" text-dark text-decoration-none cursor d-none ">
                          {currentUserData?.datacompletelyLoaded ? (
                            <i className=" fas fa-spinner fa-spin text-dark"></i>
                          ) : (
                            <i class=" ellipsis  fa-solid fa-ellipsis-vertical "></i>
                          )}

                          <ul
                            id={factoryitem?.id}
                            className="dropdown-menu-top  
                                p-3 m-2"
                          >
                            <div className="parent-buttons-container cursor">
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="text-container "
                                  onClick={() => {
                                    handleUserClickValidation1(
                                      `CustomerProductReq?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`
                                    );
                                  }}
                                >
                                  <p className="cursor">
                                    Custom Product Request
                                  </p>
                                </div>

                                <button
                                  className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                                  title={BtnDescription.customProductRequest}
                                  onClick={() => {
                                    handleQuestionMarkClick(
                                      BtnDescription.customProductRequest
                                    );
                                  }}
                                ></button>
                              </div>

                              <div className="d-flex align-items-center gap-2">
                                <button
                                  className={`text-container  `}
                                  onClick={() => {
                                    handleBtnCheckIfProductExisit(
                                      `sendrfq?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`,
                                      factoryitem?.productLength,
                                      factoryitem?.id,
                                      factoryitem?.name
                                    );
                                  }}
                                >
                                  <p className={`cursor`}>Send RFQ</p>
                                </button>

                                <button
                                  className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                                  title={BtnDescription.RFQ}
                                  onClick={() => {
                                    handleQuestionMarkClick(BtnDescription.RFQ);
                                  }}
                                ></button>
                              </div>

                              <div className="d-flex align-items-center gap-2">
                                <button
                                  className={`text-container `}
                                  onClick={() => {
                                    handleBtnCheckIfProductExisit(
                                      `purchasingOrder?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`,
                                      factoryitem?.productLength,
                                      factoryitem?.id,
                                      factoryitem?.name
                                    );
                                  }}
                                >
                                  <p className="cursor">Send PO</p>
                                </button>
                                <button
                                  className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                                  title={BtnDescription.PO}
                                  onClick={() => {
                                    handleQuestionMarkClick(BtnDescription.PO);
                                  }}
                                ></button>
                              </div>

                              <div className="d-flex align-items-center gap-2">
                                <button
                                  className="text-container "
                                  onClick={() => {
                                    handleUserClickValidLogin(
                                      `contactsupplier?userId=${factoryitem?.userId}&factoryName=${factoryitem?.name}`
                                    );
                                  }}
                                >
                                  <p className="cursor">Contact Supplier</p>
                                </button>
                                <button
                                  className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                                  title={BtnDescription.contactSupplier}
                                  onClick={() => {
                                    handleQuestionMarkClick(
                                      BtnDescription.contactSupplier
                                    );
                                  }}
                                ></button>
                              </div>

                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="text-container "
                                  onClick={() => {
                                    handleUserClickValidation1(
                                      `requestVisit?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`
                                    );
                                  }}
                                >
                                  <p className="cursor">
                                    Factory Visit Request
                                  </p>
                                </div>
                                <button
                                  className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                                  title={BtnDescription.factoryVisitRequest}
                                  onClick={() => {
                                    handleQuestionMarkClick(
                                      BtnDescription.factoryVisitRequest
                                    );
                                  }}
                                ></button>
                              </div>
                            </div>
                          </ul>
                          {/*  */}
                        </div>
                        {/* pop up btn */}
                        <DropdownActionBtnsFactory
                          currentUserData={currentUserData}
                          factoryitem={factoryitem}
                          BtnDescription={BtnDescription}
                          // handleButtonClick={handleButtonClick}
                          handleBtnCheckIfProductExisit={
                            handleBtnCheckIfProductExisit
                          }
                          handleUserClickValidation1={
                            handleUserClickValidation1
                          }
                          handleQuestionMarkClick={handleQuestionMarkClick}
                          handleUserClickValidLogin={handleUserClickValidLogin}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                // {/* </div> */}
              ))}
            </Slider>
          </div>

          <div className="btn-container-all cursor">
            <div
              onClick={() => {
                navigate("/factoryGallery");
              }}
              className="get-all-btn text-decoration-none text-white"
            >
              All Factories
            </div>
          </div>
        </div>
      </section>
      <Modal
        show={factoryHasProduct.status}
        onHide={() =>
          setFactoryHasProduct({
            status: false,
            location: ``,
          })
        }
        size="md"
        aria-labelledby="example-custom-modal-styling-title"
        centered
        className="factory-profile"
        dialogClassName="modal-90w"
      >
        <Modal.Body closeButton>
          <Modal.Header closeButton>
            <Modal.Title>Factory Has No Products</Modal.Title>
          </Modal.Header>
          <div className="w-100 ">
            {" "}
            <div className="row  row-gap">
              {" "}
              <div className="form-group">
                <label className="w-100 ">
                  {" "}
                  There are no products available from this factory at the
                  moment. However, you can send a private label or custom
                  product request
                </label>
              </div>
              <div className="col-12 d-flex justify-content-start btn-modal-gap">
                {" "}
                <Button
                  className="btn-edit "
                  onClick={() => {
                    handleUserClickValidation1(
                      `CustomerProductReq?${factoryHasProduct.location}&productName=CreateYourOwnBrand `
                    );

                    // return
                  }}
                >
                  <p className="cursor "> Custom Product Request</p>
                </Button>
                <button
                  className="btn-edit border bg-white "
                  onClick={() => {
                    handleUserClickValidation1(
                      `privatelabel?${factoryHasProduct.location}`
                    );

                    // return
                  }}
                >
                  <p className="cursor text-dark"> Private Label Request</p>
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {modalShow.displayDescr && (
        <DescritionPopUp
          show={modalShow.displayDescr}
          description={description}
          onClose={() => {
            setModalShow((prevVal) => ({
              ...prevVal,
              displayDescr: false,
            }));
          }}
        />
      )}
    </>
  );
}
