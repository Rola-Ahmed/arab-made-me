import { useState } from "react";
import "../Factories.css";
import useCountries from "hooks/useCountries";
import Loading from "components/Loading/Loading";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useFetchSectors } from "hooks/useFetchSectors";
import HandleUsersBtnAccess, {
  handleIsLoggedInBtn,
} from "utils/actionBtns/HandleUsersBtnAccess";
import {
  updateUrlParamString,
  UpdateUrlParamArray,
} from "utils/updateUrlParams";

import Header from "components/main/Header/Header";
import { useNavigate } from "react-router-dom";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";

import DescritionPopUp from "components/Shared/DescritionPopUp";
import { useAppTranslation } from "config.js";

// static variabls
import PublicPaginate from "components/Shared/PublicPaginate";
import FactoryCardParent from "components/Home/TopFactories/Shared/FactoryCardParent";
import { useFetchFactories } from "./useFetchFactories";

export default function TopFactories() {
  document.title = "Factory Gallery";
  const {
    allFactoriesData,
    setFilter,
    pagination,
    filter,
    setPagination,
    apiLoadingData,
    isLogin,
    currentUserData,
  } = useFetchFactories();

  let { allSectors } = useFetchSectors();
  const { trans: t } = useAppTranslation();
  const countriesMiddleEast = useCountries();

  // let location = useLocation();
  let navigate = useNavigate();

  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [description, setDescription] = useState("");
  const [isLoggedReDirect, setisLoggedReDirect] = useState([]);

  let [factoryHasProduct, setFactoryHasProduct] = useState({
    status: false,
    location: "",
  });

  function updateSectorFilter(value, keyword) {
    const sectorArr = [...filter.filterBySector];
    // Ensure value is the correct type (e.g., number)
    const numericValue = Number(value);
    const index = sectorArr.indexOf(numericValue);

    if (index > -1) {
      sectorArr.splice(index, 1);
    } else {
      sectorArr.push(numericValue);
    }

    setFilter((prev) => ({ ...prev, [keyword]: sectorArr }));
    UpdateUrlParamArray(keyword, sectorArr);
  }

  function updateOtherFilters(value, keyword) {
    setFilter((prev) => ({ ...prev, [keyword]: value }));

    updateUrlParamString(keyword, value);
  }
  const handleQuestionMarkClick = (desc) => {
    setDescription(desc);
  };

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

  const renderModal = (Component, show, hideHandler, destination, userType) => (
    <Component
      show={show}
      onHide={hideHandler}
      {...(destination && { destination })}
      {...(userType && { userType })}
    />
  );

  return (
    <>
      {renderModal(
        IsLoggedIn,
        modalShow.isLogin,
        () => setModalShow((prev) => ({ ...prev, isLogin: false })),
        isLoggedReDirect,
        ""
      )}
      {renderModal(
        ImporterUnVerified,
        modalShow.isImporterVerified,
        () => setModalShow((prev) => ({ ...prev, isImporterVerified: false })),
        "",
        ""
      )}
      {renderModal(
        UserNotAuthorized,
        modalShow.isFactoryVerified,
        () => setModalShow((prev) => ({ ...prev, isFactoryVerified: false })),
        "",
        "Buyer"
      )}

      <Header title={t("translation:factories")} />

      <section className="pt-5  margin-sm-screen">
        <div className="container mb-5   ">
          <div className="row m-0 p-0">
            <div className=" col-xxl-10 col-xl-10  col-lg-10  col-md-9  col-sm-9  col-9  ">
              <input
                type="text"
                className="in h-25 overflow-hidden  w-100 rounded-3 border w-100"
                placeholder="Search here"
                defaultValue={filter?.filterSearch}
                id="searchTermSecotr"
                name="searchTermSecotr"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateOtherFilters(e.target.value, "filterSearch");
                  }
                }}
              />
            </div>
            <div className=" col-xxl-2 col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3 ">
              <button
                type="button"
                className="filt-btn h-25 rounded-3 border-0 bg-main  text-white w-100 fs-16-semi  m-auto"
                onClick={(_e) => {
                  let value = document?.getElementById("searchTermSecotr")
                    ?.value;

                  updateOtherFilters(value, "filterSearch");
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="fo3 margin-sm-screen">
        <div className="container factories  overflow-hidden pe-0">
          <div className="row w-100">
            <div
              className="  
            col-xxl-3 col-xl-3  col-lg-5 col-sm-4 col-sm-d-none "
            >
              <div className="filters">
                <div className="filter-country">
                  <p className="filter-text">Country</p>
                  <div className="country-filters countries scroll">
                    <div className="form-check">
                      <input
                        onClick={(e) =>
                          updateOtherFilters(
                            e?.target?.value,
                            "filterByCountry"
                          )
                        }
                        className="form-check-input "
                        type="radio"
                        name="country"
                        id="country"
                        value=""
                        defaultChecked
                        checked={filter?.filterByCountry == ""}
                      />
                      <label className="form-check-label w-100">{`All`}</label>
                    </div>

                    {countriesMiddleEast?.map((item) => (
                      <div className="form-check">
                        <input
                          onClick={(e) =>
                            updateOtherFilters(
                              e?.target?.value,
                              "filterByCountry"
                            )
                          }
                          className="form-check-input cursor"
                          type="radio"
                          name="country"
                          id="country"
                          value={item.code}
                          checked={filter?.filterByCountry === item.code}
                        />
                        <label className="form-check-label w-100">
                          {item.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-line"></div>

                <div className="filter-country ">
                  <p className="filter-text">Sector</p>
                  <div className="country-filters sectors ">
                    {allSectors?.map((sectorItem) => (
                      <div className="form-check ">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="sector"
                          id="sector"
                          value={sectorItem.id}
                          onClick={(e) =>
                            updateSectorFilter(
                              e?.target?.value,
                              "filterBySector"
                            )
                          }
                          defaultChecked={filter?.filterBySector?.find(
                            (element) => element == sectorItem.id
                          )}
                        />
                        <label className="form-check-label w-100">
                          {t(`sectors:sectors.${sectorItem?.name}`)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-line"></div>
              </div>
            </div>
            <div
              className="
              col-xxl-9 col-xl-9   col-lg-7 col-md-7 col-sm-8 col-xs-12 p-0  "
            >
              {apiLoadingData?.loadingPage ? (
                <>
                  {apiLoadingData?.errorCausedMsg ? (
                    <p className="fs-15 text-muted  mx-auto mt-5 pt-5 w-fit-content ">
                      {apiLoadingData?.errorCausedMsg}
                    </p>
                  ) : (
                    <div className="justify-items-center">
                      <Loading />
                    </div>
                  )}
                </>
              ) : (
                // <div className="factoryCard   ">
                <div className="row gap  row-gap-24  w-100 me-0">
                  {allFactoriesData?.length === 0 ? (
                    <>
                      <span></span>{" "}
                      <p className="fs-15 text-center m-auto">
                        {t("translation:searchResult.noItemsMessage1")}
                        <br />
                        {t("translation:searchResult.noItemsMessage2")}
                      </p>
                      <span></span>
                    </>
                  ) : (
                    <>
                      {allFactoriesData?.map((factoryitem, _factoryindex) => (
                        <div
                          className="  
                        col-xxl-4 col-xl-4  col-lg-6 col-12 pe-0 "
                        >
                          <FactoryCardParent
                            factoryitem={factoryitem}
                            currentUserData={currentUserData}
                            handleUserClickValidation1={
                              handleUserClickValidation1
                            }
                            handleUserClickValidLogin={
                              handleUserClickValidLogin
                            }
                            handleQuestionMarkClick={handleQuestionMarkClick}
                            handleBtnCheckIfProductExisit={
                              handleBtnCheckIfProductExisit
                            }
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* </div> */}
        </div>

        <PublicPaginate pagination={pagination} setPagination={setPagination} />
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
            <Modal.Title>Factory Has No Products Yet</Modal.Title>
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
                      `privatelabel?${factoryHasProduct.location} `
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
