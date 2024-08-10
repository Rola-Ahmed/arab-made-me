import {  useState } from "react";
import {  baseUrl_IMG } from "config.js";

import StarRating from "components/Shared/stars";
import { useNavigate } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import SearchFilterByOrderPrice from "components/Shared/Dashboards/SearchFilterByOrderPrice";
import ProfileCell from "components/Shared/Dashboards/ProfileCell";
import StatusMessage from "components/Shared/Dashboards/StatusMessage";
import useAllQuotes from "./useAllQuotes";

export default function GetQuotationImp() {
  let navigate = useNavigate();
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

  
let {
  reqData,
  pagination,
  apiLoadingData,
  setPagination,
  
}=useAllQuotes(filter)
 

  return (
    <div className="m-4 order-section ">

      {/* section 1 */}
      <div className="header w-100">
        <PageUtility currentPage="Request for Quotations" />

        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Quotations</h2>

            <div className="btn-container">
              <button
                className="order-btn-1"
                // onClick={downloadCsv}
                disabled={true}
              >
                <i className="fa-solid fa-cloud-arrow-down"></i>
                <p className="cursor">Download CSV</p>
              </button>
            </div>
          </div>
        </div>

        {/* search filter section */}
                {/* search filter section */}
                <SearchFilterByOrderPrice filtterData={filtterData} filter={filter} />

        <div className=" data-container w-100 p-3">
          <table className="table mb-0">
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

                <th className=" col-1">Quantity</th>

                <th className=" col-1 px-0">Unit Price</th>

                <th scope="col" className=" ps-3 col-2 ">
                  Deadline
                </th>

                <th scope="col" className=" col-1">
                  Status
                </th>

                <th scope="col" className=" col-4 ps-2">
                  factory Details
                </th>

                <th scope="col" className=" col-1"></th>
              </tr>
            </thead>

            <tbody>
              {/* row1 */}
              {reqData?.map((poItem) => (
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
                      <td className="text-truncate">
                        <div className="">
                          <p className="trate-title text-truncate">
                            {poItem?.productName}
                            {/* {poItem?.id} */}
                          </p>
                          <p className="trate-sub-title d-flex">
                            {poItem?.productAverageRate ? (
                              <StarRating
                                averageRating={poItem?.productAverageRate}
                              />
                            ) : (
                              "0 rating"
                            )}
                          </p>
                        </div>
                      </td>
                    </div>
                  </th>

                  <th className=" col-1 d-flex align-items-center d-none ">
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

                  <th className=" col-1 d-flex align-items-center">
                    <p className="trate-sub-title">{poItem?.minQuantity}</p>
                  </th>

                  <th className=" col-1 d-flex align-items-center ">
                    <p className="trate-sub-title">{poItem?.price}</p>
                  </th>

                  <th className=" col-2 ps-3  d-flex align-items-center ">
                    <p className="trate-sub-title d-none">
                      {poItem?.timeForDelivery?.end !== null
                        ? getMonthName(
                            poItem?.timeForDelivery?.end?.split("T")?.[0]
                          )
                        : ""}
                    </p>
                  </th>

                  <th className=" col-1  d-flex align-items-center ">
                    <div className="status-continaer py-1 px-2 ">
                      <i className={`fa-solid fa-circle ${poItem?.status}`}></i>
                      <p>{poItem?.status}</p>
                    </div>
                  </th>

                  <th className=" col-4  d-flex align-items-center  justify-content-center ">
                  <ProfileCell
                        profile={poItem?.factory?.coverImage}
                        repEmail={poItem?.factory?.repEmail}
                        name={poItem?.factory?.name}
                      />
                  
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
                          `/importerdashboard/quotations/moreDetails?quotationsId=${poItem?.id}&factoryName=${poItem?.factoryName}`
                        );
                      }}
                    >
                      {/* view */}
                      <i class="fa-solid fa-up-right-from-square"></i>
                    </p>
                  
                  </th>
                </tr>
              ))}

<StatusMessage
                reqDataLength={reqData?.length}
                apiLoadingData={apiLoadingData?.reqData}
                errorsMsg={apiLoadingData?.errorWhileLoading}
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
