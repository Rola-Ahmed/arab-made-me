import {  useState  } from "react";
import {  baseUrl_IMG } from "config.js";
import { getMonthName as getDate } from "utils/getMonthName";
import StarRating from "components/Shared/stars";
import { useNavigate } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import ProfileCell from "components/Shared/Dashboards/ProfileCell";
import SearchFilterByOrder from "components/Shared/Dashboards/SearchFilterByOrder";
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import useAllPos from "./useAllPos";
import StatusMessage from "components/Shared/Dashboards/StatusMessage";

export default function AllPo() {
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
    deleteData
  } = useAllPos( filter);
  
  return (
    <div className="m-4 order-section ">
      {/* section 1 */}
      <div className="header w-100">
        <PageUtility currentPage="Purchasing Orders" />
        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Purchasing Orders</h2>

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

                <th className=" col-3 ps-4">factory Details</th>

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
                          id="flexCheckDefault"
                        />
                      </div>
                      <td className="text-truncate">
                        <div>
                          <p className="trate-title text-truncate">
                          {poItem?.product?.name}
                          </p>
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
                        profile={poItem?.factory?.coverImage}
                        repEmail={poItem?.factory?.repEmail}
                        name={poItem?.factory?.name}
                      />
                  </th>

                  <th className=" col-1 d-flex align-items-center justify-content-center gap-icon-table">
                    <p
                      className="trate-sub-title view-more-details cursor"
                      title="view more details"
                      onClick={() => {
                        navigate(
                          `/importerdashboard/purchasingOrderReq/moreDetails?poId=${poItem?.id}&factoryName=${poItem?.factoryName}`
                        );
                      }}
                    >
                      <i className="fa-solid fa-up-right-from-square"></i>
                    </p>
                    <p
                      className="trate-sub-title view-more-details cursor"
                      title="delete the form"
                      onClick={() => {
                        deleteData(poItem?.id);
                      }}
                    >
                      <i className="fa-regular fa-trash-can"></i>
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
