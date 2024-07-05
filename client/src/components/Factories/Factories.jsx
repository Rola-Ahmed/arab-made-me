import React, { useEffect, useState, useContext } from "react";
import "./Factories.css";
import { countriesMiddleEast } from "constants/countries";
import { handleImageError } from "utils/ImgNotFound";
import Loading from "components/Loading/Loading";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import CustomSlider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Header from "components/main/Header/Header";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerifiedModal/ImporterUnVerifiedModal";
import UserNotAuthorized from "components/ActionMessages/UserNotAuthorized/UserNotAuthorized";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import DescritionPopUp from "components/Helpers/DescritionPopUp";

// static variabls
import { BtnDescription } from "constants/BtnDescription";

export default function TopFactories() {
  document.title = "Factory Gallery";

  let location = useLocation();
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const filterSearch = searchParams.get("filterSearch");
  const filterByCountry = searchParams.get("filterByCountry");
  const filterBySector = searchParams.get("filterBySector");
  const filterByCategory = searchParams.get("filterByCategory");

  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [description, setDescription] = useState("");

  const [filter, setFilter] = useState({
    filterSearch:
      location?.state?.filterBy !== undefined
        ? location?.state?.filterBy
        : filterSearch ?? "",
    filterByCountry: filterByCountry ?? "",
    filterBySector: filterBySector?.split(",")?.map(String) ?? [],
    filterByCategory: filterByCategory ?? "",
  });
  const [allsSectors, setAllSectors] = useState([]);
  const [allsCategories, setAllCategories] = useState([]);
  const [apiLoadingData, setApiLoadingData] = useState({
    sectors: false,
    categories: false,
    factories: true,
  });
  let [factoryHasProduct, setFactoryHasProduct] = useState({
    status: false,
    location: "",
  });
  const [allFactoriesData, setAllFactoriesData] = useState([]);
  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 9,
    currentPage: 1,
    totalPage: 1,
    // totalPage: Math.ceil((allProductsData?.length) /pagination.displayProductSize), // Use 30 as the default display size
  }));

  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );

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

  // fetch api
  async function fetchSectors() {
    try {
      const response = await axios.get(`${baseUrl}/sectors?size=10`);

      if (response.data.message === "done") {
        setAllSectors(response.data.sectors);
      }
    } catch (error) {}
  }
  async function fetchCategories() {
    try {
      const response = await axios.get(`${baseUrl}/categories?size=10`);

      if (response.data.message === "done") {
        setAllCategories(response.data.categories);
      }
    } catch (error) {}
  }

  async function fetchFactoriesData() {
    // when i re-render
    setApiLoadingData((prevData) => ({
      ...prevData,
      factories: true,
    }));
    try {
      const response1 = await axios.get(
        `${baseUrl}/factories?filter=${filter?.filterSearch}&location=${filter?.filterByCountry}`,
        {
          data: {
            sectors: filter?.filterBySector,
            // categoreis: [filter?.filterByCategory],
          },
        }
      );

      if (response1.data.message === "done") {
        setPagination((prevValue) => ({
          ...prevValue,
          totalPage: Math.ceil(
            (response1.data.factories.length || 0) /
              prevValue.displayProductSize
          ),
        }));
      }

      let config = {
        method: "get",
        url: `${baseUrl}/factories/?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&filter=${filter?.filterSearch}&location=${filter?.filterByCountry}`,
        params: {
          data: {
            sectors: filter?.filterBySector,
            // categoreis: [filter?.filterByCategory],
          },
        },
      };

      const response = await axios.request(config);
      if (response.data.message === "done") {
        setAllFactoriesData(
          response.data.factories.filter((item) => item?.factoryId !== null)
        );
        const uniqueIds = [
          ...new Set(
            response.data.factories
              .map((obj) => obj.id) // Extract all factoryIds
              .filter((id) => id !== null) // Filter out null values
          ),
        ];

        setUniqueFactoryIDofProducts(uniqueIds);

        setApiLoadingData((prevData) => ({
          ...prevData,
          factories: false,
        }));
      }
    } catch (error) {}
  }
  const getFactoryProduct = async (factoryId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/factories/products/${factoryId}?size=7`
      );

      let productCoverImg = [];
      let productName = [];

      response.data.products.map((item) => {
        if (item.coverImage !== null) {
          productCoverImg.push(item.coverImage);
        }
        productName.push(item.name);
      });

      setAllFactoriesData((prevData) =>
        prevData.map((item) =>
          item?.id === factoryId
            ? {
                ...item,
                productCoverImg: productCoverImg,
                productName: productName,
                productLength: response.data.products?.length,
              }
            : item
        )
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchFactoriesData();
  }, [pagination?.currentPage, filter]);
  useEffect(() => {
    fetchSectors();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (uniqueFactoryIDofProducts !== null) {
      uniqueFactoryIDofProducts?.map((factoryId) => (
        <>{getFactoryProduct(factoryId)}</>
      ));
    }
  }, [uniqueFactoryIDofProducts]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pagination?.currentPage]);

  // slider setting
  const settings = {
    dots: true,
    fade: true,
    appendDots: (dots) => (
      <div
        style={{
          height: "1rem",
          bottom: "1.5rem",
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          top: "10rem",
          zIndex: 1,
        }}
      >
        {dots}
      </div>
    ),

    focusOnSelect: true,
  };

  const handleQuestionMarkClick = (desc) => {
    setDescription(desc);
    // setModalShow((prevVal) => ({
    //   ...prevVal,
    //   displayDescr: true,
    // }));
  };

  const handlePageClick = (currentPage) => {
    // why plus 1 bec react pagination library reads the 1st page with index 0 but in api  is read with index 1
    setPagination((prevValue) => ({
      ...prevValue,
      currentPage: currentPage.selected + 1,
    }));
  };

  function ToFactoryPageBtn(factoryId, factoryName) {
    navigate(`/factoryPage/${factoryId}-${factoryName}`);
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
      return;
    }

    if (currentUserData?.factoryId !== null) {
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

  function handleIsLoggedInBtn(loginPath) {
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

  return (
    <>
      {/* <Chat
  chatbotID="eq4ITqiyzqPFMD_yoUupk"
// chatbotID="Ug7MtEeBWGd69-VCJk3bL"
  

  theme="dark"
  orientation="left"
  headline="Chat with our AI"

  onReady={() => {
    // console.log('Chatbot is ready!');
  }}
  onError={(error) => {
    console.error('Something went wrong: ' + error);
  }} 
/>*/}

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

      <Header title="All Factories" subTitle="Factories" />

      <section className="fo2  margin-sm-screen">
        <div className="container search-bar   ">
          <div className="row">
            <div className=" col-xxl-10 col-xl-10  col-lg-10  col-md-9  col-sm-9  col-9  ">
              <input
                type="text"
                className="in w-100"
                placeholder="Search here"
                // value={searchTermSecotr}
                id="searchTermSecotr"
                name="searchTermSecotr"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    SelectedfFlters(e.target.value, "filterSearch");
                  }
                }}
              />
            </div>
            <div className=" col-xxl-2 col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3 ">
              <button
                type="button"
                className="filt-btn allproducts text-white w-100"
                // onClick={() => clearFilters()}
                onClick={(e) => {
                  if (e.key === "Enter") {
                    SelectedfFlters(e.target.value, "filterSearch");
                  }
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="fo3 margin-sm-screen">
        <div className="container factories  overflow-hidden">
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

                    {countriesMiddleEast.map((item) => (
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
                    {allsSectors.map((sectorItem) => (
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

                {/* <div className="filter-country">
                  <p className="filter-text">Categories</p>
                  <div className="cat-filterssss">
                    <div
                      className={`cat-filter-2 cursor  ${
                        filter.filterByCategory == "" ? "active" : ""
                      }`}
                    >
                      <p
                        onClick={(e) => SelectedfFlters("", "filterByCategory")}
                        name="category"
                        id="category"
                        className={`cat-filter-text `}
                        value=""
                      >
                        {`  All `}
                      </p>
                    </div>
                    {allsCategories.map((categoryItem) => (
                      <div className="cat-filterssss-1">
                        <div
                          className={`cat-filter-2 cursor  ${
                            filter.filterByCategory == categoryItem.id
                              ? "active"
                              : ""
                          }`}
                        >
                          <p
                            onClick={(e) =>
                              SelectedfFlters(
                                categoryItem.id,
                                "filterByCategory"
                              )
                            }
                            name="category"
                            id="category"
                            className={`cat-filter-text `}
                          >
                            {categoryItem.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
            <div
              className="
              col-xxl-9 col-xl-9   col-lg-7 col-md-7 col-sm-8 col-xs-12
            "
            >
              {apiLoadingData?.factories ? (
                <div className="col-12 w-100">
                  <Loading />
                </div>
              ) : (
                // <div className="factoryCard ">
                <div className="row gap  w-100">
                  {allFactoriesData.length === 0 ? (
                    <>
                      <span></span> <p className="h3 "> No record </p>
                      <span></span>
                    </>
                  ) : (
                    allFactoriesData.map((factoryitem, factoryindex) => (
                      <div
                        className="  
                      col-xxl-4 col-xl-4  col-lg-6 col-12"
                      >
                        <div
                          // className="card height  mobile-w container"
                          className="card height  mobile-w "
                          key={factoryindex}
                        >
                          {factoryitem?.images?.length > 0 ? (
                            <CustomSlider {...settings}>
                              {factoryitem?.images?.map((item, index) => (
                                <img
                                  onClick={() =>
                                    ToFactoryPageBtn(
                                      factoryitem?.id,
                                      factoryitem?.name
                                    )
                                  }
                                  src={`${baseUrl_IMG}/${item}`}
                                  className="sliderImg cursor"
                                  alt={`slide ${item} `}
                                  onError={handleImageError}
                                />
                              ))}
                            </CustomSlider>
                          ) : (
                            <img
                              onClick={() =>
                                ToFactoryPageBtn(
                                  factoryitem?.id,
                                  factoryitem?.name
                                )
                              }
                              src={`handleImageError`}
                              className="sliderImg cursor"
                              alt={`no image `}
                              onError={handleImageError}
                            />
                          )}

                          <div className="card-body cardBody">
                            <div className="subCard ">
                              <div
                                className="card-title d-flex w-100 cursor"
                                onClick={() =>
                                  ToFactoryPageBtn(
                                    factoryitem?.id,
                                    factoryitem?.name
                                  )
                                }
                              >
                                <div className="imgLogo">
                                  <img
                                    className={`m-0 p-0 w-100 h-100 borderContainer`}
                                    src={`${baseUrl_IMG}/${factoryitem?.coverImage}`}
                                    alt={`slide ${factoryindex} `}
                                    onError={handleImageError}
                                  />
                                </div>
                                <div className="title  fac">
                                  <h2 className=" text-truncate">
                                    {factoryitem?.name}
                                  </h2>

                                  <p>
                                    {`${
                                      factoryitem?.city
                                        ? factoryitem?.city + ", "
                                        : ""
                                    }`}
                                    {factoryitem?.country ?? ""}
                                  </p>
                                </div>
                              </div>
                              {/* <span className="dashed-line"></span> */}
                              <div
                                className="subText w-100 cursor "
                                onClick={() =>
                                  ToFactoryPageBtn(
                                    factoryitem?.id,
                                    factoryitem?.name
                                  )
                                }
                              >
                                <div className="text-truncate">
                                  <p className="text-truncate">
                                    products:
                                    <span>
                                      {factoryitem?.productName?.length > 0
                                        ? factoryitem?.productName?.map(
                                            (item) => ` ${item} ,`
                                          )
                                        : " none"}
                                    </span>
                                  </p>
                                </div>
                                <div>
                                  <p className="title fac">
                                    Export History:
                                    <span>
                                      {factoryitem?.importingCountries?.length >
                                      0
                                        ? factoryitem?.importingCountries?.map(
                                            (item) => ` ${item} ,`
                                          )
                                        : " none"}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              <div className="profile-img w-100">
                                {factoryitem?.productCoverImg?.length > 0 ? (
                                  // <CustomSlider {...settings}>
                                  // {
                                  factoryitem?.productCoverImg?.map(
                                    (item, index) => (
                                      <div className="subProfileCont">
                                        <img
                                          src={`${baseUrl_IMG}/${item}`}
                                          className="w-100 h-100"
                                          alt={`slide ${item} `}
                                          onError={handleImageError}
                                        />
                                      </div>
                                    )
                                  )
                                ) : (
                                  // }
                                  // {/* </CustomSlider> */}
                                  <div className="subProfileCont"></div>
                                )}
                              </div>

                              <div className="d-flex justify-content-between align-items-center   w-100">
                                <div className="call-btns d-flex justify-content-between  align-items-center w-100  pe-2">
                                  <button
                                    className="btn-call-1  cursor "
                                    onClick={() => {
                                      handleButtonClick(
                                        `privatelabel?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name} `
                                      );

                                      // return
                                    }}
                                  >
                                    <div className="btn-text text-decoration-none cursor text-white">
                                      Private Label Request
                                    </div>
                                  </button>

                                  <div
                                    className=" btn-call-2 padd text-dark text-decoration-none cursor"
                                    onClick={() => {
                                      handleIsLoggedInBtn(
                                        `contactsupplier?userId=${factoryitem?.userId}&factoryName=${factoryitem?.name}`
                                      );
                                    }}
                                  >
                                    <i class="fa-regular fa-comments fa-2x"></i>
                                  </div>
                                </div>

                                <div className=" text-dark text-decoration-none cursor">
                                  <i class=" ellipsis  fa-solid fa-ellipsis-vertical "></i>

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
                                              `CustomerProductReq?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`
                                            );
                                          }}
                                        >
                                          <p className="cursor">
                                            Custom Product Request
                                          </p>
                                        </div>
                                        <button
                                          className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                                          title={
                                            BtnDescription.customProductRequest
                                          }
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
                                            if (
                                              factoryitem?.productLength == 0
                                            ) {
                                              setFactoryHasProduct({
                                                status: true,
                                                location: `factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`,
                                              });
                                              return;
                                            }
                                            handleButtonClick(
                                              `sendrfq?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`,
                                              "ToSendRFQ"
                                            );
                                          }}
                                        >
                                          <p className={`cursor`}>Send RFQ</p>
                                        </button>
                                        <button
                                          className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                                          title={BtnDescription.RFQ}
                                          onClick={() => {
                                            handleQuestionMarkClick(
                                              BtnDescription.RFQ
                                            );
                                          }}
                                        ></button>
                                      </div>
                                      <div className="d-flex align-items-center gap-2">
                                        <button
                                          className={`text-container `}
                                          onClick={() => {
                                            if (
                                              factoryitem?.productLength == 0
                                            ) {
                                              setFactoryHasProduct({
                                                status: true,
                                                location: `factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`,
                                              });
                                              return;
                                            }
                                            handleButtonClick(
                                              `purchasingOrder/fromfactory?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`,
                                              "ToPurchasingOrder"
                                            );
                                          }}
                                        >
                                          <p className="cursor">Send PO</p>
                                        </button>
                                        <button
                                          className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                                          title={BtnDescription.PO}
                                          onClick={() => {
                                            handleQuestionMarkClick(
                                              BtnDescription.PO
                                            );
                                          }}
                                        ></button>
                                      </div>
                                      <div className="d-flex align-items-center gap-2">
                                        <button
                                          className="text-container "
                                          onClick={() => {
                                            handleIsLoggedInBtn(
                                              `contactsupplier?userId=${factoryitem?.userId}&factoryName=${factoryitem?.name}`
                                            );
                                          }}
                                        >
                                          <p className="cursor">
                                            Contact Supplier
                                          </p>
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
                                              `requestVisit?factoryId=${factoryitem?.id}&factoryName=${factoryitem?.name}`
                                            );
                                          }}
                                        >
                                          <p className="cursor">
                                            Factory Visit Request
                                          </p>
                                        </div>
                                        <button
                                          className="fa-solid fa-circle-question cursor bg-white border-0 p-0"
                                          title={
                                            BtnDescription.factoryVisitRequest
                                          }
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
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* </div> */}
        </div>

        <ReactPaginate
          previousLabel={<i className="fa-solid fa-arrow-left"></i>}
          nextLabel={<i className="fa-solid fa-arrow-right"></i>}
          pageCount={pagination?.totalPage ?? 1} // total number to pages
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          forcePage={0}
          onPageChange={handlePageClick}
          containerClassName="pagination align-items-center justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeClassName="active"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          previousClassName="page-item "
          previousLinkClassName="page-link arrow-link-color margin-prev"
          nextClassName="page-item "
          nextLinkClassName="page-link arrow-link-color margin-next"
          navClassName="pagination-custom"
        />
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
                    handleButtonClick(
                      `CustomerProductReq?${factoryHasProduct.location}&productName=CreateYourOwnBrand `,
                      "ToCustomerProductReq"
                    );

                    // return
                  }}
                >
                  <p className="cursor "> Custom Product Request</p>
                </Button>
                <button
                  className="btn-edit border bg-white "
                  onClick={() => {
                    handleButtonClick(
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
