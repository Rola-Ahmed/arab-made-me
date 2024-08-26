import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// css
import "../Products/products.css";

// context
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

// api url
import { baseUrl, baseUrl_IMG, useAppTranslation } from "config.js";

// sub components
import StarRating from "components/Shared/stars";

// const functions
import { handleImageError } from "utils/ImgNotFound";
import { BtnDescription } from "constants/BtnDescription";

// modals validation
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import DescritionPopUp from "components/Helpers/DescritionPopUp";
import DropdownActionBtns from "components/Shared/DropdownActionBtns/DropdownActionBtnsProducts";

function Products(title) {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let navigate = useNavigate();

  // action verification
  const [description, setDescription] = useState("");
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
    displayDescr: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  const [allProductsData, setAllProductsData] = useState();
  const { trans: t, currentLang } = useAppTranslation();

  useEffect(() => {
    axios
      .get(`${baseUrl}/products?size=20&include=factory`)
      .then((response2) => {
        if (response2?.data?.message === "done") {
          setAllProductsData(
            response2.data.products.filter((item) => item?.factoryId !== null)
          );
        }
      })

      .catch((error) => {});
  }, []);

  function navProductpage(productId, productName, factoryName) {
    navigate(`/productpage/${productId}-${productName}-${factoryName}`);
  }

  function handleButtonClick(loginPath) {
    if (
      currentUserData?.importerId !== null &&
      (currentUserData?.importerVerified === "0" ||
        !currentUserData?.importerEmailActivated)
    ) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isImporterVerified: true,
      }));
      // setisLoggedReDirect(
      //   `signIn/${loginPath}`
      // );
      return;
    }

    if (currentUserData?.factoryId !== null) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isFactoryVerified: true,
      }));
      return;
    }

    if (
      currentUserData?.importerId == null &&
      currentUserData?.factoryId == null
    ) {
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

    navigate(`${loginPath}`);
  }

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

  const handleQuestionMarkClick = (desc) => {
    setDescription(desc);
    setModalShow((prevVal) => ({
      ...prevVal,
      displayDescr: true,
    }));
  };

  return (
    <>
      <section className="products-section  margin-sm-screen ">
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

        <div className="container topProducts">
          <div
            className={` d-flex justify-content-between align-content-end ${
              currentLang == "ar" && "ar-flex-reverse"
            }`}
          >
            <div className={` ${currentLang == "ar" && "ar-text"}`}>
              <p className="header-Title">
                {title?.title ? title?.title : `${t("translation:products")}`}
              </p>
              <p className="fs-16 text-muted">
                {t("translation:titles.subTitleProduct")}
              </p>
            </div>
            <div className="d-flex arrow-container align-items-end ">
              <div className="arrow-btn position-static arrowLeft carousel">
                <i className="fa-solid fa-chevron-left"></i>
              </div>

              <div className="arrow-btn position-static arrowRight carousel">
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          </div>

          <div className="container  w-100 p-0 overflow-hidden">
            <Swiper
              // modules={[Navigation]}
              modules={[Navigation]}
              navigation={{
                nextEl: ".arrowRight",
                prevEl: ".arrowLeft ",
              }}
              spaceBetween={19}
              slidesPerView={1}
              breakpoints={{
                687: {
                  slidesPerView: 1,
                  // slidesPerGroup: 4,
                },
                765: {
                  slidesPerView: 2,
                  // slidesPerGroup: 4,
                },
                994: {
                  slidesPerView: 3,
                  // slidesPerGroup: 4,
                },

                1253: {
                  slidesPerView: 4,
                  // slidesPerGroup: 4,
                },
              }}
            >
              {allProductsData?.map((productItem, productIndex) => (
                <SwiperSlide>
                  <div
                    className="card  text-decoration-none   "
                    // style={{ width: "308px" }}
                  >
                    <img
                      onClick={() => {
                        navProductpage(
                          productItem?.id,
                          productItem?.name,
                          productItem?.factory?.name
                        );
                      }}
                      className="card-img-top card-cursor img-size"
                      src={`${baseUrl_IMG}/${productItem?.coverImage}`}
                      alt={`${baseUrl_IMG}/${productIndex}`}
                      onError={handleImageError}
                    />

                    <div className="card-body ">
                      <div
                        className="sub-container-1  cursor "
                        onClick={() => {
                          navProductpage(
                            productItem?.id,
                            productItem?.name,
                            productItem?.factory?.name
                          );
                        }}
                      >
                        <h5 className="card-title product-card-text1 m-0 cursor title-text-handler">
                          {productItem?.name}
                        </h5>

                        <div className="rating-conatiner cursor ">
                          <div className="sub-rating-container ">
                            {productItem?.productAverageRate ? (
                              <StarRating
                                averageRating={productItem?.productAverageRate}
                              />
                            ) : (
                              ""
                            )}
                            <div className="rating-text">
                              <p className="cursor">
                                {productItem?.averageRate} Rating
                              </p>
                            </div>
                          </div>
                        </div>

                        <p className="price-title cursor">
                          <span>Price</span> {productItem?.price}
                        </p>
                      </div>

                      <div className="parent-profile-conatiner w-100">
                        <div className="heading-text">
                          <div className="sub-profile-conatiner w-100">
                            <img
                              className="cursor"
                              src={`${baseUrl_IMG}/${productItem?.factory?.coverImage}`}
                              alt="factory cover image"
                              onError={handleImageError}
                              onClick={() => {
                                navigate(
                                  `/factoryPage/${productItem?.factoryId}-${productItem?.factory?.name}`
                                );
                              }}
                            />

                            <div
                              className="profile-title w-100  cursor"
                              onClick={() => {
                                navProductpage(
                                  productItem?.id,
                                  productItem?.name,
                                  productItem?.factory?.name
                                );
                              }}
                            >
                              <p className="title w-100 cursor">
                                {productItem?.factory?.name}
                              </p>
                              <p className="sub-title w-100 cursor">
                                {/* city, country */}
                                {`${
                                  productItem?.city
                                    ? productItem?.city + ", "
                                    : ""
                                }`}
                                {productItem?.country ?? ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center   w-100">
                        <div className="call-btns justify-content-between  align-items-center w-100 pe-2">
                          {currentUserData?.datacompletelyLoaded ? (
                            <button className="btn-call-1  cursor px-5 ">
                              <div className="btn-text text-decoration-none cursor text-white">
                                <i className="fas fa-spinner fa-spin text-white"></i>
                              </div>
                            </button>
                          ) : (
                            <button
                              className="btn-call-1"
                              onClick={() => {
                                handleButtonClick(
                                  `/privatelabel?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
                                );
                              }}
                            >
                              <div className="btn-text text-white">
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
                            <button
                              className="btn-call-2 cursor bg-white"
                              onClick={() => {
                                // fixed----------------------------------
                                handleIsLoggedInBtn(
                                  `contactsupplier?userId=${productItem?.factory?.userId}&factoryName=${productItem?.factory?.name}`
                                );
                              }}
                            >
                              <i
                                className="fa-regular fa-comments fa-2x"
                                style={{ fontSize: "1.5rem" }}
                              ></i>
                            </button>
                          )}
                        </div>

                        <DropdownActionBtns
                          currentUserData={currentUserData}
                          productItem={productItem}
                          BtnDescription={BtnDescription}
                          handleButtonClick={handleButtonClick}
                          handleQuestionMarkClick={handleQuestionMarkClick}
                          handleIsLoggedInBtn={handleIsLoggedInBtn}
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="btn-container-all">
            <div
              className="get-all-btn text-decoration-none text-white card-cursors cursor"
              onClick={() => {
                navigate("/productMarketPlace");
              }}
            >
              All Products
            </div>
          </div>
        </div>
      </section>

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

export default Products;
