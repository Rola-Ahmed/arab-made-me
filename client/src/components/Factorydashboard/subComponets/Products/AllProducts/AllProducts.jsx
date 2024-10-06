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

          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>
                    <div className="d-flex justify-content-start align-items-center">
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
                  <th>Unit Price</th>
                  <th>Available</th>
                  <th>Order Quantity</th>
                  <th>Post Date</th>
                  <th>HSN Code</th>
                  <th>Guarantee</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {/* Data Rows */}
                {reqData?.map((poItem) => (
                  <tr key={poItem.id}>
                    <td>
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id={`productCheckbox-${poItem.id}`}
                          />
                        </div>
                        <div>
                          <p className="trate-title title-text-handler">
                            {poItem?.name}
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
                      </div>
                    </td>
                    <td>
                      <p className="trate-sub-title">${poItem?.price}</p>
                    </td>
                    <td>{poItem?.available ? "In stock" : "Out of stock"}</td>
                    <td>
                      <p>
                        {poItem?.minOrderQuantity}
                        {poItem?.maxOrderQuantity
                          ? ` - ${poItem?.maxOrderQuantity}`
                          : ""}
                      </p>
                    </td>
                    <td>
                      <p className="trate-sub-title">
                        {getMonthName(poItem?.createdAt?.split("T")[0])}
                      </p>
                    </td>
                    <td>{poItem?.hsnCode ?? ""}</td>
                    <td>{poItem?.guarantee ?? ""}</td>
                    <td>
                      <div className="d-flex justify-content-center  aligen-items-center gap-24">
                        <p
                          className="trate-sub-title view-more-details cursor"
                          title="View more details"
                          onClick={() =>
                            navigate(
                              `/factorydashboard/product/moreDetails?productId=${poItem.id}&productName=${poItem.name}`
                            )
                          }
                        >
                          <i className="fa-solid fa-up-right-from-square"></i>
                        </p>
                        <p
                          className="trate-sub-title view-more-details cursor"
                          title="Delete"
                          onClick={() => deleteData(poItem.id)}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Status Message */}
                <StatusMessage
                  reqDataLength={reqData?.length}
                  apiLoadingData={apiLoadingData?.reqData}
                  errorsMsg={apiLoadingData?.errorWhileLoading}
                />

                {/* Pagination */}
                <tr>
                  <td colSpan="8">
                    <div className="ReactPaginate">
                      <PaginationDash
                        pagination={pagination}
                        setPagination={setPagination}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
