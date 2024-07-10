import React, { useState, useContext, useRef } from "react";
import "./TopFactories.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HandleUsersBtnAccess, {
  handleIsLoggedInBtn,
} from "utils/actionBtns/HandleUsersBtnAccess";

import { Link, useNavigate } from "react-router-dom";
import { UserToken } from "Context/userToken";
// modals
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import DescritionPopUp from "components/Helpers/DescritionPopUp";

import { userDetails } from "Context/userType";
// static variabls

// import FactoryCardParent from "./Shared/FactoryCardParent";

export default function TopFactories(props) {
  let { allFactoriesData } = props;

  const sliderRef = useRef();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  let navigate = useNavigate();

  const [description, setDescription] = useState("");

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

  const settingsMain = {
    // dots: false,
    // fade: true,
    infinite: true,
    vertical: false,
    // verticalSwiping: true,
    rows: 1,
    slidesToShow: 4,
    // slidesToShow: allFactoriesData?.length > 4 ? 4 : allFactoriesData?.length,
    slidesToScroll: 4,
    // slidesToScroll: allFactoriesData?.length > 4 ? 4 : allFactoriesData?.length,
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
              //  <FactoryCardParent/>
                // {/* </div> */}
                <>
                </>
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
