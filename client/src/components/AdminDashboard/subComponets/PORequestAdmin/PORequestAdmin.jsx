import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { baseUrl, baseUrl_IMG } from "config.js";

//utils
import { errorHandler } from "utils/errorHandler";
import { getMonthName as getDate } from "utils/getMonthName";
import { handleImageError } from "utils/ImgNotFound";

//  shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import StarRating from "components/Shared/stars";

// sub components
import PurchasingOrdersNotification from "containers/Admindashboard/Notifcations/PurchasingOrdersNotification";

export default function PORequestAdmin() {
  let navigate = useNavigate();

  const [allPosData, setAllPosData] = useState([]);
  const [errorsMsg, setErrorsMsg] = useState();

  const [apiLoadingData, setApiLoadingData] = useState(true);
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
    setApiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/pos/?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}&include=importer&include=product`,
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setAllPosData(
          response.data.pos.filter((item) => item?.factoryId !== null)
        );
      } else {
        setErrorsMsg(response?.data?.message);
      }
      setApiLoadingData(false);
    } catch (error) {
      setApiLoadingData(false);
      setErrorsMsg(errorHandler(error));
    }
  }

  useEffect(() => {
    fetchFactoriesData();
  }, [pagination?.currentPage, pagination?.totalPage, filter]);

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
        const response1 = await axios.get(
          `${baseUrl}/pos?formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`
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

  const handlePageClick = (currentPage) => {
    // why plus 1 bec react pagination library reads the 1st page with index 0 but in api  is read with index 1
    setPagination((prevValue) => ({
      ...prevValue,
      currentPage: currentPage.selected + 1,
    }));
  };

  return (
    <div className="m-4 order-section ">
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

                  <th className=" col-1 d-flex align-items-center ">
                    <p className="trate-sub-title">${poItem?.product?.price}</p>
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
                    {/* {
                      poItem?.timeLine?.map((timlineItem,index)=>
                      <p className="trate-sub-title">
                      Date{index+1}:{getMonthName(timlineItem?.date?.split("T")?.[0])} - Quantity{index+1}:{timlineItem?.date}
                    </p>
                      )
                    } */}
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
                    {/* <p
                      className="trate-sub-title view-more-details cursor"
                      title="delete the form"
                      onClick={() => {
                        deleteData(poItem?.id);
                      }}
                    >
                      <i class="fa-regular fa-trash-can"></i>
                    </p> */}
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
