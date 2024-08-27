import { useEffect, useState, useContext } from "react";
import "../Factories.css";
import { countriesMiddleEast } from "constants/countries";
import Loading from "components/Loading/Loading";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useFetchSectors } from "hooks/useFetchSectors";
import HandleUsersBtnAccess, {
  handleIsLoggedInBtn,
  // handleButtonClick
} from "utils/actionBtns/HandleUsersBtnAccess";

import Header from "components/main/Header/Header";
import { useNavigate, useLocation } from "react-router-dom";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import DescritionPopUp from "components/Helpers/DescritionPopUp";

// static variabls
import PublicPaginate from "components/Shared/PublicPaginate";
import FactoryCardParent from "components/Home/TopFactories/Shared/FactoryCardParent";

export default function TopFactories(props) {
  let {
    allFactoriesData,
    setFilter,
    pagination,
    filter,
    setPagination,
    apiLoadingData,
  } = props;
  document.title = "Factory Gallery";
  let { allSectors } = useFetchSectors();

  let location = useLocation();
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [description, setDescription] = useState("");

  let [factoryHasProduct, setFactoryHasProduct] = useState({
    status: false,
    location: "",
  });

  const [isLoggedReDirect, setisLoggedReDirect] = useState([]);

  function SelectedfFlters(value, keyword) {
    let sectorArr = filter.filterBySector;

    if (keyword == "filterBySector") {
      // check if the value aleady exisit then remove it
      // if not then add it to the array

      const index = sectorArr.indexOf(value);
      if (index > -1) {
        sectorArr.splice(index, 1);
      } else {
        sectorArr.push(value);
      }

      setFilter((prevValue) => ({
        ...prevValue,
        [keyword]: sectorArr,
      }));
    } else {
      setFilter((prevValue) => ({
        ...prevValue,
        [keyword]: value,
      }));
    }

    let sectorVal = sectorArr.length > 0 ? sectorArr : "";

    // Get the current URL
    let currentUrl = window.location.href;
    const paramName = keyword;
    const paramValue = keyword == "filterBySector" ? sectorVal : value;

    if (paramValue !== "" || filter?.filterBySector?.length > 0) {
      // Create or update the parameter
      const paramRegex = new RegExp(`([?&])${paramName}=.*?(&|$)`);
      if (paramRegex.test(currentUrl)) {
        // If the parameter already exists, update its value
        currentUrl = currentUrl.replace(
          paramRegex,
          `$1${paramName}=${paramValue}$2`
        );
      } else {
        // If the parameter doesn't exist, add it
        currentUrl += currentUrl.includes("?")
          ? `&${paramName}=${paramValue}`
          : `?${paramName}=${paramValue}`;
      }
    } else {
      // if value is empty then remove the parameter
      const paramRegex = new RegExp(`([?&])${paramName}=.*?(&|$)`);
      currentUrl = currentUrl.replace(paramRegex, "$2");
    }
    // Update the browser's address bar
    window.history.replaceState({}, document.title, currentUrl);
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

  const updateUrl = (filterSeacrh = "") => {
    const queryParams = new URLSearchParams();
    const oldUrl = `${window.location.pathname}`;

    if (filterSeacrh != "") {
      queryParams.set("filterSearch", filterSeacrh);
    } else {
      window.history.replaceState(null, "", oldUrl);
    }

    // if (filters?.filterBypartner != "") {
    //   queryParams.set("filter", filters.filterBypartner);
    // }

    const queryString = queryParams.toString();
    const newUrl = `${window.location.pathname}?${queryString}`;
    // Replace the current state in the history without triggering a navigation

    window.history.replaceState(null, "", newUrl);
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

      <Header title="All Factories" />

      <section className="pt-5  margin-sm-screen">
        <div className="container mb-5   ">
          <div className="row m-0 p-0">
            <div className=" col-xxl-10 col-xl-10  col-lg-10  col-md-9  col-sm-9  col-9  ">
              <input
                type="text"
                className="in h-25 overflow-hidden  w-100 rounded-3 border w-100"
                placeholder="Search here"
                // value={searchTermSecotr}
                defaultValue={filter?.filterSearch}
                id="searchTermSecotr"
                name="searchTermSecotr"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    SelectedfFlters(e.target.value, "filterSearch");
                    updateUrl(e.target.value);
                  }
                }}
              />
            </div>
            <div className=" col-xxl-2 col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3 ">
              <button
                type="button"
                className="filt-btn h-25 rounded-3 border-0 bg-main  text-white w-100 fs-16-semi  m-auto"
                // onClick={() => clearFilters()}
                onClick={(e) => {
                  // if (e.key === "Enter") {

                  let value = document?.getElementById("searchTermSecotr")
                    ?.value;

                  SelectedfFlters(value, "filterSearch");
                  updateUrl(value);
                  //
                  // }
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
                          SelectedfFlters(e?.target?.value, "filterByCountry")
                        }
                        className="form-check-input "
                        type="radio"
                        name="country"
                        id="country"
                        value=""
                        defaultChecked
                        checked={filter?.filterByCountry === ""}
                      />
                      <label className="form-check-label w-100">{`All`}</label>
                    </div>

                    {countriesMiddleEast?.map((item) => (
                      <div className="form-check">
                        <input
                          onClick={(e) =>
                            SelectedfFlters(e?.target?.value, "filterByCountry")
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
                            SelectedfFlters(e?.target?.value, "filterBySector")
                          }
                          defaultChecked={filter?.filterBySector?.find(
                            (element) => element == sectorItem.id
                          )}
                        />
                        <label className="form-check-label w-100">
                          {sectorItem.name.replace(/\bIndustry\b/gi, "")}
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
              col-xxl-9 col-xl-9   col-lg-7 col-md-7 col-sm-8 col-xs-12 p-0
            "
            >
              {apiLoadingData?.loadingPage ? (
                <>
                  <div className="col-12 w-100">
                    {apiLoadingData?.errorCausedMsg ? (
                      <p className="fs-5 text-muted fw-bolder text-5 mt-5 pt-5">
                        {apiLoadingData?.errorCausedMsg}
                      </p>
                    ) : (
                      <Loading />
                    )}
                  </div>
                </>
              ) : (
                // <div className="factoryCard   ">
                <div className="row gap  row-gap-24  w-100 me-0">
                  {allFactoriesData?.length === 0 ? (
                    <>
                      <span></span>{" "}
                      <p className="h3 text-center m-auto">
                        {" "}
                        No records Found{" "}
                      </p>
                      <span></span>
                    </>
                  ) : (
                    <>
                      {allFactoriesData?.map((factoryitem, factoryindex) => (
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
