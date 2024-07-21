import { useState, useContext } from "react";
import StarRating from "components/Shared/stars";
import { UserToken } from "Context/userToken";
import { useNavigate } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import SearchFilterByOrderPrice from "components/Shared/Dashboards/SearchFilterByOrderPrice";
import ProfileCell from "components/Shared/Dashboards/ProfileCell";
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import usePrivateLabel from "./usePrivateLabel";
import StatusMessage from "components/Shared/Dashboards/StatusMessage";
import PrivateLabelNotificationList from "./PrivateLabelNotificationList";

export default function PrivateLabelImp() {
  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();
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

  let {
    reqData,
    pagination,
    apiLoadingData,
    errorsMsg,
    setPagination,
    deleteData,
  } = usePrivateLabel(isLogin, filter);

  const downloadCsv = () => {
    const attributesToFilter = [
      "productId",
      "factoryId",
      "importerId",
      "updatedAt",
      "docs",
      "factoryProfileImg",
    ];
    // ,"contactData"
    const newArray = filterAttributes(reqData, attributesToFilter);

    // const csvData = convertToCsv(reqData);

    const csvData = convertToCsv(newArray);

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "privateLabel.csv";
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
          if (
            key === "specialCharacteristics" &&
            typeof originalObject[key] === "object" &&
            Object.keys(originalObject[key])?.length !== 0
          ) {
            // originalObject[key].forEach((item, index) => {
            //   acc[`KeyWord${index}`] = Object.values([item]);
            //   acc[`description${index}`] = item;
            // });

            let index = 1;
            for (const keyLoop in originalObject[key]) {
              if (originalObject[key].hasOwnProperty(keyLoop)) {
                const value = originalObject[key][keyLoop];

                acc[`KeyWord${index}`] = keyLoop;
                acc[`description${index}`] = value;
              }
              index++;
            }

            while (index <= 5) {
              acc[`KeyWord${index}`] = "";
              acc[`description${index}`] = "";

              index++;
            }
          } else {
            acc[key] = originalObject[key];
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
        <PageUtility currentPage="Private Labels" />

        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Private Labels</h2>

            <div className="btn-container">
              <div>
                <button
                  className="notific-btn dropdown-toggle fa-solid fa-bell btn-container bg-white"
                  type="button"
                  data-bs-toggle="dropdown"
                ></button>

                <PrivateLabelNotificationList />
              </div>

              <button
                className="order-btn-1"
                onClick={downloadCsv}
                disabled={!reqData?.length}
              >
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

                <th className=" col-4">Specifications (Keyword,description)</th>

                <th className=" col-1 ">Sent Date</th>

                <th className=" col-1">Status</th>

                <th className=" col-3">factory Details</th>

                <th className=" col-1"></th>
              </tr>
            </thead>

            <tbody>
              {/* row1 */}
              {!errorsMsg && (
                <>
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
                                {poItem?.producy?.name ??
                                  "Private Label Product"}
                              </p>
                              <p className="trate-sub-title d-flex">
                                {poItem?.producy?.averageRate ? (
                                  <StarRating
                                    averageRating={poItem?.producy?.averageRate}
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
                          <i
                            className={`fa-solid fa-circle ${poItem?.status}`}
                          ></i>
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
                              `/importerdashboard/PrivateLabelReq/moreDetails?privateLabelId=${poItem?.id}&factoryName=${poItem?.factoryName}`
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
                </>
              )}

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
