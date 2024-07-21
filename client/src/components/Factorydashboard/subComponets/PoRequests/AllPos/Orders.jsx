import { useState, useContext } from "react";
import "./Orders.css";
import { baseUrl_IMG } from "config.js";
// shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";

import StarRating from "components/Shared/stars";
import { UserToken } from "Context/userToken";
import { useNavigate } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import useAllPos from "./useAllPos";
import PurchasingOrdersNotification from "components/Factorydashboard/subComponets/PoRequests/AllPos/PosNotificationList";
import StatusMessage from "components/Shared/Dashboards/StatusMessage";
import SearchFilterByOrder from "components/Shared/Dashboards/SearchFilterByOrder";
import ProfileCell from "components/Shared/Dashboards/ProfileCell";
export default function Orders() {
  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();

  const [filter, setFilter] = useState({
    formsFilter: "",
    sort: "date-DESC",
    sort_name: "",
  });

  let {
    reqData,
    pagination,
    apiLoadingData,
    errorsMsg,
    setPagination,
  } = useAllPos(isLogin, filter);
  // utils function
  let getMonthName = getDate;

  function filtterData(value, keyword, name) {
    setFilter((prevValue) => ({
      ...prevValue,
      [keyword]: value,
      ...(name && { sort_name: name }),
    }));
  }

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

    const newArray = filterAttributes(reqData, attributesToFilter);
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
                disabled={!reqData.length}
              >
                <i className="fa-solid fa-cloud-arrow-down"></i>
                <p className="cursor">Download CSV</p>
              </button>
            </div>
          </div>
        </div>

        {/* search filter section */}
        <SearchFilterByOrder filtterData={filtterData} filter={filter} />

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
              {reqData?.map((poItem) => (
                <tr className="row">
                  <th className=" col-2 ">
                    <div className=" th-1st-title-gap d-flex justify-content-start align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                        />
                      </div>
                      <td className="">
                        <div className="title-text-handler">
                          <p className="trate-title">{poItem?.product?.name}</p>
                          <p className="trate-sub-title d-flex">
                            {poItem?.product?.avarage ? (
                              <StarRating
                                averageRating={poItem?.product?.avarage}
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
                      {// allAnsRfqData.map((item) =>
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
                                    {i?.split(".")?.[i.split(".")?.length - 1]}
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
                            :{getMonthName(timelineItem?.date?.split("T")?.[0])}
                            -
                            <span className="fw-bolder text-dark ">
                              Quantity{index + 1}
                            </span>
                            :{timelineItem?.quantity}
                          </p>
                        ))}
                    </div>
                  </th>

                  <th className=" col-1  d-flex align-items-center ">
                    <div className="status-continaer py-1 px-2">
                      <i className={`fa-solid fa-circle ${poItem?.status}`}></i>
                      <p>{poItem?.status}</p>
                    </div>
                  </th>

                  <th className=" col-3  d-flex align-items-center ps-4">
                    <ProfileCell
                      profile={poItem?.importer?.image}
                      repEmail={poItem?.importer?.repEmail}
                      name={poItem?.importer?.name}
                    />
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

              {/* is data is still loading or error occured */}
              <StatusMessage
                reqDataLength={reqData?.length}
                apiLoadingData={apiLoadingData}
                errorsMsg={errorsMsg}
              />

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
