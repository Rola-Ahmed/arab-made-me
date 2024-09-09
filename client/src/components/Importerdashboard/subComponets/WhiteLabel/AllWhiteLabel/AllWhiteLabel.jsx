import { useState, useContext } from "react";
import { UserToken } from "Context/userToken";
import { useNavigate } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import SearchFilterByOrderPrice from "components/Shared/Dashboards/SearchFilterByOrderPrice";
import ProfileCell from "components/Shared/Dashboards/ProfileCell";
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import usePrivateLabel from "./useAllWhiteLabel";
import StatusMessage from "components/Shared/Dashboards/StatusMessage";

export default function AllWhiteLabel() {
  let { isLogin } = useContext(UserToken);
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
    errorsMsg,
    setPagination,
    deleteData,
  } = usePrivateLabel(isLogin, filter);

  return (
    <div className="m-4 order-section ">
      {/* section 1 */}
      <div className="header w-100">
        <PageUtility currentPage="Private Labels" />

        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Private Labels</h2>

            <div className="btn-container">
              <button className="order-btn-1" disabled>
                <i className="fa-solid fa-cloud-arrow-down"></i>
                <p className="cursor">Download CSV</p>
              </button>
            </div>
          </div>
        </div>

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

                <th className=" col-4">Extra Details</th>

                <th className=" col-1 ">Sent Date</th>

                <th className=" col-1">Status</th>

                <th className=" col-3">factory Details</th>

                <th className=" col-1"></th>
              </tr>
            </thead>

            <tbody>
              {/* row1 */}
              {/* <> */}
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
                            {poItem?.product?.name ?? "none"}
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
                    <ProfileCell
                      profile={poItem?.factory?.coverImage}
                      repEmail={poItem?.factory?.repEmail}
                      name={poItem?.factory?.name}
                    />
                  </th>

                  <th className=" col-1 d-flex align-items-center justify-content-center  gap-icon-table">
                    <p
                      className="trate-sub-title view-more-details cursor"
                      title="view more details"
                      onClick={() => {
                        navigate(
                          `/importerdashboard/whiteLabel/moredetails?whiteLabelId=${poItem?.id}&factoryName=${poItem?.factoryName}`
                        );
                      }}
                    >
                      {/* view */}
                      <i className="fa-solid fa-up-right-from-square"></i>
                    </p>
                    <p
                      className="trate-sub-title view-more-details cursor"
                      title="delete the form"
                      onClick={() => {
                        deleteData(poItem?.id);
                      }}
                    >
                      {/* view */}
                      <i className="fa-regular fa-trash-can"></i>
                    </p>
                  </th>
                </tr>
              ))}
              {/* </> */}

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
