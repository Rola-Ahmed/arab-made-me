import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Carousel from "react-grid-carousel";

// css
import "../Products/products.css";

// context
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

// api url
import { baseUrl, baseUrl_IMG } from "config.js";

// sub components
import StarRating from "components/Shared/stars";

// const functions
import { handleImageError } from "utils/ImgNotFound";
import { BtnDescription } from "constants/BtnDescription";

// modals validation
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerifiedModal/ImporterUnVerifiedModal";
import UserNotAuthorized from "components/ActionMessages/UserNotAuthorized/UserNotAuthorized";
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
  const [apiLoadingData, setapiLoadingData] = useState([]);

  useEffect(() => {
    setapiLoadingData(true);
    axios
      .get(`${baseUrl}/products?size=20&include=factory`)
      .then((response2) => {
        if (response2?.data?.message === "done") {
          setAllProductsData(
            response2.data.products.filter((item) => item?.factoryId !== null)
          );
        }
      })

      .catch((error) => {})
      .finally(() => {
        setapiLoadingData(!apiLoadingData);
      });
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
          <div className="header d-flex justify-content-between">
            <div>
              <h2 className="header-Title">
                {" "}
                {title?.title ? title?.title : "Products"}
              </h2>
              <p>Everything you need to know about the product and billing.</p>
            </div>
            <div className="d-flex arrow-container">
              <div className={`arrow-btn  d-none`} disabled>
                <i className="fa-solid fa-chevron-left"></i>
              </div>

              <div className="arrow-btn  d-none" disabled>
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          </div>

          <div className="container  w-100 p-0">
            <Carousel
              cols={4}
              rows={1}
              gap={19}
              scrollSnap={true}
              hideArrow={false}
              loop
              responsiveLayout={[
                {
                  breakpoint: 1398,
                  cols: 3,
                  // gap: 58,
                },
                {
                  breakpoint: 1199,
                  cols: 3,
                  // gap: 8,
                },

                {
                  breakpoint: 989,
                  cols: 2,
                  // gap: 19,
                },
                {
                  breakpoint: 767,
                  cols: 1,
                  gap: 10,
                  width: 74,
                },
                {
                  breakpoint: 539,
                  cols: 1,
                  gap: 10,
                  width: 100,
                },
              ]}
              mobileBreakpoint={539}
              arrowLeft={
                <div className="arrow-btn position-absolute arrowLeft carousel">
                  <i className="fa-solid fa-chevron-left"></i>
                </div>
              }
              arrowRight={
                <div className="arrow-btn position-absolute arrowRight carousel">
                  <i className="fa-solid fa-chevron-right"></i>
                </div>
              }
            >
              {allProductsData?.map((productItem, productIndex) => (
                <Carousel.Item>
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
                                class="fa-regular fa-comments fa-2x"
                                style={{ fontSize: "1.5rem" }}
                              ></i>
                            </button>
                          )}
                        </div>

                        {/* popup btns */}
                        <div className=" text-dark text-decoration-none cursor d-none">
                          {currentUserData?.datacompletelyLoaded ? (
                            <i className=" fas fa-spinner fa-spin text-dark"></i>
                          ) : (
                            <i class=" ellipsis px-2 fa-solid fa-ellipsis-vertical "></i>
                          )}
                          {/* if fa-spinner appears then the ul wont appear  */}
                          <ul
                            className="dropdown-menu-top 
                                p-3 m-2"
                          >
                            <div className="parent-buttons-container cursor">
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="text-container "
                                  onClick={() => {
                                    handleButtonClick(
                                      `CustomerProductReq?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
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
                                    handleButtonClick(
                                      `sendrfq?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
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
                                    handleButtonClick(
                                      `purchasingOrder?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
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
                                    handleIsLoggedInBtn(
                                      `contactsupplier?userId=${productItem?.factory?.userId}&factoryName=${productItem?.factory?.name}`
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
                                    handleButtonClick(
                                      `requestVisit?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}`,
                                      "ToRequestVisit"
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
                </Carousel.Item>
              ))}
            </Carousel>
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
