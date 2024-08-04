import { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Factorypage.css";
import { BtnDescription } from "constants/BtnDescription";
import { useNavigate } from "react-router-dom";
import SuccessToast from "components/SuccessToast";
import ErrorToast from "components/ErrorToast";
import { useFetchSectors } from "hooks/useFetchSectors";
import { handleImageError, handleVedioError } from "utils/ImgNotFound";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { baseUrl_IMG } from "config.js";
import { countriesMiddleEast } from "constants/countries";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";

import DescritionPopUp from "components/Helpers/DescritionPopUp";
import DropdownActionBtnsFactory from "components/Shared/DropdownActionBtns/FactoryBtns/DropdownActionBtnsFactory";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import ProductCard from "components/Products/AllProducts/ProductCard";
import ExportedCountries from "./subComponents/ExportedCountries";
import { addEndorsement } from "Services/endorsements";
import FactoryNav from "./subComponents/FactoryNav";
import FactoryABout from "./subComponents/FactoryABout";
import Endorsement from "./subComponents/Endorsement";
import FactoryCetificate from "./subComponents/FactoryCetificate";
import HandleUsersBtnAccess, {
  handleIsLoggedInBtn,
} from "utils/actionBtns/HandleUsersBtnAccess";
import FactoryTeam from "./subComponents/FactoryTeam";
import { useFetchData } from "./useFetchData";
import HeaderSlider from "./subComponents/HeaderSlider";

function Factorypage() {
  let { currentUserData } = useContext(userDetails);
  document.title = "Factory Page";
  let { allSectors } = useFetchSectors();

  const [description, setDescription] = useState("");

  const handleQuestionMarkClick = (desc) => {
    setDescription(desc);
    setModalShow((prevVal) => ({
      ...prevVal,
      displayDescr: true,
    }));
  };

  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);

  let [factoryHasProduct, setFactoryHasProduct] = useState(false);

  async function EndorseSubmit() {
    if (currentUserData?.userRole != "importer") {
      ErrorToast("To add an endorsement, the user must be a buyer.");
      return;
    }

    let data = {
      factoryId: factoryDetails?.id,
    };

    let result = await addEndorsement({ authorization: isLogin }, data);

    if (result?.success) {
      SuccessToast("Endorsement added successfully");
    } else {
      ErrorToast(result?.error);
    }
  }

  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
    displayDescr: false,
  });
  let { factoryDetails, factoryProduct, factoryIdName } = useFetchData();
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  const handleUserClickValidLogin = (loginPath) => {
    handleIsLoggedInBtn({
      isLogin,
      navigate,
      setModalShow,
      setisLoggedReDirect,
      loginPath,
    });
  };

  function addEndorse() {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));

      setisLoggedReDirect(`/signIn/factoryPage/${factoryIdName}`);
      return;
    }

    if (currentUserData?.userRole != "importer") {
      setModalShow((prevVal) => ({
        ...prevVal,
        isFactoryVerified: true,
      }));
      return;
    }

    EndorseSubmit();
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
    handleUserClickValidation(loginPath);
  };

  // handleButtonClick
  const handleUserClickValidation = (loginPath) => {
    HandleUsersBtnAccess({
      currentUserData,
      isLogin,
      navigate,
      setModalShow,
      setisLoggedReDirect,
      loginPath,
    });
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

      {/* header section */}
      <HeaderSlider
        handleImageError={handleImageError}
        handleVedioError={handleVedioError}
        baseUrl_IMG={baseUrl_IMG}
        factoryDetails={{
          coverVideo: factoryDetails?.coverVideo,
          images: factoryDetails?.images,
          name: factoryDetails?.name,
          city: factoryDetails?.city,
          totalProducts: factoryDetails?.totalProducts,
          country: factoryDetails?.country,
        }}
      />

    
     

      <section className="det-fact margin-sm-screen">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-md-8  ">
              {/* navbar menu */}
              <div className="call-fac-page scroll">
                <FactoryNav
                  factoryDetails={factoryDetails}
                  handleIsLoggedInBtn={handleUserClickValidLogin}
                />
              </div>

              <div id="about" className="pehat">
                <FactoryABout
                  factoryDetails={factoryDetails}
                  allSectors={allSectors}
                />
              </div>

              <div id="products" className="fac-cert ">
                <h3 className="text-fac-4">Products</h3>

                {factoryProduct?.length !== 0 ? (
                  <>
                    <Swiper
                      className="mx-3 h-100"
                      modules={[Navigation, Pagination]}
                      navigation={true}
                      Pagination={true}
                      slidesPerView={1.3}
                      spaceBetween={10}
                      breakpoints={{
                        1004: {
                          slidesPerView: 2,
                        },
                        1207: {
                          slidesPerView: 3,
                        },
                      }}
                    >
                      {factoryProduct?.map((productItem, productIndex) => (
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
                              {factoryDetails?.city &&
                                `${factoryDetails.city},`}

                              {factoryDetails?.country}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center dots-pad  brant-cont">
                        <div className="call-btns padding d-flex justify-content-between align-items-center w-100  pe-2 ">
                          <button
                            className="btn-call-1  cursor me-3 "
                            onClick={() => {
                              handleUserClickValidation(
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
                              handleUserClickValidLogin(
                                `contactsupplier?userId=${factoryDetails?.userId}&factoryName=${factoryDetails?.name}`
                              );
                            }}
                          >
                            <i class="fa-regular fa-comments fa-2x"></i>
                          </div>
                        </div>

                        {/* pop up btn */}
                        <DropdownActionBtnsFactory
                          currentUserData={currentUserData}
                          factoryitem={factoryDetails}
                          BtnDescription={BtnDescription}
                          handleBtnCheckIfProductExisit={
                            handleBtnCheckIfProductExisit
                          }
                          handleUserClickValidation1={handleUserClickValidation}
                          handleQuestionMarkClick={handleQuestionMarkClick}
                          handleUserClickValidLogin={handleUserClickValidLogin}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {factoryDetails?.qualityCertificates && (
                <div id="certifications" className="fac-cert">
                  <FactoryCetificate
                    qualityCertificates={factoryDetails?.qualityCertificate}
                    handleImageError={handleImageError}
                    baseUrl_IMG={baseUrl_IMG}
                  />
                </div>
              )}

              {factoryDetails?.teamMembers?.length > 0 && (
                <div id="ourPeople" className="fac-cert ">
                  <FactoryTeam
                    teamMembers={factoryDetails?.teamMembers}
                    handleImageError={handleImageError}
                    baseUrl_IMG={baseUrl_IMG}
                  />
                </div>
              )}

              {factoryDetails?.importingCountries?.length > 0 && (
                <ExportedCountries
                  importingCountries={factoryDetails?.importingCountries}
                  countriesMiddleEast={countriesMiddleEast}
                />
              )}

              <div id="Endorsements" className="">
                <Endorsement
                  factoryDetails={factoryDetails}
                  addEndorse={addEndorse}
                  currentUserData={currentUserData}
                />
              </div>
            </div>

            <div className="col-lg-2 col-md-4 col-12  mx-auto w-fit-content">
              <div className="parent-buttons-container  d-table-cell ">
                <div className="d-flex align-items-center">
                  <div
                    className={`text-container `}
                    onClick={() => {
                      handleUserClickValidation(
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
                      handleUserClickValidation(
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
                      handleUserClickValidation(
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
                      handleUserClickValidation(
                        `sendrfq?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`
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
                      handleUserClickValidation(
                        `purchasingOrder/fromfactory?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`
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
                      handleUserClickValidLogin(
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
                      handleUserClickValidation(
                        `requestVisit?factoryId=${factoryDetails?.id}&factoryName=${factoryDetails?.name}`
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
                    handleUserClickValidation(
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
                    handleUserClickValidation(
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

export default Factorypage;
