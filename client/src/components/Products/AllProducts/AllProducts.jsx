import "./AllProducts.css";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import PropTypes from "prop-types";
// shared components
import Loading from "components/Loading/Loading";
// sub components
import Header from "components/main/Header/Header";
import LeftSideFilter from "./LeftSideFilter";
import SearchSortFilter from "./SearchSortFilter";
import ProductCard from "./ProductCard";
import PublicPaginate from "components/Shared/PublicPaginate";
import DefaultUserNotAuthorizedModal from "components/ActionMessages/FormAccessControl/DefaultUserNotAuthorizedModal";
import { useAppTranslation } from "config";

function AllProducts(props) {
  let {
    allProductsData,
    apiLoadingData,
    setFilter,
    filter,
    setPagination,
    pagination,
    modalShow,
    setModalShow,
    isLoggedReDirect,
    setisLoggedReDirect,
    headerTitle,
  } = props;
  document.title = "Product Marketplace";
  const { trans: t } = useAppTranslation();

  return (
    <>
      {/* validation methods */}

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
        // userType="User"
        // goToPath="CompanyDetails"
        goToPath="userType"
      />

      <Header title={headerTitle} />

      <div className="container">
        <section className="    home-padding-y all-products margin-sm-screen ">
          <div className="container p-0 ">
            <div className="d-flex justify-content-between  row  ">
              <div className="col-xxl-3 col-xl-3  col-lg-5 col-md-5 col-sm-5 col-5  col-sm-d-none ">
                <LeftSideFilter setFilter={setFilter} filter={filter} />
              </div>
              <div className="col-xxl-9 col-xl-9 col-lg-7 col-md-7 col-sm-7 col-12 col-100 ">
                <SearchSortFilter setFilter={setFilter} filter={filter} />

                {apiLoadingData?.loadingPage ? (
                  <>
                    {apiLoadingData?.errorCausedMsg ? (
                      <div className="col-12 w-100 text-center mt-5 pt-5">
                        {apiLoadingData?.errorCausedMsg}
                      </div>
                    ) : (
                      <div className="col-12 w-100 d-flex justify-content-center">
                        <Loading />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="row products-gap">
                    {allProductsData?.length == 0 && (
                      <>
                        <span></span>

                        <p
                          dangerouslySetInnerHTML={{
                            __html: t(
                              "translation:searchResult.noItemsMessage"
                            ),
                          }}
                          className="f-15 py-5 text-center"
                        />
                        <span></span>
                      </>
                    )}

                    {allProductsData?.map((productItem, productIndex) => (
                      <div
                        key={productIndex}
                        className="col-xxl-4 col-xl-4  col-lg-6  col-12  "
                      >
                        <ProductCard
                          productItem={productItem}
                          productIndex={productIndex}
                          setisLoggedReDirect={setisLoggedReDirect}
                          setModalShow={setModalShow}
                          modalShow={modalShow}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <PublicPaginate
            pagination={pagination}
            setPagination={setPagination}
          />
        </section>
      </div>
    </>
  );
}

export default AllProducts;

AllProducts.propTypes = {
  headerTitle: PropTypes.string,
};

AllProducts.defaultProps = {
  headerTitle: "All Products",
};
