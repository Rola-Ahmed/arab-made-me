import React, { useEffect, useState, useContext } from "react";

import ReactPaginate from "react-paginate";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getMonthName as getDate } from "utils/getMonthName";

export default function GetSourcingRequest() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let navigate = useNavigate();

  const [allSpmfsData, setAllSpmfsData] = useState([]);
  const [apiLoadingData, setapiLoadingData] = useState(true);
  const [errorsMsg, setErrorsMsg] = useState();

  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 8,
    currentPage: 1,
    totalPage: 1,
    // will be called by api
    // totalPage: Math.ceil((allProductsData?.length) /pagination.displayProductSize), // Use 30 as the default display size
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
        url: `${baseUrl}/importers/importer/sourcingRequests/?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);
      if (response?.data?.message == "done") {
        setAllSpmfsData(response.data.sourcingRequests);
      } else {
        setErrorsMsg(response?.data?.message);
      }
      setapiLoadingData(false);
    } catch (error) {
      setapiLoadingData(false);
      if (error.response && error.response.status) {
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
    fetchFactoriesData();
  }, [pagination?.currentPage, filter]);

  // utils function
  let getMonthName = getDate;

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
    const newArray = filterAttributes(allSpmfsData, attributesToFilter);

    // const csvData = convertToCsv(allSpmfsData);

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
          `${baseUrl}/importers/importer/sourcingRequests?formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`,
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
              (response1.data?.sourcingRequests?.length || 0) /
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

  const deleteData = async (itemId) => {
    try {
      let config = {
        method: "delete",
        url: `${baseUrl}/sourcingRequests/${itemId}`,
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

      setAllSpmfsData((prevValue) =>
        prevValue.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      toast("Something went wrong, please try again", {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        draggable: true,
        theme: "colored",
        type: "error",
      });
    }
    // }
  };

  return (
    <div className="m-4 order-section ">
      <ToastContainer />
      {/* section 1 */}
      <div className="header w-100">
        <PageUtility currentPage="Sourcing Requests" />
        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Sourcing Requests</h2>

            <div className="btn-container">
              <button
                className="order-btn-1"
                onClick={downloadCsv}
                disabled={!allSpmfsData.length}
              >
                <i className="fa-solid fa-cloud-arrow-down"></i>
                <p className="cursor">Download CSV</p>
              </button>

              <button
                className="order-btn-2 cursor"
                onClick={() => {
                  // if (
                  //   currentUserData?.importerId !== null &&
                  //   currentUserData?.importerId !== undefined
                  // ) {
                  //   localStorage.setItem("ToHomePage", "Page Not Found");
                  //   navigate("/");
                  //   return;
                  // }
                  // if (
                  //   currentUserData?.factoryId !== null &&
                  //   (currentUserData?.factoryVerified === "0" ||
                  //     !currentUserData?.factoryEmailActivated)
                  // ) {
                  //   setModalShow((prevVal) => ({
                  //     ...prevVal,
                  //     isFactoryVerified: true,
                  //   }));

                  //   return;
                  // } else if (!isLogin) {
                  //   setModalShow((prevVal) => ({
                  //     ...prevVal,
                  //     isLogin: true,
                  //   }));

                  //   setisLoggedReDirect(`signIn/factoryDashboard/addProduct`);
                  //   return;
                  // }

                  navigate(`/importerdashboard/add/sourcingRequest`);
                }}
              >
                <i className="fa-solid fa-plus"></i>
                <p className="cursor">Add</p>
              </button>
            </div>
          </div>
        </div>

        {/* */}

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
              id="formsFilter"
              placeholder="search by product name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  filtterData(e.target.value, "formsFilter");
                }
              }}
            />
          </div>

          {/* <div className=" btn-container d-flex justify-content-between align-items-center">
            

            <button className=" dropdown-toggle order-toggle d-flex justify-content-center align-items-center">
              <i className="fa-solid fa-filter"></i>
              <p>Filter</p>
            </button>
          </div> */}

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
                {/* <li
                  onClick={(e) => {
                    filtterData("rate", "sort", "Rate");
                  }}
                  className=" cursor  text-start"
                >
                  <a class="dropdown-item">Rate</a>
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

                <th className=" col-4">Specifications (Keyword,description)</th>

                {/* <th className=" col-1">Docs</th> */}

                {/* <th className=" col-2">Unit Price</th> */}

                <th className=" col-1 ">Sent Date</th>

                <th className=" col-1">DeadLine</th>

                <th className=" col-3">product Description</th>

                <th className=" col-1"></th>
              </tr>
            </thead>

            <tbody>
              {/* row1 */}
              {allSpmfsData.map((poItem) => (
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
                      {/* {poItem?.specialCharacteristics} */}

                      {Object.entries(poItem?.specialCharacteristics).map(
                        ([key, value], index) => (
                          <div key={key} className="py-1 ">
                            <p>
                              <span className="fw-bolder text-dark ">
                                Keyword{index + 1}:
                              </span>
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </th>
                  <th className=" col-1  d-flex align-items-center justify-content-between ">
                    <p className="trate-sub-title">
                      {getMonthName(poItem?.createdAt?.split("T")?.[0])}
                    </p>
                  </th>

                  <th className=" col-1  d-flex align-items-center justify-content- ">
                    <p className="trate-sub-title">
                      {getMonthName(poItem?.deadline?.split("T")?.[0])}
                    </p>
                  </th>

                  <th className=" col-3  d-flex align-items-center justify-content- ">
                    {/* <div className="profile-container justify-content-start align-items-center d-flex">
                      <div className="profile-img">
                        <img className="w-100 h-100" src={profile} />
                      </div>
                      <div>
                        <p className="name-text">{poItem?.factoryName}</p>
                        <p className="email-text">{poItem?.factoryRepEmail}</p>
                      </div>
                    </div> */}

                    <div className="trate-sub-title horizontal-text-handler">
                      {/* {poItem?.specialCharacteristics} */}

                      <p className="name-text">{poItem?.productDescription}</p>
                    </div>
                  </th>

                  <th className=" col-1 d-flex align-items-center justify-content-center  gap-icon-table">
                    <p
                      className="trate-sub-title view-more-details cursor"
                      title="view more details"
                      onClick={() => {
                        navigate(
                          `/importerdashboard/sourcingReq/moreDetails?sourcingReqId=${poItem?.id}&factoryName=${poItem?.factoryName}`
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
                      {/* view */}
                      <i class="fa-regular fa-trash-can"></i>
                    </p>
                  </th>
                </tr>
              ))}

              {allSpmfsData?.length == 0 ? (
                <tr className="row">
                  <div className="col-12  w-100 h-100 my-5 py-5">
                    <div className="text-center">
                      <p className="trate-sub-title ">
                        {apiLoadingData ? (
                          <div
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
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
                    pageCount={pagination?.totalPage || 1} // total number to pages
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
