import { useState } from "react";

// shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";

import { useNavigate } from "react-router-dom";

import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import useAllOffers from "./useAllOffers";
import StatusMessage from "components/Shared/Dashboards/StatusMessage";
import SearchFilterByOrderPrice from "components/Shared/Dashboards/SearchFilterByOrderPrice";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";

export default function AllOffers() {
  let navigate = useNavigate();
  let getMonthName = getDate;

  const [filter, setFilter] = useState({
    formsFilter: "",
    sort: "date-DESC",
    sort_name: "",
  });
  const [modalShow, setModalShow] = useState(false);

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
    deleteData,
    continueProfilePath,
  } = useAllOffers(filter);

  return (
    <>
      <FactoryUnVerified
        show={modalShow}
        onHide={() => setModalShow(false)}
        goToPath={continueProfilePath}
      />

      <div className="m-4 order-section ">
        {/* section 1 */}
        <div className="header w-100">
          <PageUtility currentPage="Factory Offers" />
          <div>
            <div className=" d-flex justify-content-between align-items-center ">
              <h2>Factory Offers</h2>

              <div className="btn-container">
                <button
                  className="order-btn-1"
                  // onClick={downloadCsv}
                  disabled={true}
                >
                  <i className="fa-solid fa-cloud-arrow-down"></i>
                  <p className="cursor">Download CSV</p>
                </button>

                <button
                  className="order-btn-2 cursor"
                  onClick={() => {
                    if (continueProfilePath) {
                      setModalShow(true);
                      return;
                    }
                    navigate("/factoryDashboard/addSourcingOffer");
                  }}
                >
                  <i className="fa-solid fa-plus"></i>
                  <p className="cursor">Add</p>
                </button>
              </div>
            </div>
          </div>

          {/* search filter section */}
          <SearchFilterByOrderPrice filtterData={filtterData} filter={filter} />

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
                          id="flexCheckDefault"
                        />
                      </div>
                      Product Name
                    </div>
                  </th>

                  <th className=" col-4">Description</th>

                  <th className=" col-1 ">Sent Date</th>
                  <th className=" col-1">Price</th>

                  <th className=" col-2">HSN Code</th>
                  <th className=" col-1">Status</th>

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
                            id="flexCheckDefault"
                          />
                        </div>
                        <td className="">
                          <div className="title-text-handler">
                            <p className="trate-title">{poItem?.productName}</p>
                          </div>
                        </td>
                      </div>
                    </th>

                    <th className=" col-4  d-flex align-items-center justify-content-between ">
                      <div className="trate-sub-title horizontal-text-handler">
                        {poItem?.productDescription}
                      </div>
                    </th>
                    <th className=" col-1  d-flex align-items-center justify-content-between ">
                      <p className="trate-sub-title">
                        {getMonthName(poItem?.createdAt?.split("T")?.[0])}
                      </p>
                    </th>

                    <th className=" col-1  d-flex align-items-center justify-content- ">
                      <div className="trate-sub-title horizontal-text-handler">
                        {poItem?.price}
                      </div>
                    </th>

                    <th className=" col-2  d-flex align-items-center justify-content- ">
                      <div className="trate-sub-title horizontal-text-handler">
                        {poItem?.productHSNCode}
                      </div>
                    </th>

                    <th className=" col-1  d-flex align-items-center justify-content- ">
                      <div className="status-continaer py-1 px-2">
                        <i
                          className={`fa-solid fa-circle ${poItem?.status}`}
                        ></i>
                        <p>{poItem?.status}</p>
                      </div>
                    </th>

                    <th className=" col-1 d-flex align-items-center justify-content-center  gap-icon-table">
                      <p
                        className="trate-sub-title view-more-details cursor"
                        title="view more details"
                        onClick={() => {
                          navigate(
                            `/factorydashboard/offers/moreDetails?factoryOffersId=${poItem?.id}&productName=${poItem?.name}`
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

                {/* is data is still loading or error occured */}
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
    </>
  );
}
