import React, { useEffect, useState, useContext } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import StarRating from "components/Shared/stars";
import { UserToken } from "Context/userToken";
import { ToastContainer, toast } from "react-toastify";
import { handleImageError } from "utils/ImgNotFound";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";

// containers (fetch data)
import PrivateLabelNotification from "containers/Admindashboard/Notifcations/PrivateLabelNotification";

export default function PrivateLabelAdmin() {
  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();

  let getMonthName = getDate;

  const [allprivateLabelData, setAllprivateLabelData] = useState([]);
  const [apiLoadingData, setapiLoadingData] = useState(true);
  const [errorsMsg, setErrorsMsg] = useState();
  const [pagination, setPagination] = useState(() => ({
    displayProductSize: 8,

    currentPage: 1,
    // will be called by api
    totalPage: 1,
  }));

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

  async function fetchFactoriesData() {
    setapiLoadingData(true);
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/privateLabelings?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}&include=factory&include=importer&include=product`,
      };

      const response = await axios.request(config);
      if (response?.data?.message == "done") {
        setAllprivateLabelData(response.data.privatelabelings);
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

          //  429 Too Many Requests
          // The user has sent too many requests in a given amount of time ("rate limiting").
          case 429:
            setErrorsMsg(" Too Many Requests , Please try again later.");
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
      } else {
        setErrorsMsg("An unexpected error occurred. Please try again later.");
      }
    }
  }

  useEffect(() => {
    fetchFactoriesData();
  }, [pagination?.currentPage, filter]);

  const downloadCsv = () => {
    const attributesToFilter = [
      "productId",
      "factoryId",
      "importerId",
      "updatedAt",
      "docs",
      "importerProfileImg",
    ];
    // ,"contactData"
    const newArray = filterAttributes(allprivateLabelData, attributesToFilter);

    // const csvData = convertToCsv(allprivateLabelData);

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

  useEffect(() => {
    const fetchDataLenght = async () => {
      try {
        const response1 = await axios.get(
          `${baseUrl}/privateLabelings?formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`,
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
              (response1.data?.privatelabelings?.length || 0) /
                prevValue.displayProductSize
            ),
          }));
        }
      } catch (error) {}
    };

    fetchDataLenght();
  }, [filter]);

  const handlePageClick = (currentPage) => {
    // why plus 1 bec react pagination library reads the 1st page with index 0 but in api  is read with index 1
    setPagination((prevValue) => ({
      ...prevValue,
      currentPage: currentPage.selected + 1,
    }));
  };

  return (
    <div className="m-4 order-section ">
      {/* me-5 ms-5 mb-5 mt-2 "> */}

      <ToastContainer />

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

                <PrivateLabelNotification />
              </div>
              <button
                className="order-btn-1"
                onClick={downloadCsv}
                disabled={!allprivateLabelData?.length}
              >
                <i className="fa-solid fa-cloud-arrow-down"></i>
                <p className="cursor">Download CSV</p>
              </button>
            </div>
          </div>
        </div>

        {/* search filter section */}
        <div className=" search-container d-flex justify-content-between align-items-center p-3">
          <div className="input-group width-size">
            <div
              className="input-group-prepend cursor "
              onClick={(e) => {
                let value = document.getElementById("formsFilter").value;
                filtterData(value, "formsFilter");
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
              id="formsFilter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  filtterData(e.target.value, "formsFilter");
                }
              }}
            />
          </div>

          <div className=" btn-container d-flex justify-content-between align-items-center">
            <div class="dropdown">
              <button
                className=" dropdown-toggle order-toggle d-flex justify-content-center align-items-center"
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
                {/* <li     onClick={(e) => {
                    filtterData("rate", "sort","Rate");
                  }}
                  className=" cursor  text-start">
                  <a class="dropdown-item" >
                    Rate
                  </a>
                </li> */}

                <li
                  onClick={(e) => {
                    filtterData("price-ASC", "sort", "Price :Low to High");
                  }}
                  className=" cursor  text-start"
                >
                  <a class="dropdown-item">Price :Low to High</a>
                </li>

                <li
                  onClick={(e) => {
                    filtterData("date-DESC", "sort", "Price :High to Low");
                  }}
                  className=" cursor  text-start"
                >
                  <a class="dropdown-item">Price :High to Low</a>
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

                <th className=" col-4">Factory Data</th>

                <th className=" col-1 ">Sent Date</th>

                <th className=" col-1">Status</th>

                <th className=" col-3">Executed By</th>

                <th className=" col-1"></th>
              </tr>
            </thead>

            <tbody>
              {/* row1 */}
              {allprivateLabelData?.map((poItem) => (
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
                          <p className="trate-title">
                            {poItem?.product?.name ?? "Private Label Product"}
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

                  <th className=" col-4  d-flex align-items-center justify-content- ">
                    <div className="profile-container justify-content-start align-items-center d-flex">
                      <div className="profile-img">
                        <img
                          className="w-100 h-100"
                          src={`${baseUrl_IMG}/${poItem?.factory?.CoverImage}`}
                          onError={handleImageError}
                        />
                      </div>
                      <div>
                        <p className=" name-text">{poItem?.factory?.name}</p>
                        <p className=" email-text">
                          {poItem?.factory?.repEmail}
                        </p>
                      </div>
                    </div>
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
                          src={`${baseUrl_IMG}/${poItem?.importer?.image}`}
                          onError={handleImageError}
                        />
                      </div>
                      <div>
                        <p className=" name-text">{poItem?.importer?.name}</p>
                        <p className=" email-text">
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
                          `/factorydashboard/PrivateLabelReq/moreDetails?privateLabelId=${poItem?.id}&factoryName=${poItem?.factoryName}`
                        );
                      }}
                    >
                      {/* view */}
                      <i class="fa-solid fa-up-right-from-square"></i>
                    </p>
                    {/* <p
                      className="trate-sub-title view-more-details cursor"
                      title="delete the form"
                      onClick={() => {
                        deleteData(poItem?.id);
                      }}
                    >
                      <i class="fa-regular fa-trash-can"></i>
                    </p> */}
                  </th>
                </tr>
              ))}

              {allprivateLabelData?.length == 0 ? (
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
                  <ReactPaginate
                    previousLabel={
                      <p>
                        <i className="fa-solid fa-arrow-left pe-2 text-dark "></i>
                        previous
                      </p>
                    }
                    nextLabel={
                      <p>
                        next
                        <i className="fa-solid fa-arrow-right ps-2 text-dark "></i>
                      </p>
                    }
                    pageCount={pagination?.totalPage ?? 1} // total number to pages
                    forcePage={0} //to set a page to start with, defult middle page
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    marginPagesDisplayed={1}
                    containerClassName="pagination align-items-center justify-content-center"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    activeClassName="active"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    previousClassName="page-item-prev  me-3"
                    previousLinkClassName="page-link text-dark margin-prev"
                    nextClassName="page-item-next ms-3"
                    nextLinkClassName="page-link text-dark margin-next"
                    navClassName="pagination-custom"
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
