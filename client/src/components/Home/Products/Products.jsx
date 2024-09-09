import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "components/Products/AllProducts/ProductCard";
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
import { handleImageError, handleProfileError } from "utils/ImgNotFound";

// modals validation
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import DescritionPopUp from "components/Helpers/DescritionPopUp";
import DropdownActionBtns from "components/Shared/DropdownActionBtns/DropdownActionBtnsProducts";
import HandleUsersBtnAccess, {
  handleIsLoggedInBtn,
} from "utils/actionBtns/HandleUsersBtnAccess";
import DefaultUserNotAuthorizedModal from "components/ActionMessages/FormAccessControl/DefaultUserNotAuthorizedModal";
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
    isDefaultUserNotAllowed: false,
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
  };

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

      <section className=" home-padding-y  margin-sm-screen ">
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
            <div className="d-flex gap-12 align-items-end ">
              <div className="arrow-btn  arrowLeft">
                <i className="fa-solid fa-chevron-left"></i>
              </div>

              <div className="arrow-btn  arrowRight">
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
                  <ProductCard
                    productItem={productItem}
                    productIndex={productIndex}
                    setisLoggedReDirect={setisLoggedReDirect}
                    setModalShow={setModalShow}
                    modalShow={modalShow}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="mx-auto pt-60">
            <button
              className="get-all-btn  fs-15-semi  rounded-3"
              onClick={() => {
                navigate("/productMarketPlace");
              }}
            >
              All Products
            </button>
          </div>
        </div>
      </section>

      <DescritionPopUp
        show={description != ""}
        description={description}
        onClose={() => {
          handleQuestionMarkClick("");
        }}
      />
    </>
  );
}

export default Products;
