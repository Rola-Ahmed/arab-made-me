import { useNavigate } from "react-router-dom";

// config
import { baseUrl_IMG } from "config.js";

// utils
import { getMonthName as getDate } from "utils/getMonthName";
import { handleImageError } from "utils/ImgNotFound";
import StarRating from "components/Shared/stars";

// sub components
import HeaderSection from "./HeaderSection";

// shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import SearchFilterByOrderPrice from "components/Shared/Dashboards/SearchFilterByOrderPrice";
import StatusMessage from "components/Shared/Dashboards/StatusMessage";

export default function IndexList(props) {
  let {
    reqData,
    pagination,
    setPagination,
    // handleDataFromChild,
    filter,
    apiLoadingData,
    errorsMsg,
    filtterData,
  } = props;
  let navigate = useNavigate();
  let getMonthName = getDate;

  return (
    <div className="m-4 order-section ">
      {/* me-5 ms-5 mb-5 mt-2 "> */}

      {/* section 1 */}
      <div className="header w-100">
        <HeaderSection reqData={reqData} />

        {/* search filter section */}
        <SearchFilterByOrderPrice filtterData={filtterData} filter={filter} />
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

                <th className=" col-4">More Details</th>

                <th className=" col-1 ">Sent Date</th>

                <th className=" col-1">Status</th>

                <th className=" col-3">Executed By</th>

                <th className=" col-1"></th>
              </tr>
            </thead>

            <tbody>
              {/* row1 */}
              {reqData?.map((poItem) => (
                <tr className="row">
                  <th className=" col-2  ">
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
                          <p className="trate-title">
                            {poItem?.product?.name ?? "Whitw Label Product"}
                          </p>
                          <p className="trate-sub-title d-flex">
                            {poItem?.product?.averageRate ? (
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

                  <th className=" col-4  d-flex align-items-center justify-content-between ">
                    <p className="trate-sub-title horizontal-text-handler">
                      {poItem?.moreDetails}
                    </p>
                  </th>
                  <th className=" col-1  d-flex align-items-center justify-content-between ">
                    <p className="trate-sub-title">
                      {getMonthName(poItem?.createdAt?.split("T")?.[0])}
                    </p>
                  </th>

                  <th className=" col-1  d-flex align-items-center justify-content- ">
                    <div className="status-continaer py-1 px-2">
                      <i className={`fa-solid fa-circle ${poItem?.status}`}></i>
                      <p>{poItem?.status}</p>
                    </div>
                  </th>

                  <th className=" col-3  d-flex align-items-center justify-content- ">
                    <div className="profile-container justify-content-start align-items-center d-flex">
                      <div className="profile-img">
                        <img
                          className="w-100 h-100"
                          src={`${baseUrl_IMG}/${poItem?.importers?.image}`}
                          onError={handleImageError}
                        />
                      </div>
                      <div>
                        <p className="name-text">{poItem?.importer?.name}</p>
                        <p className=" mail-text">
                          {poItem?.importer?.repEmail}
                        </p>
                      </div>
                    </div>
                  </th>

                  <th className=" col-1 d-flex align-items-center justify-content-center  gap-icon-table">
                    <p
                      className="trate-sub-title view-more-details cursor"
                      title="view more details"
                      onClick={() => {
                        navigate(
                          `/factorydashboard/whiteLabel/moreDetails?whiteLabelId=${poItem?.id}&factoryName=${poItem?.factoryName}`
                        );
                      }}
                    >
                      {/* view */}
                      <i className="fa-solid fa-up-right-from-square"></i>
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
