import { useEffect, useState, useContext } from "react";

import "./Orders.css";
import { handleImageError } from "utils/ImgNotFound";

// shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import StarRating from "components/Shared/stars";
import { UserToken } from "Context/userToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";

import PurchasingOrdersNotification from "components/Factorydashboard/subComponets/Orders/PurchasingOrdersNotification";
export default function Orders() {
  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();

  const [allPosData, setAllPosData] = useState([]);
  const [errorsMsg, setErrorsMsg] = useState();

  const [apiLoadingData, setapiLoadingData] = useState(true);
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

  const [uniqueProductId, setUniqueProductId] = useState([]);

  const [filter, setFilter] = useState({
    formsFilter: "",
    sort: "date-DESC",
    sort_name: "",
  });

  // utils function
  let getMonthName = getDate;

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
        url: `${baseUrl}/factories/factory/pos/?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setAllPosData(
          response.data.pos.filter((item) => item?.factoryId !== null)
        );

        const uniqueIds = [
          ...new Set(
            response.data.pos
              .map((obj) => obj.importerId) // Extract all factoryIds
              .filter((id) => id !== null) // Filter out null values
          ),
        ];

        const uniqueProductIds = [
          ...new Set(
            response.data.pos
              .map((obj) => obj.productId) // Extract all factoryIds
              .filter((id) => id !== null) // Filter out null values
          ),
        ];

        setUniqueFactoryIDofProducts(uniqueIds);
        setUniqueProductId(uniqueProductIds);
      } else {
        setErrorsMsg(response?.data?.message);
      }
      setapiLoadingData(false);
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

  useEffect(() => {
    // Promise.all(
    uniqueFactoryIDofProducts.map(async (importerID) => {
      try {
        const productResponse = await axios.get(
          `${baseUrl}/importers/${importerID}`
        );

        if (productResponse.data.message === "done") {
          setAllPosData((prevData) =>
            prevData.map((value) =>
              value?.importerId === importerID
                ? {
                    ...value,
                    importerName: productResponse?.data?.importers?.name,
                    importerRepEmail:
                      productResponse?.data?.importers?.repEmail,
                    importerProfileImg: productResponse?.data?.importers?.image,
                  }
                : value
            )
          );
        }
      } catch (error) {}
    });

    uniqueProductId.map(async (productId) => {
      try {
        const productResponse = await axios.get(
          `${baseUrl}/products/${productId}`
        );

        if (productResponse.data.message === "done") {
          setAllPosData((prevData) =>
            prevData.map((value) =>
              value?.productId === productId
                ? {
                    ...value,
                    productName: productResponse?.data?.products?.name,
                    productAverageRate:
                      productResponse?.data?.products?.averageRate,
                    productPrice: productResponse?.data?.products?.price,
                  }
                : value
            )
          );
        }
      } catch (error) {}
    });
    // );

    //  let x allPosData.map((data))
  }, [apiLoadingData]);

  const downloadCsv = () => {
    const attributesToFilter = [
      "productId",
      "factoryId",
      "importerId",
      "factory",
      "quotationId",
      "sourcingOfferId",
      "updatedAt",
      "docs",
      "importerProfileImg",
      // "importerRepEmail",
    ];

    const newArray = filterAttributes(allPosData, attributesToFilter);
    const csvData = convertToCsv(newArray);

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "purchasingOrders.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const convertToCsv = (data) => {
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
    return `${header}\n${rows}`;
  };

  const filterAttributes = (dataArray, attributesToFilter) => {
    return dataArray.map((originalObject) => {
      const filteredObject = Object.keys(originalObject).reduce((acc, key) => {
        if (!attributesToFilter.includes(key)) {
          if (key === "contactData") {
            acc["RepresentiveEmail"] = originalObject[key]?.email || "";
            acc["RepresentivePhone"] = originalObject[key]?.phone || "";
          } else if (
            key === "timeLine" &&
            Array.isArray(originalObject[key]) &&
            originalObject[key].length > 0
          ) {
            acc["TimeLineData"] = originalObject[key]
              .map(
                (item, index) =>
                  `date${index + 1}:${item?.date} - quantity${index + 1}:${
                    item?.quantity
                  }`
              )
              .join(", ");
          } else {
            acc[key] = String(originalObject[key]); // Convert to string
          }
        }

        return acc;
      }, {});

      return filteredObject;
    });
  };

  useEffect(() => {
    const fetchDataLenght = async () => {
      try {
        // const response1 = await axios.get(`${baseUrl}/pos`);
        const response1 = await axios.get(
          `${baseUrl}/factories/factory/pos?formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`,
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
              (response1.data?.pos?.length || 0) / prevValue.displayProductSize
            ),
          }));
        }
      } catch (error) {}
    };

    fetchDataLenght();
  }, [filter]);

  return (
    <div className="m-4 order-section ">
      <ToastContainer />

      {/* section 1 */}
      <div className="header w-100">
        <PageUtility currentPage="Purchasing Orders" />
        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Purchasing Orders</h2>

            <div className="btn-container">
              <div>
                <button
                  className="notific-btn dropdown-toggle fa-solid fa-bell btn-container bg-white"
                  type="button"
                  data-bs-toggle="dropdown"
                ></button>

                <PurchasingOrdersNotification />
              </div>
              <button
                className="order-btn-1"
                onClick={downloadCsv}
                disabled={!allPosData.length}
              >
                <i className="fa-solid fa-cloud-arrow-down"></i>
                <p className="cursor">Download CSV</p>
              </button>

              {/* <button className="order-btn-2">
                <i className="fa-solid fa-plus"></i>
                <p>Add</p>
              </button> */}
            </div>
          </div>
        </div>

        {/* search filter section */}
        <div className=" search-container d-flex justify-content-between align-items-center p-3">
          <div className="input-group width-size">
            <div
              className="input-group-prepend  cursor"
              onClick={(e) => {
                let value = document.getElementById("formsFilter").value;
                filtterData(value, "formsFilter");
              }}
            >
              <span className="input-group-text bg-white icon-search-container pe-0 cursor">
                <i className="fa-solid fa-magnifying-glass icon-search"></i>
              </span>
            </div>
            <input
              type="text"
              className="form-control input-search "
              placeholder="Search by product name"
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
                <th className=" col-2 ">
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

                <th className=" col-1 ">Unit Price</th>

                <th className=" col-1 ">Docs</th>

                <th className=" col-3 ps-4">Deadline</th>
                <th className=" col-1 ">Status</th>

                <th className=" col-3 ps-4">Executed By</th>

                <th className=" col-1"></th>
              </tr>
            </thead>

            <tbody>
              {/* row1 */}
              {allPosData.map((poItem) => (
                <tr className="row">
                  <th className=" col-2 ">
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
                          <p className="trate-sub-title d-flex">
                            {poItem?.productAverageRate ? (
                              <StarRating
                                averageRating={poItem?.productAverageRate}
                              />
                            ) : (
                              "0 rating"
                            )}
                            {/* {getRandomNumber(3, 5, 2)} */}
                          </p>
                        </div>
                      </td>
                    </div>
                  </th>

                  <th className=" col-1 d-flex align-items-center ">
                    <p className="trate-sub-title">${poItem?.productPrice}</p>
                  </th>

                  <th className=" col-1 d-flex align-items-center  ">
                    <div>
                      {
                        // allAnsRfqData.map((item) =>
                        poItem?.docs != null
                          ? poItem?.docs?.map((i, index) =>
                              i !== null ? (
                                <>
                                  <a
                                    className="text-decoration-none"
                                    target="_blank"
                                    rel="noreferrer"
                                    href={`${baseUrl_IMG}/${i}`}
                                    download
                                  >
                                    <p className="trate-sub-title doc-download-color cursor">
                                      Doc{index}.
                                      {
                                        i?.split(".")?.[
                                          i.split(".")?.length - 1
                                        ]
                                      }
                                    </p>
                                  </a>
                                </>
                              ) : (
                                ""
                              )
                            )
                          : ""
                        // )
                      }
                    </div>
                  </th>

                  <th className=" col-3  d-flex align-items-center  ps-4">
                    <div>
                      {Array.isArray(poItem?.timeLine) &&
                        poItem?.timeLine.map((timelineItem, index) => (
                          <p className="trate-sub-title" key={index}>
                            <span className="fw-bolder text-dark ">
                              Date{index + 1}
                            </span>
                            :
                            {getMonthName(
                              timelineItem?.date?.split("T")?.[0] ??
                                timelineItem?.date ??
                                timelineItem?.time
                            )}
                            -
                            <span className="fw-bolder text-dark ">
                              Quantity{index + 1}
                            </span>
                            :{timelineItem?.quantity}
                          </p>
                        ))}
                      {poItem?.timeLine?.length == null ? (
                        <p className="trate-sub-title">
                          <span className="fw-bolder text-dark "> Date1 </span>
                          :Jan, 20,2020 -
                          <span className="fw-bolder text-dark ">
                            Quantity1
                          </span>
                          :5000
                        </p>
                      ) : (
                        // `{`Date1 :Jan, 01,2023 - Quantity1 :10`}
                        // `
                        ""
                      )}
                    </div>
                  </th>

                  <th className=" col-1  d-flex align-items-center ">
                    <div className="status-continaer py-1 px-2">
                      <i className={`fa-solid fa-circle ${poItem?.status}`}></i>
                      <p>{poItem?.status}</p>
                    </div>
                  </th>

                  <th className=" col-3  d-flex align-items-center ps-4">
                    <div className="profile-container justify-content-start align-items-center d-flex">
                      <div className="profile-img">
                        <img
                          className="w-100 h-100"
                          src={`${baseUrl_IMG}/${poItem?.importerProfileImg}`}
                          onError={handleImageError}
                        />
                      </div>
                      <div>
                        <p className=" name-text">{poItem?.importerName}</p>
                        <p className=" email-text">
                          {poItem?.importerRepEmail}
                        </p>
                      </div>
                    </div>
                  </th>

                  <th className=" col-1 d-flex align-items-center justify-content-center gap-icon-table">
                    <p
                      className="trate-sub-title view-more-details cursor"
                      title="view more details"
                      onClick={() => {
                        navigate(
                          `/factorydashboard/purchasingOrderReq/moreDetails?poId=${poItem?.id}&factoryName=${poItem?.name}`
                        );
                      }}
                    >
                      {/* view */}
                      <i class="fa-solid fa-up-right-from-square"></i>
                    </p>
                  </th>
                </tr>
              ))}

              {allPosData?.length == 0 ? (
                <tr className="row">
                  <div className="col-12  w-100 h-100 my-5 py-5">
                    <div className="text-center">
                      <p className="trate-sub-title ">
                        {errorsMsg ?? "No Record"}
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
