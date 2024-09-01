import { Link, useNavigate } from "react-router-dom";
import BannerSlider from "../BannerSlider/BannerSlider";
import { handleImageError } from "utils/ImgNotFound";
import { BtnDescription } from "constants/BtnDescription";
import DropdownActionBtnsFactory from "components/Shared/DropdownActionBtns/DropdownActionBtnsFactory";
import ProductCarousel from "components/Home/TopFactories/ProductCarousel/ProductCarousel";
import FactoryCard from "components/Home/TopFactories/FactoryCard";

export default function FactoryCardParent(props) {
  let {
    factoryitem,
    currentUserData,
    handleUserClickValidation1,
    handleUserClickValidLogin,
    handleQuestionMarkClick,
    handleBtnCheckIfProductExisit,
  } = props;
  let navigate = useNavigate();

  function DirectToFactoryPage(factoryId, factoryName) {
    navigate(`/factoryPage/${factoryId}-${factoryName}`);
  }
  return (
    <div className="card " key={factoryitem?.id}>
      {factoryitem?.images?.length > 0 ? (
        <div className="container p-0 m-0">
          <Link
            className="cursor"
            to={`/factoryPage/${factoryitem.id}-${factoryitem.name}`}
          >
            <BannerSlider factoryitem={factoryitem} />
          </Link>
        </div>
      ) : (
        <Link
          className="cursor "
          to={`/factoryPage/${factoryitem.id}-${factoryitem.name}`}
        >
          <img
            src={`handleImageError`}
            className="sliderImg w-100"
            alt={`no Slider available`}
            onError={handleImageError}
          />
        </Link>
      )}

      <div className="card-body cardBody ">
        <div className="subCard">
          <FactoryCard
            factoryitem={factoryitem}
            DirectToFactoryPage={DirectToFactoryPage}
          />

          {/*  product slider*/}
          <div className="profile-img w-100  ">
            {factoryitem?.productLength > 0 && (
              <ProductCarousel factoryitem={factoryitem} />
            )}
          </div>

          {/* <div className="subText w-100 "> */}
          {/* <div className="text-truncate"> */}
          <p className="text-truncate fs-12 fw-600 mb-0 lh-normal w-100">
            products:
            <span className="fw-normal">
              {factoryitem?.productLength > 0
                ? factoryitem?.productData?.map((item) => ` ${item?.name} ,`)
                : " none"}
            </span>
          </p>
          {/* </div> */}
          {/* </div> */}

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
                    className="fa-regular fa-comments fa-2x"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                </div>
              )}
            </div>

            {/* pop up btn */}
            <DropdownActionBtnsFactory
              currentUserData={currentUserData}
              factoryitem={factoryitem}
              BtnDescription={BtnDescription}
              handleBtnCheckIfProductExisit={handleBtnCheckIfProductExisit}
              handleUserClickValidation1={handleUserClickValidation1}
              handleQuestionMarkClick={handleQuestionMarkClick}
              handleUserClickValidLogin={handleUserClickValidLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
