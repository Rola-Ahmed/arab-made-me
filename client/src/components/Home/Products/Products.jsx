import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllProducts } from "Services/products";

import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "components/Products/AllProducts/ProductCard";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// css
import "assets/css/products.css";

// context

// api url
import { useAppTranslation } from "config.js";

// modals validation
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import DescritionPopUp from "components/Shared/DescritionPopUp";

import DefaultUserNotAuthorizedModal from "components/ActionMessages/FormAccessControl/DefaultUserNotAuthorizedModal";
function Products(title) {
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
    async function products() {
      const result = await getAllProducts("size=20&include=factory");
      console.log("result getAllProducts",result)
      if (result?.success) {
        setAllProductsData(result.data.products);
      }
    }
    products();
  }, []);

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
                {title?.title
                  ? title?.title
                  : `${t("translation:marketPlace")}`}
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
                },
                765: {
                  slidesPerView: 2,
                },
                994: {
                  slidesPerView: 3,
                },

                1253: {
                  slidesPerView: 4,
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
              {t("translation:allProducts")}
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
