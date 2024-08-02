import { useState, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Factorypage.css";
import { BtnDescription } from "constants/BtnDescription";
import { useNavigate, useParams } from "react-router-dom";
import SuccessToast from "components/SuccessToast";
import ErrorToast from "components/ErrorToast";
import { useFetchSectors } from "hooks/useFetchSectors";

import { vid1 } from "constants/Images";
import Carousel from "react-grid-carousel";
import CustomSlider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { handleImageError } from "utils/ImgNotFound";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { Link as LinkScroll } from "react-scroll";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import { countriesMiddleEast } from "constants/countries";
import your_geography_data from "constants/json/features.json";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";

import {
  ComposableMap,
  Annotation,
  Geographies,
  Geography,
} from "react-simple-maps";
import ActionBtnsOnFactory from "./ActionBtnsOnFactory";
import ActionBtnsOnProduct from "./ActionBtnsOnProduct";
import DescritionPopUp from "components/Helpers/DescritionPopUp";
import {
  fetchFactoryProducts2,
  fetchOneFactory,
  getEndorse,
  getFactoryTeam,
} from "Services/factory";

function Factorypage() {
  let { currentUserData } = useContext(userDetails);
  document.title = "Factory Page";
  let { allSectors } = useFetchSectors();

  let { factoryIdName } = useParams();

  const [description, setDescription] = useState("");

  const handleQuestionMarkClick = (desc) => {
    setDescription(desc);
    setModalShow((prevVal) => ({
      ...prevVal,
      displayDescr: true,
    }));
  };

  const handlevedioError = (event) => {
    event.target.src = vid1;
  };

  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);

  const [factoryDetails, setFactoryDetails] = useState({
    totalProducts: 0,
    teamMembers: [],
  });
  const [factoryProduct, setFactoryProduct] = useState([]);
  let [factoryHasProduct, setFactoryHasProduct] = useState(false);

  async function fetchFactoryPage() {
    // const response = await axios.request(config);

    let result = await fetchOneFactory(factoryIdName?.split("-")?.[0]);

    if (result?.success) {
      setFactoryDetails((prevVal) => ({
        ...prevVal,
        ...result?.data?.factories,
      }));

      FactoryTotalProductLen();
    }
  }
  async function EndorseSubmit(e) {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        url: `${baseUrl}/endorsements/add`,
        data: {
          factoryId: factoryDetails?.id,
        },
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        SuccessToast("Endorsement added successfully");
      } else if (response.data.message == "404 Not Found") {
        ErrorToast("Something Went Wrong try again later");
      }
    } catch (error) {
      ErrorToast("Something Went Wrong try again later");
    }
  }

  async function FactoryTotalProductLen() {
    let reuslt = await fetchFactoryProducts2(
      factoryIdName?.split("-")?.[0],
      {}
    );

    if (reuslt?.success) {
      const first25Products = reuslt?.data?.products?.slice(0, 25);
      setFactoryProduct(first25Products);
      setFactoryDetails((prevValues) => ({
        ...prevValues,
        totalProducts: reuslt?.data?.products?.length,
      }));

      fetchTeamData();
    }
  }

  async function fetchTeamData() {
    let result = await getFactoryTeam(factoryIdName?.split("-")?.[0], {});

    if (result?.success) {
      setFactoryDetails((prevValues) => ({
        ...prevValues,
        teamMembers: result?.data?.teamMembers,
      }));
      factoryEndorse();
    }
  }

  async function factoryEndorse() {
    let result = await getEndorse(factoryIdName?.split("-")?.[0], {});

    if (result?.success) {
      setFactoryDetails((prevValues) => ({
        ...prevValues,
        endorsements: result?.data?.endorsements?.length,
      }));
    }
  }

  useEffect(() => {
    if (factoryIdName && factoryIdName?.split("-")?.[0] !== undefined) {
      fetchFactoryPage();
    }
  }, [factoryIdName]);

  const settings = {
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,

    appendDots: (dots) => (
      <div
        style={{
          height: "1rem",
          bottom: "1.5rem",
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          // top: "100px",
          zIndex: 1,
        }}
      >
        {dots}
      </div>
    ),

    focusOnSelect: true,
  };

  const [activeMenu, setActiveMenu] = useState("about");

  const handleSetActive = (to) => {
    if (to == null || to == "") {
      setActiveMenu("about");
    }
    setActiveMenu(to);
  };

  //
  //
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
    displayDescr: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

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

  function handleIsLoggedInBtn(loginPath, storgaeName) {
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

      <section className="fact-sec1 container margin-sm-screen">
        <CustomSlider {...settings}>
          {factoryDetails?.coverVideo?.length > 0 ? (
            <video
              src={`${baseUrl_IMG}/${factoryDetails?.coverVideo}`}
              autoPlay
              muted
              loop
              // controls
              onError={handlevedioError}
              className="HeroSlider"
            ></video>
          ) : (
            <video
              src={vid1}
              autoPlay
              muted
              loop
              // controls
              onError={handlevedioError}
              className="HeroSlider"
            ></video>
          )}

          {factoryDetails?.images?.map((item, index) => (
            <img
              src={`${baseUrl_IMG}/${item}`}
              alt={`img ${index + 1}`}
              onError={handleImageError}
              className="HeroSlider img"
            />
          ))}
        </CustomSlider>
      </section>
      <section className="fact-logo container margin-sm-screen">
        <div className="logo-text">
          <div className="factory-logo-container">
            <img
              src={`${baseUrl_IMG}/${factoryDetails?.coverImage}`}
              alt="Factory Logo"
              onError={handleImageError}
            />
          </div>
          <div>
            <h2 className="text-fac-1">{factoryDetails?.name}</h2>
            <p className="text-fac-2">
              {/* city, country */}
              {`${factoryDetails?.city ? factoryDetails?.city + ", " : ""}`}
              {factoryDetails?.country ?? ""}
            </p>
            <p className="text-fac-3">
              {/* 50 Followers */}
              {factoryDetails?.totalProducts} Products
            </p>
          </div>
        </div>
      </section>

      <section className="det-fact margin-sm-screen">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-md-8  ">
              <div className="call-fac-page scroll">
                <LinkScroll
                  onSetActive={handleSetActive}
                  activeClass={`btn-warning`}
                  spy={true}
                  smooth={true}
                  duration={200}
                  hashSpy={true}
                  // offset={-175}
                  offset={-175}
                  isDynamic={true}
                  to="about"
                >
                  <button
                    className={`btn ${
                      activeMenu === "about" ? "btn-warning" : ""
                    }`}
                  >
                    About
                  </button>
                </LinkScroll>

                <LinkScroll
                  onSetActive={handleSetActive}
                  // activeClass={`btn-warning`}
                  activeClass={activeMenu === "products" ? "btn-warning" : ""}
                  spy={true}
                  smooth={true}
                  duration={200}
                  offset={-147}
                  to="products"
                >
                  <button className="btn">Products</button>
                </LinkScroll>

                {factoryDetails?.qualityCertificates ? (
                  <LinkScroll
                    onSetActive={handleSetActive}
                    activeClass={
                      activeMenu === "certifications" ? "btn-warning" : ""
                    }
                    // activeClass={`btn-warning`}
                    spy={true}
                    smooth={true}
                    duration={500}
                    // offset={-147}
                    // offset={-175}
                    // offset={-145}
                    offset={-146}
                    isDynamic={true}
                    to="certifications"
                  >
                    <button className="btn">Certifications</button>
                  </LinkScroll>
                ) : (
                  <button className=" btn text-muted not-allowed">
                    Certifications
                  </button>
                )}

                {/* {factoryDetails?.team?.length !== 0 ? ( */}
                {factoryDetails?.teamMembers?.length > 0 ? (
                  <LinkScroll
                    onSetActive={handleSetActive}
                    activeClass={`btn-warning`}
                    spy={true}
                    smooth={true}
                    duration={500}
                    hashSpy={true}
                    // offset={-177}
                    offset={-175}
                    isDynamic={true}
                    to="ourPeople"
                  >
                    <button className="btn">Our People</button>
                  </LinkScroll>
                ) : (
                  <button className="btn text-muted not-allowed">
                    Our People
                  </button>
                )}

                {factoryDetails?.importingCountries ? (
                  <LinkScroll
                    onSetActive={handleSetActive}
                    activeClass={`btn-warning`}
                    spy={true}
                    smooth={true}
                    duration={200}
                    hashSpy={true}
                    // offset={-177}
                    // offset={-180}
                    offset={-175}
                    isDynamic={true}
                    to="exportedCountries"
                  >
                    <button className="btn">Exported Countries</button>
                  </LinkScroll>
                ) : (
                  <button className="btn text-muted not-allowed">
                    Exported Countries
                  </button>
                )}

                <LinkScroll
                  onSetActive={handleSetActive}
                  activeClass={`btn-warning`}
                  spy={true}
                  smooth={true}
                  duration={200}
                  hashSpy={true}
                  offset={-177}
                  // offset={-180}
                  isDynamic={true}
                  to="Endorsements"
                >
                  <button className="btn">Endorsements</button>
                </LinkScroll>

                <button
                  onSetActive={handleSetActive}
                  className="btn contact"
                  // to="Endorsements"
                  onClick={() => {
                    handleIsLoggedInBtn(
                      `contactCompany?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`,
                      "ToContact"
                    );
                  }}
                >
                  Contact Supplier
                </button>

                <hr />
              </div>

              <div id="about" className="pehat">
                <h3 className="text-fac-4">About</h3>
                <div className=" row">
                  <div className="col-3 ">
                    <p
                      className=" fw-bolder
                    "
                    >
                      Company Category
                    </p>
                  </div>
                  <div className="col-9 ">
                    <p>
                      {factoryDetails?.sectorId !== null
                        ? allSectors?.find(
                            (item) => item?.id === factoryDetails?.sectorId
                          )?.name
                        : ""}
                    </p>
                  </div>

                  <div className="col-3 ">
                    <p
                      className=" fw-bolder
                    "
                    >
                      Year Established
                    </p>
                  </div>
                  <div className="col-9 ">
                    <p>{factoryDetails?.yearOfEstablishmint}</p>
                  </div>

                  <div className="col-3 ">
                    <p
                      className=" fw-bolder
                    "
                    >
                      Number of Employees
                    </p>
                  </div>
                  <div className="col-9 ">
                    <p
                      className=" fw-bolder
                    "
                    >
                      {factoryDetails?.numberOfEmployees} Employees
                    </p>
                  </div>

                  <div className="col-3 ">
                    <p
                      className=" fw-bolder
                    "
                    >
                      Company Website
                    </p>
                  </div>
                  <div className="col-9 ">
                    <p className="text-break">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`${factoryDetails?.website}`}
                      >
                        {factoryDetails?.website}
                      </a>
                    </p>
                  </div>

                  <div className="col-3 ">
                    <p
                      className=" fw-bolder
                    "
                    >
                      Social Links
                    </p>
                  </div>
                  <div className="col-9 ">
                    <p>
                      <i
                        onClick={() => {
                          window.open(
                            factoryDetails?.socialLinks?.facebook,
                            "_blank"
                          );
                        }}
                        className="fab fa-facebook-f  cursor social-icons me-3 "
                      ></i>
                      <i
                        onClick={() => {
                          window.open(
                            factoryDetails?.socialLinks?.instagram,
                            "_blank"
                          );
                        }}
                        className="fab fa-instagram  cursor social-icons"
                      ></i>
                    </p>
                  </div>

                  <div className="col-3 ">
                    <p
                      className=" fw-bolder
                    "
                    >
                      Company Phone
                    </p>
                  </div>
                  <div className="col-9 ">
                    <p>{factoryDetails?.phone}</p>
                  </div>

                  <div className="col-3 ">
                    <p
                      className=" fw-bolder
                    "
                    >
                      Company Address
                    </p>
                  </div>
                  <div className="col-9 ">
                    <p>{factoryDetails?.address?.[0]}</p>
                  </div>

                  <div className="col-3 ">
                    <p
                      className=" fw-bolder
                    "
                    >
                      Company Description
                    </p>
                  </div>
                  <div className="col-9 ">
                    <p>{factoryDetails?.description}</p>
                  </div>
                </div>
              </div>

              <div id="products" className="fac-cert">
                <h3 className="text-fac-4">Products</h3>

                {factoryProduct?.length !== 0 ? (
                  <>
                    <Carousel
                      cols={3}
                      rows={1}
                      // gap={10}
                      scrollSnap={true}
                      loop
                      showDots
                      hideArrow={false}
                      responsiveLayout={[
                        {
                          // breakpoint: 1132,
                          // breakpoint: 1176,
                          breakpoint: 1189,

                          cols: 2,
                          // gap: 58,
                        },

                        {
                          breakpoint: 997,
                          cols: 1,
                          // gap: 58,
                        },
                      ]}
                      mobileBreakpoint={539}
                    >
                      {factoryProduct.map((productItem) => (
                        <Carousel.Item>
                          <div className="card ">
                            <div
                              className="cursor"
                              onClick={() => {
                                navigate(
                                  `/productpage/${productItem.id}-${factoryDetails.name}-${productItem.name}`
                                );
                              }}
                            >
                              <img
                                src={`${baseUrl_IMG}/${productItem?.coverImage}`}
                                className="card-img-top"
                                alt="Product"
                                onError={handleImageError}
                              />
                            </div>
                            <div
                              className="card-body cursor"
                              onClick={() => {
                                navigate(
                                  `/productpage/${productItem.id}-${factoryDetails.name}-${productItem.name}`
                                );
                              }}
                            >
                              <h5 className="card-title product-card-text1 title-text-handler">
                                {productItem?.name}
                              </h5>
                              <div>
                                <p className="card-text product-card-text2 ">
                                  {productItem?.description}
                                </p>
                              </div>
                              <div className="maden">
                                <div className="card-svg">
                                  <img
                                    src={`https://flagcdn.com/16x12/${
                                      countriesMiddleEast.some(
                                        (item) =>
                                          item.code === factoryDetails?.country
                                      )
                                        ? countriesMiddleEast.find(
                                            (item) =>
                                              item.code ===
                                              factoryDetails?.country
                                          )?.id
                                        : ""
                                    }.png`}
                                    alt="country pic"
                                  />
                                </div>
                                <div className="card-svg-text">
                                  <p>
                                    {`${
                                      factoryDetails?.city
                                        ? factoryDetails?.city + ", "
                                        : ""
                                    }`}
                                    {factoryDetails?.country ?? ""}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center dots-pad ">
                              <div className="call-btns d-flex justify-content-between  align-items-center w-100  pe-2">
                                <button
                                  className="btn-call-1  cursor "
                                  onClick={() => {
                                    handleButtonClick(
                                      `privatelabel?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}&productId=${productItem?.id}&productName=${productItem?.name} `
                                    );
                                  }}
                                >
                                  <div className="btn-text text-decoration-none cursor text-white">
                                    Send Private Label Request
                                  </div>
                                </button>

                                <div
                                  className=" btn-call-2 padd text-dark text-decoration-none cursor"
                                  onClick={() => {
                                    handleIsLoggedInBtn(
                                      `contactsupplier?userId=${factoryDetails?.userId}&factoryName=${factoryDetails?.name}`
                                    );
                                  }}
                                >
                                  <i
                                    class="fa-regular fa-comments fa-2x"
                                    // style={{ fontSize: "1.5rem" }}
                                  ></i>
                                </div>
                              </div>

                              <ActionBtnsOnProduct
                                factoryDetails={factoryDetails}
                                factoryProduct={factoryProduct}
                                setFactoryHasProduct={setFactoryHasProduct}
                                handleButtonClick={handleButtonClick}
                                handleIsLoggedInBtn={handleIsLoggedInBtn}
                                productItem={productItem}
                              />
                            </div>
                          </div>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                    <div className="btn-container-all">
                      <div
                        className="get-all-btn text-decoration-none text-white card-cursors cursor"
                        onClick={() => {
                          navigate(
                            `/factoryProducts/MarketPlace?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`
                          );
                        }}
                      >
                        All Products
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-lg-4">
                    <div className="card ">
                      <div>
                        <h1 className="Img-txt-title  text-center my-auto card-img-top">
                          <span className="d-block py-5 my-1">
                            Create Your Own Brand
                          </span>
                        </h1>
                      </div>
                      <div className="card-body ">
                        <h5 className="card-title product-card-text1 title-text-handler">
                          Your Brand
                        </h5>
                        <div>
                          <p className="card-text product-card-text2 ">
                            Personal Branding? Partner with
                            {factoryIdName?.split("-")?.[1]} for your private
                            label brand journey, and let us transform your
                            vision into a unique and marketable reality.
                          </p>
                        </div>
                        <div className="maden align-items-baseline">
                          <div className="card-svg">
                            <img
                              src={`https://flagcdn.com/16x12/${
                                countriesMiddleEast.some(
                                  (item) =>
                                    item.code === factoryDetails?.country
                                )
                                  ? countriesMiddleEast.find(
                                      (item) =>
                                        item.code === factoryDetails?.country
                                    )?.id
                                  : ""
                              }.png`}
                              alt="flag"
                            />
                          </div>
                          <div className="card-svg-text">
                            <p>
                              {`${
                                factoryDetails?.city
                                  ? factoryDetails?.city + ", "
                                  : ""
                              }`}
                              {factoryDetails?.country ?? ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center dots-pad ">
                        <div className="call-btns padding d-flex justify-content-between align-items-center w-100  pe-2 ">
                          <button
                            className="btn-call-1  cursor me-3 "
                            onClick={() => {
                              handleButtonClick(
                                `CustomerProductReq?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}&productName=CreateYourOwnBrand `
                              );
                            }}
                          >
                            <div className="btn-text text-decoration-none text-white cursor">
                              Custom Product Request
                            </div>
                          </button>
                          <div
                            className=" btn-call-2 padd text-dark text-decoration-none cursor"
                            onClick={() => {
                              handleIsLoggedInBtn(
                                `contactsupplier?userId=${factoryDetails?.userId}&factoryName=${factoryDetails?.name}`
                              );
                            }}
                          >
                            <i class="fa-regular fa-comments fa-2x"></i>
                          </div>
                        </div>

                        {/* Your brand btns */}
                        <ActionBtnsOnFactory
                          factoryDetails={factoryDetails}
                          factoryProduct={factoryProduct}
                          setFactoryHasProduct={setFactoryHasProduct}
                          handleButtonClick={handleButtonClick}
                          handleIsLoggedInBtn={handleIsLoggedInBtn}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {factoryDetails?.qualityCertificates ? (
                <div id="certifications" className="fac-cert">
                  <h3 className="text-fac-4">Certificates</h3>

                  <div className="row justify-content-between">
                    <div className="col-12">
                      <Carousel
                        cols={2}
                        rows={1}
                        gap={10}
                        scrollSnap={true}
                        loop
                        showDots
                        hideArrow={false}
                      >
                        {factoryDetails?.qualityCertificates?.length !== 0
                          ? factoryDetails?.qualityCertificates?.map((item) => (
                              <Carousel.Item>
                                <div className="dots-slider-img w-100">
                                  <img
                                    className="h-100 w-100 "
                                    id={handleImageError}
                                    src={`${baseUrl_IMG}/${item}`}
                                    alt="Img"
                                    onError={handleImageError}
                                  />
                                </div>
                              </Carousel.Item>
                            ))
                          : ""}
                      </Carousel>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}

              {factoryDetails?.teamMembers?.length > 0 && (
                <div id="ourPeople" className="fac-team">
                  <h3 className="text-fac-4">Our People</h3>

                  <div className="row  ">
                    <div className="col-12">
                      <Carousel
                        cols={4}
                        rows={1}
                        // gap={10}
                        scrollSnap={true}
                        loop
                        showDots
                        hideArrow={false}
                        responsiveLayout={[
                          {
                            breakpoint: 1148,

                            cols: 3,
                          },
                          {
                            breakpoint: 983,

                            cols: 2,
                          },
                        ]}
                        mobileBreakpoint={539}
                      >
                        {factoryDetails?.teamMembers?.map((item, index) => (
                          <Carousel.Item>
                            <div className="parent-team w-100">
                              <div className=" member-cont  d-grid justify-content-center  ">
                                <div className="w-100 justify-content-center d-flex ">
                                  <img
                                    className="team-img"
                                    alt="team img"
                                    src={`${baseUrl_IMG}/${item?.image}`}
                                    onError={handleImageError}
                                  />
                                </div>
                                <div>
                                  <p className="w-100 text-center team-name fw-bolder">
                                    {item.name}
                                  </p>
                                  <p className="w-100 text-center team-name">
                                    {item.role}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* </div> */}
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    </div>
                  </div>
                </div>
              )}

              {factoryDetails?.importingCountries?.length > 0 && (
                <div id="exportedCountries" className="fac-cert">
                  <h3 className="text-fac-4">exported Countries</h3>
                  <div className="">
                    <ComposableMap
                      className="md-d-none"
                      viewBox="30 60 900 480" // Adjust the viewBox to fit your needs
                    >
                      <Geographies geography={your_geography_data}>
                        {({ geographies }) =>
                          geographies.map((geo) => (
                            <>
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                // onMouseEnter={(event) => handleMouseEnter(geo, event)}
                                // onMouseLeave={handleMouseLeave}
                                style={{
                                  default: {
                                    // fill: {...geo?.properties?.name =="Egypt" ?"red" :"blue"},
                                    fill: "#ECEFF1",
                                    stroke: "#607D8B",
                                    strokeWidth: 0.75,
                                    outline: "none",
                                  },
                                  hover: {
                                    fill: "#ECEFF1",
                                    stroke: "#607D8B",
                                    strokeWidth: 0.75,
                                    outline: "none",
                                  },
                                  active: {
                                    fill: "#ECEFF1",
                                    stroke: "#607D8B",
                                    strokeWidth: 0.75,
                                    outline: "none",
                                  },
                                  pressed: {
                                    fill: "#ECEFF1",
                                    stroke: "#607D8B",
                                    strokeWidth: 0.75,
                                    outline: "none",
                                  },
                                }}
                              />
                            </>
                          ))
                        }
                      </Geographies>

                      {factoryDetails?.importingCountries?.map(
                        (item, index) => {
                          const country = countriesMiddleEast.find(
                            (item1) => item1.code === item
                          );
                          const coordinates = country?.coordinates || [0, 0]; // Default coordinates if not found

                          return (
                            <Annotation
                              // subject={[30,30]}
                              subject={coordinates}
                              dx={2}
                              dy={0}
                              connectorProps={{
                                stroke: "#FF5533",
                                strokeWidth: 2,
                                strokeLinecap: "round",
                              }}
                            >
                              <line
                                x1={0}
                                y1={0}
                                // Adjust the y2 value to set the height of the line
                                stroke="#FF5533"
                                strokeWidth={3}
                                strokeLinecap="round"
                              />
                              <text
                                className="fw-bolder country-annot"
                                x="-1"
                                textAnchor="end"
                                alignmentBaseline="middle"
                                fill="black"
                              >
                                {
                                  countriesMiddleEast.find(
                                    (item1) => item1.code === item
                                  )?.id
                                }
                              </text>
                            </Annotation>
                          );
                        }
                      )}
                    </ComposableMap>

                    <div className="row mx-1  ">
                      {factoryDetails?.importingCountries?.map(
                        (item, index) => (
                          <div className="col-6 country-border py-2">
                            <div className="d-flex align-items-center">
                              <img
                                className="flag-img me-2"
                                // src={`https://flagcdn.com/w80/eg.png`}
                                src={`https://flagcdn.com/w80/${
                                  countriesMiddleEast.find(
                                    (item1) => item1.code === item
                                  )?.id
                                }.png`}
                              />
                              <p>{item} </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div id="Endorsements" className="">
                <h3 className="text-fac-4">Endorsements</h3>
                <div className=" row">
                  <div className="col-12 ">
                    <p>
                      Encourage {factoryDetails?.name} Company to share positive
                      experiences and to show that they are trustworthy and
                      cooperative.
                    </p>
                  </div>
                  <div className="col-6">
                    <div className="d-flex justify-content-start align-items-center padding-text-endors">
                      <p> Endorsements: {factoryDetails?.endorsements || 0}</p>
                    </div>
                  </div>
                  <div className="col-6 ">
                    <div className="d-flex justify-content-end align-items-center">
                      {!currentUserData?.datacompletelyLoaded ? (
                        <button
                          className="btn-endorse cursor"
                          onClick={(e) => {
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

                              setisLoggedReDirect(
                                `/signIn/factoryPage/${factoryIdName}`
                              );
                              return;
                            }

                            EndorseSubmit(e);
                          }}
                        >
                          <p className="text-end cursor">Endorse</p>
                        </button>
                      ) : (
                        <button type="button" className="btn-endorse px-4">
                          <i className="fas fa-spinner fa-spin"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-4 md-d-none ">
              <div className="parent-buttons-container  d-table-cell ">
                <div className="d-flex align-items-center">
                  <div
                    className={`text-container `}
                    onClick={() => {
                      handleButtonClick(
                        `privatelabel?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`
                      );
                    }}
                  >
                    <p className="cursor"> Private Label Request</p>
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                    title={BtnDescription.privateLabelRequest}
                    onClick={() => {
                      handleQuestionMarkClick(
                        BtnDescription.privateLabelRequest
                      );
                    }}
                  ></button>
                </div>

                <div className="d-flex align-items-center">
                  <div
                    className="text-container"
                    onClick={() => {
                      handleButtonClick(
                        `CustomerProductReq?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`
                      );
                    }}
                  >
                    <p className="cursor">Custom Product Request </p>
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

                <div className="d-flex align-items-center">
                  <div
                    className={`text-container `}
                    onClick={() => {
                      handleButtonClick(
                        `whiteLabelings/form?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`
                      );
                    }}
                  >
                    <p className="cursor"> White Label Request</p>
                  </div>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                    title={BtnDescription.whiteLabelRequest}
                    onClick={() => {
                      handleQuestionMarkClick(BtnDescription.whiteLabelRequest);
                    }}
                  ></button>
                </div>

                <div className="d-flex align-items-center">
                  <button
                    className={`text-container `}
                    onClick={() => {
                      if (factoryProduct?.length == 0) {
                        setFactoryHasProduct(true);
                        return;
                      }
                      handleButtonClick(
                        `sendrfq?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`,
                        "ToSendRFQ"
                      );
                    }}
                  >
                    <p className="cursor">Send RFQ</p>
                  </button>
                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                    title={BtnDescription.RFQ}
                    onClick={() => {
                      handleQuestionMarkClick(BtnDescription.RFQ);
                    }}
                  ></button>
                </div>

                <div className="d-flex align-items-center">
                  <button
                    className={`text-container `}
                    onClick={() => {
                      if (factoryProduct?.length == 0) {
                        setFactoryHasProduct(true);
                        return;
                      }
                      handleButtonClick(
                        `purchasingOrder/fromfactory?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`,
                        "ToPurchasingOrder"
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

                <div className="d-flex align-items-center">
                  <button
                    className="text-container"
                    onClick={() => {
                      handleIsLoggedInBtn(
                        `contactsupplier?userId=${factoryDetails?.userId}&factoryName=${factoryDetails?.name}`
                      );
                    }}
                  >
                    <p className="cursor">Contact Supplier</p>
                  </button>

                  <button
                    className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                    title={BtnDescription.contactSupplier}
                    onClick={() => {
                      handleQuestionMarkClick(BtnDescription.contactSupplier);
                    }}
                  ></button>
                </div>

                <div className="d-flex align-items-center">
                  <div
                    className="text-container"
                    onClick={() => {
                      handleButtonClick(
                        `requestVisit?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`,
                        "ToRequestVisit"
                      );
                    }}
                  >
                    <p className="cursor">Factory Visit Request</p>
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
            </div>
          </div>
        </div>

        {/* <i class="fa-solid fa-ellipsis-vertical floating-btn "> */}
        <i class=" floating-btn ">
          <ActionBtnsOnFactory
            factoryDetails={factoryDetails}
            factoryProduct={factoryProduct}
            setFactoryHasProduct={setFactoryHasProduct}
            handleButtonClick={handleButtonClick}
            handleIsLoggedInBtn={handleIsLoggedInBtn}
          />
        </i>
      </section>

      <Modal
        show={factoryHasProduct}
        onHide={() => setFactoryHasProduct(false)}
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
            <div className="row  row-gap">
              <div className="form-group">
                <label className="w-100 ">
                  There are no products available from this factory at the
                  moment. However, you can send a private label or custom
                  product request
                </label>
              </div>
              <div className="col-12 d-flex justify-content-start btn-modal-gap">
                <Button
                  className="btn-edit "
                  onClick={() => {
                    handleButtonClick(
                      `CustomerProductReq?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}&productName=CreateYourOwnBrand `
                    );

                    // return
                  }}
                >
                  <p className="cursor "> Custom Product Request</p>
                </Button>
                <button
                  className="btn-edit border bg-white "
                  onClick={() => {
                    handleButtonClick(
                      `privatelabel?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name} `
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

export default Factorypage;
