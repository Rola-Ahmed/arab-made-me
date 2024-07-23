//
import { useState } from "react";

// shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import StarRating from "components/Shared/stars";

import { useNavigate } from "react-router-dom";

import { getMonthName as getDate } from "utils/getMonthName";

// Container Components

// Sub Components
import HeaderSection from "./HeaderSection";

import StatusMessage from "components/Shared/Dashboards/StatusMessage";
import ProfileCell from "components/Shared/Dashboards/ProfileCell";
import SearchFilterByOrderPrice from "components/Shared/Dashboards/SearchFilterByOrderPrice";
import useAllQuotes from "./useAllQuotes";

export default function AllQuotes() {
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
    errorsMsg,
    setPagination,
    deleteData,
    deleteLoading,
    isLogin,
  } = useAllQuotes(filter);
  let navigate = useNavigate();
  // utils function
  let getMonthName = getDate;

  return (
    <div className="m-4 order-section ">
      {/* header Section */}
      <div className="header w-100 ">
        <HeaderSection requestedData={reqData} />

        {/* search filter section */}
        <SearchFilterByOrderPrice filtterData={filtterData} filter={filter} />

        {/* data section */}
        <div className=" data-container w-100 p-3">
          <table className="table mb-0">
            {/* headers */}

            <thead>
              <tr className="row">
                <th className=" col-3">
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

                <th scope="col" className=" col-3 ps-5">
                  Executed By
                </th>

                <th scope="col" className=" col-1"></th>
              </tr>
            </thead>

            <tbody>
              {/* row1 */}
              {reqData?.map((poItem) => (
                <tr className="row">
                  <th className=" col-3">
                    <div className=" th-1st-title-gap d-flex justify-content-start align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                      {/* <td className="">
                        <div className="title-text-handler">
                          <p className="trate-title">{poItem?.productName}</p>
                        </div>
                      </td> */}

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

                  <th className=" col-1 d-flex align-items-center">
                    <p className="trate-sub-title">{poItem?.minQuantity}</p>
                  </th>

                  <th className=" col-1 d-flex align-items-center ">
                    <p className="trate-sub-title">{poItem?.price}</p>
                  </th>

                  <th className=" col-2 ps-3  d-flex align-items-center ">
                    <p className="trate-sub-title">
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

                  <th className=" col-3  d-flex align-items-center  justify-content-center ">
                    <ProfileCell
                      profile={poItem?.importer?.image}
                      repEmail={poItem?.importer?.repEmail}
                      name={poItem?.importer?.name}
                    />
                  </th>

                  {/* view more details or delete data*/}
                  <th
                    scope="col"
                    className=" col-1 d-flex align-items-center justify-content-center gap-icon-table"
                  >
                    {/*  view more details */}
                    <p
                      className="trate-sub-title view-more-details cursor"
                      title="view more details"
                      onClick={() => {
                        navigate(
                          `/factorydashboard/quotations/moreDetails?quotationsId=${poItem?.id}&factoryName=${poItem?.factoryName}`
                        );
                      }}
                    >
                      <i class="fa-solid fa-up-right-from-square"></i>
                    </p>
                    {/* Delete data*/}
                    <p
                      className={`trate-sub-title view-more-details  ${
                        deleteLoading ? "cursor-wait" : "cursor"
                      }`}
                      title="delete the form"
                      onClick={() => {
                        deleteData(poItem?.id);
                      }}
                    >
                      <i class="fa-regular fa-trash-can"></i>
                    </p>
                  </th>
                </tr>
              ))}

              {/* displayed if requested data is empty || loading || error */}

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
