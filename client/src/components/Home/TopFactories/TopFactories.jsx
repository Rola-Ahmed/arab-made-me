import { useState, useContext } from "react";
import "./TopFactories.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAppTranslation } from "config.js";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import HandleUsersBtnAccess, {
  handleIsLoggedInBtn,
} from "utils/actionBtns/HandleUsersBtnAccess";

import { useNavigate } from "react-router-dom";
import { UserToken } from "Context/userToken";
// modals
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import DescritionPopUp from "components/Helpers/DescritionPopUp";

import { userDetails } from "Context/userType";
// static variabls

import FactoryCardParent from "./Shared/FactoryCardParent";
import DefaultUserNotAuthorizedModal from "components/ActionMessages/FormAccessControl/DefaultUserNotAuthorizedModal";

export default function TopFactories(props) {
  let { allFactoriesData } = props;

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  let navigate = useNavigate();

  const [description, setDescription] = useState("");
  const { trans: t, currentLang } = useAppTranslation();

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
  };

  return (
    <>
      <section className="home-padding-t margin-sm-screen ">
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
        <DefaultUserNotAuthorizedModal
          show={modalShow.isDefaultUserNotAllowed}
          onHide={() =>
            setModalShow((prevVal) => ({
              ...prevVal,
              isDefaultUserNotAllowed: false,
            }))
          }
          // userType="User"
          // goToPath="CompanyDetails"
          goToPath="userType"
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
          {/* <div className=" d-flex justify-content-between align-content-end"> */}
          <div
            className={` d-flex justify-content-between align-content-end ${
              currentLang == "ar" && "ar-flex-reverse"
            }`}
          >
            <div className={` ${currentLang == "ar" && "ar-text"}`}>
              <p className="header-Title">{t("translation:factories")}</p>
              <p className=" fs-16 text-muted">
                {t("translation:titles.subTitleFactories")}
              </p>
            </div>
            <div className="d-flex gap-12 align-items-end ">
              <div className="arrow-btn  prev-btn-swiper">
                <i className="fa-solid fa-chevron-left"></i>
              </div>

              <div
                // disabled
                className="arrow-btn next-btn-swiper"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          </div>

          <div className="factoryCard  container m-0 p-0 overflow-hidden  mb-1 ">
            {/* <Slider {...settingsMain} ref={sliderRef}> */}

            <Swiper
              // modules={[Navigation]}
              modules={[Navigation]}
              navigation={{
                nextEl: ".next-btn-swiper",
                prevEl: ".prev-btn-swiper",
              }}
              spaceBetween={0}
              slidesPerView={1}
              breakpoints={{
                654: {
                  slidesPerView: 1.5,
                },

                775: {
                  slidesPerView: 2,
                },

                1004: {
                  slidesPerView: 3,
                },

                1253: {
                  slidesPerView: 4,
                },
              }}
            >
              {allFactoriesData.map((factoryitem, factoryindex) => (
                // <div className="col-sm-12 col-xl-4 col-xxl-3  col-lg-4  col-md-6 m-0  px-1"
                <>
                  <SwiperSlide>
                    <FactoryCardParent
                      factoryitem={factoryitem}
                      currentUserData={currentUserData}
                      handleUserClickValidation1={handleUserClickValidation1}
                      handleUserClickValidLogin={handleUserClickValidLogin}
                      handleQuestionMarkClick={handleQuestionMarkClick}
                      handleBtnCheckIfProductExisit={
                        handleBtnCheckIfProductExisit
                      }
                    />
                  </SwiperSlide>
                </>
              ))}
            </Swiper>
          </div>

          <div className="mx-auto pt-60">
            <button
              onClick={() => {
                navigate("/factoryGallery");
              }}
              className="get-all-btn  fs-15-semi  rounded-3"
            >
              {t("translation:factories")}
            </button>
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
                    handleUserClickValidation1(
                      `CustomerProductReq?${factoryHasProduct.location}&productName=CreateYourOwnBrand `
                    );
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
