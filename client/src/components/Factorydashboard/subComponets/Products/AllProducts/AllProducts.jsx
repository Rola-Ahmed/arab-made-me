import { useState } from "react";

// shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";

import StarRating from "components/Shared/stars";
import { useNavigate } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import useAllProducts from "./useAllProducts";
import StatusMessage from "components/Shared/Dashboards/StatusMessage";
import SearchFilterByOrderPrice from "components/Shared/Dashboards/SearchFilterByOrderPrice";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";

export default function GetProducts() {
  let navigate = useNavigate();

  const [filter, setFilter] = useState({
    formsFilter: "",
    sort: "",
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

  const [modalShow, setModalShow] = useState(false);

  let {
    reqData,
    pagination,
    apiLoadingData,
    setPagination,
    deleteData,
    continueProfilePath,
  } = useAllProducts(filter);

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
          <PageUtility currentPage="Products" />
          <div>
            <div className=" d-flex justify-content-between align-items-center ">
              <h2>All Products</h2>

              <div className="btn-container">
                {/* will use it again */}

                {/* <button className="order-btn-1" disabled={false}>
                  <i className="fa-solid fa-cloud-arrow-down"></i>
                  <p className="cursor">Download CSV</p>
                </button> */}

                <button
                  className="order-btn-2 cursor"
                  onClick={() => {
                    if (continueProfilePath) {
                      setModalShow(true);
                      return;
                    }
                    navigate("/factoryDashboard/addProduct");
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

          {/* data section */}

          {/* <div className=" data-container w-100 p-3 table-responsive"> */}
          <div className=" table-responsive-xxl">
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

                  <th className=" col-1 ">Available</th>
                  <th className=" col-1 ">Order Quantity</th>

                  <th className=" col-2 pe-1 ">Post Date</th>
                  <th className=" col-2 ">hsn Code</th>

                  <th className=" col-2 ps-4">guarantee</th>

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
                        <td className="">
                          <div className="title-text-handler">
                            <p className="trate-title">{poItem?.name} </p>
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

                    <th className=" col-1 d-flex align-items-center ">
                      <p className="trate-sub-title">${poItem?.price}</p>
                    </th>

                    <th className=" col-1 d-flex align-items-center  ">
                      <div>
                        {poItem?.available ? "instock" : "out of stock"}
                      </div>
                    </th>

                    <th className=" col-1 d-flex align-items-center  ">
                      <p className="">
                        {poItem?.minOrderQuantity}
                        {`${
                          poItem?.maxOrderQuantity
                            ? "-" + poItem?.maxOrderQuantity
                            : ""
                        }`}
                      </p>
                    </th>
                    <th className=" col-2  d-flex align-items-center  pe-1 ">
                      <p className="trate-sub-title">
                        {getMonthName(poItem?.createdAt?.split("T")?.[0])}
                      </p>
                    </th>

                    <th className=" col-2  d-flex align-items-center ">
                      <p>{poItem?.hsnCode ?? ""} </p>
                    </th>

                    <th className=" col-2  d-flex align-items-center ps-4">
                      <p>{poItem?.guarantee ?? ""} </p>
                    </th>

                    <th className=" col-1 d-flex align-items-center justify-content-center gap-icon-table">
                      <p
                        className="trate-sub-title view-more-details cursor"
                        title="view more details"
                        onClick={() => {
                          navigate(
                            `/factorydashboard/product/moreDetails?productId=${poItem?.id}&productName=${poItem?.name}`
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
