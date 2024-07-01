import React, { useEffect, useState, useContext } from "react";

//
// shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import StarRating from "components/Shared/stars";
import { UserToken } from "Context/userToken";
import { useNavigate } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import { handleImageError } from "utils/ImgNotFound";

// Container Components
import RfqNotification from "containers/Factorydashboard/Notifcations/RFqNotification";

export default function RfqFactoryDash() {
  // const notifcationData = RfqNotification();

  const { isLogin } = useContext(UserToken);
  const navigate = useNavigate();
  // State variables
  const [allAnsRfqData, setAllAnsRfqData] = useState([]);
  const [apiLoadingData, setApiLoadingData] = useState(true);
  const [errorsMsg, setErrorsMsg] = useState();
  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 8,
    currentPage: 1,
    totalPage: 1,
  }));
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

  // Fetch data length on filter change
  useEffect(() => {
    const fetchDataLenght = async () => {
      try {
        const response1 = await axios.get(
          `${baseUrl}/factories/factory/rfqs?formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`,
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
              (response1.data?.rfqs?.length || 0) / prevValue.displayProductSize
            ),
          }));
        }
      } catch (error) {}
    };

    fetchDataLenght();
  }, [filter]);

  async function fetchFactoriesData() {
    setApiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/factory/rfqs?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}&include=importer&include=product`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);
      if (response?.data?.message == "done") {
        setAllAnsRfqData(response.data.rfqs);

        setApiLoadingData(false);
      } else {
        setErrorsMsg(response?.data?.message);
      }
    } catch (error) {
      setApiLoadingData(false);

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
      } else {
        setErrorsMsg("An unexpected error occurred. Please try again later.");
      }
    }
  }

  useEffect(() => {
    fetchFactoriesData();
  }, [pagination?.currentPage, filter]);

  // utils function
  let getMonthName = getDate;

  const downloadCsv = () => {
    const attributesToFilter = [
      "productId",
      "factoryId",
      "importerId",
      "quotationId",
      "sourcingOfferId",
      "updatedAt",
      "docs",
      "importer",
      "factory",
      "product",
    ];
    // ,"contactData"
    const newArray = filterAttributes(allAnsRfqData, attributesToFilter);

    // const csvData = convertToCsv(allAnsRfqData);

    const csvData = convertToCsv(newArray);

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "rfqs.csv";
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

  return (
    <div className="m-4 order-section ">
      {/* section 1 */}
      <div className="header w-100">
        <PageUtility currentPage="RFQs" />
        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>RFQs</h2>

            <div className="btn-container">
              <div>
                <button
                  className="notific-btn dropdown-toggle fa-solid fa-bell btn-container bg-white"
                  type="button"
                  data-bs-toggle="dropdown"
                ></button>

                <RfqNotification />
              </div>
              <button
                className="order-btn-1"
                onClick={downloadCsv}
                disabled={!allAnsRfqData?.length}
              >
                <i className="fa-solid fa-cloud-arrow-down"></i>
                <p className="cursor">Download CSV</p>
              </button>
            </div>
          </div>

          {/*  <p className="sub-text">view your team's trades and transactions.</p>*/}
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

              <ul class="dropdown-menu  ">
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
          {" "}
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

                <th className=" col-1">Docs</th>
                <th className=" col-1">Quantity</th>

                <th className=" col-1 px-0">Unit Price </th>

                <th scope="col" className=" ps-3 col-2 ">
                  Deadline
                </th>

                <th scope="col" className=" col-1">
                  Status
                </th>

                <th scope="col" className=" col-3 ps-5">
                  Executed By
                </th>

                <th scope="col" className=" col-1"></th>
              </tr>
            </thead>

            <tbody>
              {/* row1 */}
              {allAnsRfqData?.map((poItem) => (
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
                      <td className="">
                        <div className="title-text-handler">
                          <p className="trate-title">{poItem?.product?.name}</p>
                          <p className="trate-sub-title d-flex">
                            {poItem?.product?.averageRate ? (
                              <StarRating
                                averageRating={poItem?.product?.averageRate}
                              />
                            ) : (
                              "0 rating"
                            )}
                          </p>
                        </div>
                      </td>
                    </div>
                  </th>

                  <th className=" col-1 d-flex align-items-center  ">
                    {" "}
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

                  <th className=" col-1 d-flex align-items-center">
                    {" "}
                    <p className="trate-sub-title">{poItem?.quantity}</p>
                  </th>

                  <th className=" col-1 d-flex align-items-center ">
                    {" "}
                    <p className="trate-sub-title">{poItem?.product?.price}</p>
                  </th>

                  <th className=" col-2 ps-3  d-flex align-items-center ">
                    <p className="trate-sub-title">
                      {poItem?.deadline !== null
                        ? getMonthName(poItem?.deadline?.split("T")?.[0])
                        : ""}
                    </p>
                  </th>

                  <th className=" col-1  d-flex align-items-center ">
                    {/* <div className="status-continaer py-1 px-2 mx-3"> */}
                    <div className="status-continaer py-1 px-2 ">
                      <i className={`fa-solid fa-circle ${poItem?.status}`}></i>
                      <p>{poItem?.status}</p>
                    </div>
                  </th>

                  <th className=" col-3  d-flex align-items-center  justify-content-center ">
                    <div className="profile-container justify-content-start align-items-center d-flex ">
                      <div className="profile-img">
                        <img
                          className="w-100 h-100"
                          src={`${baseUrl_IMG}/${poItem?.importer?.image}`}
                          onError={handleImageError}
                        />
                      </div>
                      <div>
                        <p className=" name-text">{poItem?.importer?.name}</p>
                        <p className=" email-text">
                          {poItem?.importer?.repEmail}
                        </p>
                      </div>
                    </div>
                  </th>

                  <th
                    scope="col"
                    className=" col-1 d-flex align-items-center justify-content-center gap-icon-table"
                  >
                    <p
                      className="trate-sub-title view-more-details cursor"
                      title="view more details"
                      onClick={() => {
                        navigate(
                          `/factorydashboard/RFQReq/moreDetails?rfqReqId=${poItem?.id}&factoryName=${poItem?.factoryName}`
                        );
                      }}
                    >
                      {/* view */}
                      <i class="fa-solid fa-up-right-from-square"></i>
                    </p>
                  </th>
                </tr>
              ))}

              {allAnsRfqData?.length == 0 ? (
                <tr className="row">
                  <div className="col-12  w-100 h-100 my-5 py-5">
                    <div className="text-center">
                      <p className="trate-sub-title ">
                        {apiLoadingData ? (
                          <div
                            class="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        ) : (
                          errorsMsg ?? "No Records"
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
