import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl_IMG, useAppTranslation } from "config.js";

// config
import { userDetails } from "Context/userType";
import { UserToken } from "Context/userToken";
import DropdownActionBtns from "components/Shared/DropdownActionBtns/DropdownActionBtnsProducts";

// helpers
import { handleImageError } from "utils/ImgNotFound";
import StarRating from "components/Shared/stars";
import DescritionPopUp from "components/Shared/DescritionPopUp";

// action btns
import HandleUsersBtnAccess, {
  handleIsLoggedInBtn,
} from "utils/actionBtns/HandleUsersBtnAccess";

// static variabls

export default function ProductCard(props) {
  let { productItem, productIndex, setModalShow, setisLoggedReDirect } = props;
  let { isLogin } = useContext(UserToken);

  let { currentUserData } = useContext(userDetails);
  const { trans: t, } = useAppTranslation();

  const navigate = useNavigate();
  const [description, setDescription] = useState("");

  //
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
      {/* <div
        key={productIndex}
        className="col-xxl-4 col-xl-4  col-lg-6  col-12  "
      > */}
      <button className="card  w-100 p-0 ">
        <img
          className="card-img-top object-fit-contain"
          src={`${baseUrl_IMG}/${productItem?.coverImage}`}
          alt={`${baseUrl_IMG}/${productIndex}`}
          onError={handleImageError}
          onClick={() => {
            navProductpage(
              productItem?.id,
              productItem?.name,
              productItem?.factory?.name
            );
          }}
        />

        <div className="card-body  mb-0 pb-0 w-100">
          <div
            className="sub-container-1 cursor text-truncate"
            onClick={() => {
              navProductpage(
                productItem?.id,
                productItem?.name,
                productItem?.factory?.name
              );
            }}
          >
            <h5 className="card-title product-card-text1 m-0 cursor text-truncate">
              {productItem?.name}
            </h5>

            <div className="rating-conatiner  cursor">
              <div className="sub-rating-container ">
                {productItem?.productAverageRate ? (
                  <StarRating averageRating={productItem?.productAverageRate} />
                ) : (
                  ""
                )}
                <div className="rating-text">
                  <p className="cursor">{productItem?.averageRate} Rating</p>
                </div>
              </div>
            </div>

            <p className="price-title cursor">
              <span>Price</span> {productItem?.price}
            </p>

            <div className="parent-profile-conatiner">
              <div className="heading-text">
                <div className="sub-profile-conatiner">
                  <img
                    className="cursor"
                    src={`${baseUrl_IMG}/${productItem?.factory?.coverImage}`}
                    alt="factory Cover"
                    onError={handleImageError}
                    onClick={() => {
                      navigate(
                        `/factoryPage/${productItem?.factoryId}-${productItem?.factory?.name}`
                      );
                    }}
                  />

                  <div
                    className="profile-title cursor"
                    onClick={() => {
                      navProductpage(
                        productItem?.id,
                        productItem?.name,
                        productItem?.factory?.name
                      );
                    }}
                  >
                    <p className="title cursor">{productItem?.factory?.name}</p>
                    <p className="sub-title cursor">
                      {/* city, country */}
                      {`${productItem?.factory?.city ? productItem?.factory?.city + ", " : ""}`}
                      {productItem?.factory?.country ?? ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" d-flex justify-content-between align-items-center   w-100 px-3 ">
          <div className="call-btns d-flex justify-content-between  align-items-center w-100 pe-2 ">
            {/* <button
              className="btn-call-1"
              onClick={() => {
                handleUserClickValidation1(
                  `privatelabel?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
                );
              }}
            >
              <div className="btn-text text-white ">Private Label Request</div>
            </button> */}
            <button
              className="btn-call-1 px-4"
              onClick={() => {
                handleUserClickValidation1(
                  `sendrfq?factoryId=${productItem?.factoryId}&factoryName=${productItem?.factory?.name}&productId=${productItem?.id}&productName=${productItem?.name}`
                );
              }}
            >
              <div className="btn-text text-white ">
                {" "}
                {t("BtnsDescription:RFQ.sendRfq")}
              </div>
            </button>
            <button
              className="btn-call-3 cursor bg-white"
              onClick={() => {
                handleUserClickValidLogin(
                  `contactsupplier?userId=${productItem?.factory?.userId}&factoryName=${productItem?.factory?.name}`
                );
              }}
            >
              <i className="fa-regular fa-comments fa-2x"></i>
            </button>
          </div>

          <DropdownActionBtns
            currentUserData={currentUserData}
            productItem={productItem}
            handleButtonClick={handleUserClickValidation1}
            handleQuestionMarkClick={handleQuestionMarkClick}
            // handleIsLoggedInBtn={handleIsLoggedInBtn}
          />
        </div>
      </button>
      {/* </div> */}

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
