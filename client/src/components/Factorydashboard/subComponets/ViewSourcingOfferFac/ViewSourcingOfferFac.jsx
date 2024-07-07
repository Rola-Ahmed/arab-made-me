import React, { useEffect, useState, useContext } from "react";

// shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FactoryUnVerifiedModal from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";

export default function ViewSourcingOfferFac() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  let navigate = useNavigate();

  const [allprivateLabelData, setAllprivateLabelData] = useState([]);
  const [apiLoadingData, setapiLoadingData] = useState(true);
  const [errorsMsg, setErrorsMsg] = useState();
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isFactoryVerified: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 8,

    currentPage: 1,
    totalPage: 1,

    // will be called by api
    // totalPage: Math.ceil((allProductsData?.length) /pagination.displayProductSize), // Use 30 as the default display size
  }));
  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );

  const [filter, setFilter] = useState({
    formsFilter: "",
    sort: "date-DESC",
    sort_name: "",
  });

  function filtterData(value, keyword, name) {
    setFilter((prevValue) => ({
      ...prevValue,
      [keyword]: value,
      ...(name && { sort_name: name }),
    }));
  }

  async function fetchFactoriesData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/factory/offers/?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);
      if (response?.data?.message == "done") {
        setAllprivateLabelData(
          response.data.offers.filter((item) => item?.factoryId !== null)
        );

        const uniqueIds = [
          ...new Set(
            response.data.offers
              .map((obj) => obj.importerId) // Extract all factoryIds
              .filter((id) => id !== null) // Filter out null values
          ),
        ];

        setUniqueFactoryIDofProducts(uniqueIds);
        setapiLoadingData(false);
      } else {
        setErrorsMsg(response?.data?.message);
      }
    } catch (error) {
      setapiLoadingData(false);
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            setErrorsMsg(error?.data?.errorMessage);
            break;
          case 401:
            setErrorsMsg(error?.response?.data?.message);
            break;
          case 403:
            setErrorsMsg(
              // error?.data?.message,
              error?.response?.data?.message
            );
            break;
          case 404:
            setErrorsMsg(
              "Not Found (404). The requested resource was not found."
            );
            break;

          case 500:
            setErrorsMsg(error?.response?.data?.errorMessage);
            break;

          //  429 Too Many Requests
          // The user has sent too many requests in a given amount of time ("rate limiting").
          case 429:
            setErrorsMsg(" Too Many Requests , Please try again later.");
            break;
          case 402:
            // 402
            setErrorsMsg(error?.response?.data?.message);
            break;
          default:
            // case message== error
            setErrorsMsg(error?.response?.data?.errorMessage);
            break;
        }
      }
    }
  }

  useEffect(() => {
    fetchFactoriesData();
  }, [pagination?.currentPage, filter]);

  // utils function
  let getMonthName = getDate;

  useEffect(() => {
    // Promise.all(
    uniqueFactoryIDofProducts.map(async (importerID) => {
      try {
        const productResponse = await axios.get(
          `${baseUrl}/importers/${importerID}`
        );

        if (productResponse.data.message === "done") {
          setAllprivateLabelData((prevData) =>
            prevData.map((value) =>
              value?.importerId === importerID
                ? {
                    ...value,
                    importerName: productResponse?.data?.importers?.name,
                    importerRepEmail:
                      productResponse?.data?.importers?.repEmail,
                    importerProfileImg:
                      productResponse?.data?.importers?.importerProfileImg,
                  }
                : value
            )
          );
        }
      } catch (error) {}
    });
  }, [apiLoadingData]);

  const downloadCsv = () => {
    const attributesToFilter = [
      "productId",
      "factoryId",
      "importerId",
      "updatedAt",
      "docs",
      "importerProfileImg",

      "preferredCountries",
      "factory",
      "categoryId",
    ];
    // ,"contactData"
    const newArray = filterAttributes(allprivateLabelData, attributesToFilter);

    // const csvData = convertToCsv(allprivateLabelData);

    const csvData = convertToCsv(newArray);

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "privateLabel.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const convertToCsv = (data) => {
    // Assuming data is an array of objects with similar structure
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
    return `${header}\n${rows}`;
  };

  const filterAttributes = (dataArray, attributesToFilter) => {
    return dataArray.map((originalObject) => {
      const filteredObject = Object.keys(originalObject)
        .filter((key) => !attributesToFilter.includes(key))
        .reduce((acc, key) => {
          acc[key] = originalObject[key];

          return acc;
        }, {});

      return filteredObject;
    });
  };

  useEffect(() => {
    const fetchDataLenght = async () => {
      try {
        const response1 = await axios.get(
          `${baseUrl}/factories/factory/offers?formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`,
          {
            headers: {
              authorization: isLogin,
            },
          }
        );

        if (response1?.data?.message === "done") {
          setPagination((prevValue) => ({
            ...prevValue,
            totalPage: Math.ceil(
              (response1.data?.offers?.length || 0) /
                prevValue.displayProductSize
            ),
          }));
        }
      } catch (error) {}
    };

    fetchDataLenght();
  }, [filter]);

  const deleteData = async (itemId) => {
    try {
      let config = {
        method: "delete",

        url: `${baseUrl}/sourcingOffers/delete/fromUser/${itemId}`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      toast("Data Deleted Successfully", {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        draggable: true,
        theme: "colored",
        type: "success",
      });

      setAllprivateLabelData((prevValue) =>
        prevValue.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      // setapiLoadingData(true);

      toast("Something went wrong, please try again later", {
        position: "top-center",
        autoClose: 5000,
        // hideProgressBar: false,
        closeOnClick: true,
        //pauseOnHover: true,
        draggable: true,
        // progress: undefined,
        theme: "colored",
        type: "error",
      });
    }
    // }
  };

  return (
    <div className="m-4 order-section ">
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

      <FactoryUnVerifiedModal
        show={modalShow.isFactoryVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isFactoryVerified: false,
          }))
        }
        userType="Factory"
      />

      <ToastContainer />

      {/* section 1 */}
      <div className="header w-100">
        <PageUtility currentPage="Factory Offers" />
        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Factory Offers</h2>

            <div className="btn-container">
              <button
                className="order-btn-1"
                onClick={downloadCsv}
                disabled={!allprivateLabelData?.length}
              >
                <i className="fa-solid fa-cloud-arrow-down"></i>
                <p className="cursor">Download CSV</p>
              </button>

              <button
                className="order-btn-2 cursor"
                onClick={() => {
                  if (
                    currentUserData?.importerId !== null &&
                    currentUserData?.importerId !== undefined
                  ) {
                    localStorage.setItem("ToHomePage", "Page Not Found");
                    navigate("/");
                    return;
                  }
                  if (
                    currentUserData?.factoryId !== null &&
                    (currentUserData?.factoryVerified === "0" ||
                      !currentUserData?.factoryEmailActivated)
                  ) {
                    setModalShow((prevVal) => ({
                      ...prevVal,
                      isFactoryVerified: true,
                    }));

                    return;
                  } else if (!isLogin) {
                    setModalShow((prevVal) => ({
                      ...prevVal,
                      isLogin: true,
                    }));

                    setisLoggedReDirect(
                      `signIn/factoryDashboard/addSourcingOffer`
                    );
                    return;
                  }

                  navigate("/factoryDashboard/addSourcingOffer");
                }}

                // onClick={() => {

                //
                //   navigate("/factoryDashboard/addProduct");
                // }}
              >
                <i className="fa-solid fa-plus"></i>
                <p className="cursor">Add</p>
              </button>
            </div>
          </div>
        </div>

        {/* search filter section */}
        <div className=" search-container d-flex justify-content-between align-items-center p-3">
          <div className="input-group width-size">
            <div
              className="input-group-prepend cursor "
              onClick={(e) => {
                let value = document.getElementById("formsFilter").value;
                filtterData(value, "formsFilter");
              }}
            >
              <span
                className="input-group-text bg-white icon-search-container pe-0"
                id="inputGroup-sizing-default"
              >
                <i className="fa-solid fa-magnifying-glass icon-search"></i>
              </span>
            </div>
            <input
              type="text"
              className="form-control input-search "
              id="formsFilter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  filtterData(e.target.value, "formsFilter");
                }
              }}
            />
          </div>

          <div className=" btn-container d-flex justify-content-between align-items-center">
            <div class="dropdown">
              <button
                className=" dropdown-toggle order-toggle d-flex justify-content-center align-items-center"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa-solid fa-filter"></i>
                <p>
                  {filter?.sort_name !== "" ? filter?.sort_name : "Sort By"}
                </p>
              </button>

              <ul class="dropdown-menu">
                <li
                  onClick={(e) => {
                    filtterData("date-DESC", "sort", "Sort By");
                  }}
                  className=" cursor text-start"
                >
                  <p className="dropdown-item">Sort By</p>
                </li>

                <li
                  onClick={(e) => {
                    filtterData("date-ASC", "sort", "Oldest");
                  }}
                  className=" cursor  text-start"
                >
                  <p className="dropdown-item">Oldest</p>
                </li>
                <li
                  onClick={(e) => {
                    filtterData("date-DESC", "sort", "Newest");
                  }}
                  className=" cursor  text-start"
                >
                  <p className="dropdown-item">Newest</p>
                </li>

                <li
                  onClick={(e) => {
                    filtterData("price-ASC", "sort", "Price :Low to High");
                  }}
                  className=" cursor  text-start"
                >
                  <a class="dropdown-item" href="#">
                    Price :Low to High
                  </a>
                </li>

                <li
                  onClick={(e) => {
                    filtterData("date-DESC", "sort", "Price :High to Low");
                  }}
                  className=" cursor  text-start"
                >
                  <a class="dropdown-item" href="#">
                    Price :High to Low
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* data section */}

        <div className=" data-container w-100 p-3">
          <table className="table mb-0">
            {/* headers */}

            <thead>
              <tr className="row">
                <th className=" col-2">
                  <div className=" th-1st-title-gap d-flex justify-content-start align-items-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                    </div>
                    Product Name
                  </div>
                </th>

                <th className=" col-4">Description</th>

                <th className=" col-1 ">Sent Date</th>
                <th className=" col-1">Price</th>

                <th className=" col-2">HSN Code</th>
                <th className=" col-1">Status</th>

                <th className=" col-1"></th>
              </tr>
            </thead>

            <tbody>
              {/* row1 */}
              {allprivateLabelData.map((poItem) => (
                <tr className="row">
                  <th className=" col-2  ">
                    <div className=" th-1st-title-gap d-flex justify-content-start align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                      <td className="">
                        <div className="title-text-handler">
                          <p className="trate-title">{poItem?.productName}</p>
                        </div>
                      </td>
                    </div>
                  </th>

                  <th className=" col-4  d-flex align-items-center justify-content-between ">
                    <div className="trate-sub-title horizontal-text-handler">
                      {poItem?.productDescription}
                    </div>
                  </th>
                  <th className=" col-1  d-flex align-items-center justify-content-between ">
                    <p className="trate-sub-title">
                      {getMonthName(poItem?.createdAt?.split("T")?.[0])}
                    </p>
                  </th>

                  <th className=" col-1  d-flex align-items-center justify-content- ">
                    <div className="trate-sub-title horizontal-text-handler">
                      {poItem?.price}
                    </div>
                  </th>

                  <th className=" col-2  d-flex align-items-center justify-content- ">
                    <div className="trate-sub-title horizontal-text-handler">
                      {poItem?.productHSNCode}
                    </div>
                  </th>

                  <th className=" col-1  d-flex align-items-center justify-content- ">
                    <div className="status-continaer py-1 px-2">
                      <i className={`fa-solid fa-circle ${poItem?.status}`}></i>
                      <p>{poItem?.status}</p>
                    </div>
                  </th>

                  <th className=" col-1 d-flex align-items-center justify-content-center  gap-icon-table">
                    <p
                      className="trate-sub-title view-more-details cursor"
                      title="view more details"
                      onClick={() => {
                        navigate(
                          `/factorydashboard/offers/moreDetails?factoryOffersId=${poItem?.id}&productName=${poItem?.name}`
                        );
                      }}
                    >
                      {/* view */}
                      <i class="fa-solid fa-up-right-from-square"></i>
                    </p>
                    <p
                      className="trate-sub-title view-more-details cursor"
                      title="delete the form"
                      onClick={() => {
                        deleteData(poItem?.id);
                      }}
                    >
                      {/* view */}
                      <i class="fa-regular fa-trash-can"></i>
                    </p>
                  </th>
                </tr>
              ))}

              {allprivateLabelData?.length == 0 ? (
                <tr className="row">
                  <div className="col-12  w-100 h-100 my-5 py-5">
                    <div className="text-center">
                      <p className="trate-sub-title ">
                        {apiLoadingData ? (
                          <div
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : errorsMsg ? (
                          errorsMsg
                        ) : (
                          "No Records Found"
                        )}
                      </p>
                    </div>
                  </div>
                </tr>
              ) : (
                " "
              )}

              <tr className="row">
                <div className="col-12  ReactPaginate">
                  <PaginationDash
                    pagination={pagination}
                    setPagination={setPagination}
                  />
                </div>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
