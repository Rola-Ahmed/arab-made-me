import { useState, useContext } from "react";

//
// shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import { baseUrl_IMG } from "config.js";

import StarRating from "components/Shared/stars";
import { UserToken } from "Context/userToken";
import { useNavigate } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import { handleImageError } from "utils/ImgNotFound";

import useRFQData from "./useRfq";
// Container Components
// stand alone component
import RfqNotification from "components/Factorydashboard/subComponets/RfqFactoryDash/AllFRQs/RfqNotificationList";
import SearchFilterByOrder from "components/Shared/Dashboards/SearchFilterByOrder";

export default function AllRfqs() {
  const { isLogin } = useContext(UserToken);
  const navigate = useNavigate();
  // utils function
  let getMonthName = getDate;

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

  let { allAnsRfqData, pagination, apiLoadingData, errorsMsg, setPagination } =
    useRFQData(isLogin, filter);

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
        {/* <div> */}
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
        {/* </div> */}

        {/* search filter section */}

        <SearchFilterByOrder filtterData={filtterData} filter={filter} />
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
                          // id="flexCheckDefault"
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
                    <p className="trate-sub-title">{poItem?.quantity}</p>
                  </th>

                  <th className=" col-1 d-flex align-items-center ">
                    <p className="trate-sub-title">{poItem?.product?.price}</p>
                  </th>

                  <th className=" col-2 ps-3  d-flex align-items-center ">
                    <p className="trate-sub-title">
                      {getMonthName(poItem?.deadline?.split("T")?.[0])}
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
                          errorsMsg || "No Records Found"
                          // errorsMsg!=''?errorsMsg : "No Records"
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
