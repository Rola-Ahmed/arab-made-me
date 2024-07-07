import "./AllProducts.css";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";

// shared components
import Loading from "components/Loading/Loading";
// sub components
import Header from "components/main/Header/Header";
import LeftSideFilter from "./LeftSideFilter";
import SearchSortFilter from "./SearchSortFilter";
import ProductCard from "./ProductCard";
import PublicPaginate from "components/Shared/PublicPaginate";

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
  } = props;
  document.title = "Product Marketplace";

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

      <Header title="All Products" />

      <div className="container">
        <section className="  products-section all-products margin-sm-screen ">
          <div className="container p-0 ">
            <div className="d-flex justify-content-between  row  ">
              <div className="col-xxl-3 col-xl-3  col-lg-5 col-md-5 col-sm-5 col-5  col-sm-d-none   ">
                <LeftSideFilter setFilter={setFilter} filter={filter} />
              </div>
              <div className="col-xxl-9 col-xl-9 col-lg-7 col-md-7 col-sm-7 col-12 col-100 ">
                <SearchSortFilter setFilter={setFilter} filter={filter} />

                {apiLoadingData === false ? (
                  <Loading />
                ) : (
                  <div className="row products-gap">
                    {allProductsData.length === 0 && (
                      <>
                        <span></span>
                        <p className="h3 py-5 text-center ">No records</p>
                        <span></span>
                      </>
                    )}

                    {allProductsData?.map((productItem, productIndex) => (
                      <ProductCard
                        productItem={productItem}
                        productIndex={productIndex}
                        setisLoggedReDirect={setisLoggedReDirect}
                        setModalShow={setModalShow}
                        modalShow={modalShow}
                      />
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
