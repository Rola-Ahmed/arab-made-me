import { useEffect, useState, useContext } from "react";

// shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import StarRating from "components/Shared/stars";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FactoryUnVerifiedModal from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";

export default function GetProducts() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let navigate = useNavigate();

  const [allPosData, setAllPossData] = useState([]);
  const [apiLoadingData, setapiLoadingData] = useState(true);
  const [errorsMsg, setErrorsMsg] = useState();
  const [filter, setFilter] = useState({
    filter: "",
    sort: "",
    sort_name: "",
  });
  const [modalShow, setModalShow] = useState(false);
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  // utils function
  let getMonthName = getDate;

  function filtterData(value, keyword, name) {
    setFilter((prevValue) => ({
      ...prevValue,
      [keyword]: value,
      ...(name && { sort_name: name }),
    }));
  }

  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 8,

    currentPage: 1,
    totalPage: 1,
    // will be called by api
    // totalPage: Math.ceil((allProductsData?.length) /pagination.displayProductSize), // Use 30 as the default display size
  }));

  async function fetchFactoriesData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/products/${currentUserData.factoryId}/?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&filter=${filter?.filter}&sort=${filter?.sort}`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setAllPossData(
          response.data.products.filter((item) => item?.factoryId !== null)
        );
      } else {
        setErrorsMsg(response?.data?.message);
      }

      setapiLoadingData(false);
    } catch (error) {
      setapiLoadingData(false);
      if (error.response) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            setErrorsMsg(error?.data?.errorMessage);
            break;
          case 401:
            setErrorsMsg(error?.response?.data?.message);
            break;
          case 403:
            setErrorsMsg(
              // error?.data?.message,
              error?.response?.data?.message
            );
            break;
          case 404:
            setErrorsMsg(
              "Not Found (404). The requested resource was not found."
            );
            break;

          case 500:
            setErrorsMsg(error?.response?.data?.errorMessage);
            break;

          case 402:
            // 402
            setErrorsMsg(error?.response?.data?.message);
            break;
          default:
            // case message== error
            setErrorsMsg(error?.response?.data?.errorMessage);
            break;
        }
      }
    }
  }

  useEffect(() => {
    if (currentUserData && currentUserData?.factoryId) {
      fetchFactoriesData();
    }
  }, [pagination?.currentPage, currentUserData, filter]);

  const downloadCsv = () => {
    const attributesToFilter = [
      "productId",
      "factoryId",
      "importerId",
      "quotationId",
      "sourcingOfferId",
      "updatedAt",
      "docs",
      "importerProfileImg",

      "coverImage",
      "images",
      "available",
      //   "specialCharacteristics": null,
      // "guarantee",
      "averageRate",
      //   "country": null,
      "city",
      "updatedAt",
      //   "sectorId": 1,
      //   "categoryId": 2
    ];
    // ,"contactData"
    const newArray = filterAttributes(allPosData, attributesToFilter);

    // const csvData = convertToCsv(allPosData);

    const csvData = convertToCsv(newArray);

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "allProducts.csv";
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
          if (key === "contactData") {
            acc["RepresentiveEmail"] = originalObject[key]?.email;
            acc["RepresentivePhone"] = originalObject[key]?.phone;
          } else if (
            key === "timeLine" &&
            Array.isArray(originalObject[key]) &&
            originalObject[key].length > 0
          ) {
            acc["TimeLineData"] = originalObject[key]
              .map((item, index) => (
                <p className="trate-sub-title">
                  `date${index + 1}:${item?.date} - quantity${index + 1}:$
                  {item?.quantity}`
                </p>
              ))
              .join(", ");
          } else {
            acc[key] = originalObject[key];
          }

          return acc;
        }, {});

      return filteredObject;
    });
  };

  useEffect(() => {
    const fetchDataLenght = async () => {
      try {
        // const response1 = await axios.get(`${baseUrl}/products`);
        const response1 = await axios.get(
          `${baseUrl}/factories/products/${currentUserData.factoryId}?filter=${filter?.filter}&sort=${filter?.sort}`,
          {
            headers: {
              authorization: isLogin,
            },
          }
        );

        if (response1?.data?.message === "done") {
          setPagination((prevValue) => ({
            ...prevValue,
            totalPage: Math.ceil(
              (response1.data?.products?.length || 0) /
                prevValue.displayProductSize
            ),
          }));
        } else {
          setErrorsMsg(response1?.data?.message);
        }
      } catch (error) {}
    };

    if (currentUserData && currentUserData?.factoryId) {
      fetchDataLenght();
    }
  }, [currentUserData, pagination?.currentPage, filter]);

  const deleteData = async (itemId) => {
    try {
      let config = {
        method: "delete",
        url: `${baseUrl}/products/delete/fromUser/${itemId}`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      toast("Data Deleted Successfully", {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        draggable: true,
        theme: "colored",
        type: "success",
      });

      setAllPossData((prevValue) =>
        prevValue.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      // setapiLoadingData(true);

      toast("Something went wrong, please try again later", {
        position: "top-center",
        autoClose: 5000,
        // hideProgressBar: false,
        closeOnClick: true,
        //pauseOnHover: true,
        draggable: true,
        // progress: undefined,
        theme: "colored",
        type: "error",
      });
    }
    // }
  };

  return (
    <div className="m-4 order-section ">
      <IsLoggedIn
        show={modalShow.isLogin}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
        distination={isLoggedReDirect}
      />

      <FactoryUnVerifiedModal
        show={modalShow.isFactoryVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isFactoryVerified: false,
          }))
        }
        userType="Factory"
      />

      <ToastContainer />

      {/* section 1 */}
      <div className="header w-100">
        <PageUtility currentPage="Products" />
        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>All Products</h2>

            <div className="btn-container">
              <button
                className="order-btn-1"
                onClick={downloadCsv}
                disabled={!allPosData.length}
              >
                <i className="fa-solid fa-cloud-arrow-down"></i>
                <p className="cursor">Download CSV</p>
              </button>

              <button
                className="order-btn-2 cursor"
                onClick={() => {
                  if (
                    currentUserData?.importerId !== null &&
                    currentUserData?.importerId !== undefined
                  ) {
                    localStorage.setItem("ToHomePage", "Page Not Found");
                    navigate("/");
                    return;
                  }
                  if (
                    currentUserData?.factoryId !== null &&
                    (currentUserData?.factoryVerified === "0" ||
                      !currentUserData?.factoryEmailActivated)
                  ) {
                    setModalShow((prevVal) => ({
                      ...prevVal,
                      isFactoryVerified: true,
                    }));

                    return;
                  } else if (!isLogin) {
                    setModalShow((prevVal) => ({
                      ...prevVal,
                      isLogin: true,
                    }));

                    setisLoggedReDirect(`signIn/factoryDashboard/addProduct`);
                    return;
                  }

                  navigate("/factoryDashboard/addProduct");
                }}

                // onClick={() => {

                //
                //   navigate("/factoryDashboard/addProduct");
                // }}
              >
                <i className="fa-solid fa-plus"></i>
                <p className="cursor">Add</p>
              </button>
            </div>
          </div>
        </div>

        {/* search filter section */}
        <div className=" search-container d-flex justify-content-between align-items-center p-3">
          <div className="input-group width-size">
            <div
              className="input-group-prepend cursor"
              onClick={(e) => {
                let value = document.getElementById("filter").value;
                filtterData(value, "filter");
              }}
            >
              <span
                className="input-group-text bg-white icon-search-container pe-0"
                id="inputGroup-sizing-default"
              >
                <i className="fa-solid fa-magnifying-glass icon-search"></i>
              </span>
            </div>
            <input
              type="text"
              className="form-control input-search "
              placeholder="Search by product name"
              id="filter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  filtterData(e.target.value, "filter");
                }
              }}
            />
          </div>

          <div className=" btn-container d-flex justify-content-between align-items-center">
            <div class="dropdown">
              <button
                className=" dropdown-toggle order-toggle d-flex justify-content-center align-items-center cursor"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa-solid fa-filter"></i>
                <p>
                  {filter?.sort_name !== "" ? filter?.sort_name : "Sort By"}
                </p>
              </button>

              <ul class="dropdown-menu">
                <li
                  onClick={(e) => {
                    filtterData("date-DESC", "sort", "Sort By");
                  }}
                  className=" cursor text-start"
                >
                  <p className="dropdown-item">Sort By</p>
                </li>

                <li
                  onClick={(e) => {
                    filtterData("date-ASC", "sort", "Oldest");
                  }}
                  className=" cursor  text-start"
                >
                  <p className="dropdown-item">Oldest</p>
                </li>
                <li
                  onClick={(e) => {
                    filtterData("date-DESC", "sort", "Newest");
                  }}
                  className=" cursor  text-start"
                >
                  <p className="dropdown-item">Newest</p>
                </li>
                <li
                  onClick={(e) => {
                    filtterData("rate", "sort", "Rate");
                  }}
                  className=" cursor  text-start"
                >
                  <a class="dropdown-item" href="#">
                    Rate
                  </a>
                </li>

                <li
                  onClick={(e) => {
                    filtterData("price-ASC", "sort", "Price :Low to High");
                  }}
                  className=" cursor  text-start"
                >
                  <a class="dropdown-item" href="#">
                    Price :Low to High
                  </a>
                </li>

                <li
                  onClick={(e) => {
                    filtterData("date-DESC", "sort", "Price :High to Low");
                  }}
                  className=" cursor  text-start"
                >
                  <a class="dropdown-item" href="#">
                    Price :High to Low
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
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

                <th className=" col-1 ">Available</th>
                <th className=" col-1 ">Order Quantity</th>

                <th className=" col-1 pe-1 ">Post Date</th>
                <th className=" col-1 ">sku</th>
                <th className=" col-2 ">hsn Code</th>

                <th className=" col-2 ps-4">guarantee</th>

                <th className=" col-1"></th>
              </tr>
            </thead>

            <tbody>
              {/* row1 */}
              {allPosData.map((poItem) => (
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
                    <div>{poItem?.available ? "instock" : "out of stock"}</div>
                  </th>

                  <th className=" col-1 d-flex align-items-center  ">
                    <p className="">
                      {/* {poItem?.minOrderQuantity}-{poItem?.maxOrderQuantity} */}

                      {poItem?.minOrderQuantity}
                      {`${
                        poItem?.maxOrderQuantity
                          ? "-" + poItem?.maxOrderQuantity
                          : ""
                      }`}
                    </p>
                  </th>
                  <th className=" col-1  d-flex align-items-center  pe-1 ">
                    <p className="trate-sub-title">
                      {getMonthName(poItem?.createdAt?.split("T")?.[0])}
                    </p>
                  </th>

                  <th className=" col-1  d-flex align-items-center ">
                    <p>{poItem?.sku ?? ""} </p>
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
                      <i class="fa-solid fa-up-right-from-square"></i>
                    </p>
                    <p
                      className="trate-sub-title view-more-details cursor"
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

              {allPosData?.length == 0 ? (
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
                        ) : errorsMsg ? (
                          errorsMsg
                        ) : (
                          "No Records Found"
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
