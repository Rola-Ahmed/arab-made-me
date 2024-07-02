import React, { useEffect, useState, useContext } from "react";
import { handleImageError } from "utils/ImgNotFound";
// shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getTimeDifference as getTimeDiff } from "utils/getTimeDifference";

export default function ChatList() {
  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();
  let getTimeDifference = getTimeDiff;

  const [allPosData, setAllPosData] = useState([]);
  const [errorsMsg, setErrorsMsg] = useState();

  const [apiLoadingData, setapiLoadingData] = useState(true);
  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 8,
    currentPage: 1,
    totalPage: 1,
    // will be called by api
    // totalPage: Math.ceil((allProductsData?.length) /pagination.displayProductSize), // Use 30 as the default display size
  }));
  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );

  const [filter, setFilter] = useState({
    formsFilter: "",
    sort: "date-DESC",
    sort_name: "",
  });

  // utils function

  async function fetchFactoriesData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/chats/user/chats?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setAllPosData(response.data.chats);

        const uniqueIds = [
          ...new Set(
            response.data.chats.map(
              (obj) => obj.userTwoId // Extract all factoryIds
            ) // Filter out null values
          ),
        ];

        setUniqueFactoryIDofProducts(uniqueIds);
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
      }
    }
  }

  useEffect(() => {
    fetchFactoriesData();
  }, [pagination?.currentPage, filter]);

  useEffect(() => {
    // Promise.all(
    uniqueFactoryIDofProducts.map(async (item) => {
      try {
        const productResponse = await axios.get(`${baseUrl}/users/${item}`);

        if (productResponse.data.message === "done") {
          setAllPosData((prevData) =>
            //   loop on the array
            prevData.map((value) =>
              value?.userTwoId === item
                ? {
                    ...value,
                    userName: productResponse?.data?.users?.name?.join(" "),
                    userEmail: productResponse?.data?.users?.email,
                  }
                : value
            )
          );
        }
      } catch (error) {}
    });
  }, [apiLoadingData]);

  useEffect(() => {
    const fetchDataLenght = async () => {
      try {
        const response1 = await axios.get(
          //   `${baseUrl}/chats/user/chats?formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`,
          `${baseUrl}/chats/user/chats?formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`,
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
              (response1.data?.chats?.length || 0) /
                prevValue.displayProductSize
            ),
          }));
        }
      } catch (error) {}
    };

    fetchDataLenght();
  }, [filter]);

  return (
    <div className="m-4 order-section ">
      {/* section 1 */}
      <div className="header w-100">
        <PageUtility currentPage="Messages" />
        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2 className="m-0 ">Messages</h2>

            <div className="btn-container">
              <button className="order-btn-1 p-0">
                <i class="fa-regular fa-pen-to-square edit-btn-chat"></i>
              </button>
            </div>
          </div>
        </div>

        {/* search filter section */}
        {/* <div className=" search-container d-flex justify-content-between align-items-center p-3"> */}
        <div className="input-group ">
          <div className="input-group-prepend  cursor">
            <span className="input-group-text bg-white icon-search-container pe-0 cursor">
              <i className="fa-solid fa-magnifying-glass icon-search"></i>
            </span>
          </div>
          <input
            type="text"
            className="form-control input-search "
            placeholder="Search by product name"
            id="formsFilter"
          />
        </div>
        {/* </div> */}
        {/* data section */}

        <div className=" data-container w-100 p-3">
          <table className="table mb-0">
            {/* headers */}

            {/* <thead className="d-none"></thead> */}

            <tbody>
              {/* row1 */}
              {allPosData.map((poItem) => (
                <tr className="row goToChat" onClick={() => {}}>
                  <th
                    className=" col  d-grid align-items-center gap-16 cursor  "
                    // userOneId = current user
                    onClick={() =>
                      navigate(
                        `/importerdashboard/conversation?currentChat=${poItem?.id}`
                      )
                    }
                  >
                    <div className=" col  d-flex align-items-center mt-2 ">
                      <div className="active-circule me-2"></div>
                      <div className="gap-16 justify-content-start align-items-start d-flex">
                        <div className="profile-img-2">
                          <img
                            className="w-100 h-100"
                            src={`${baseUrl_IMG}/${poItem?.importerProfileImg}`}
                            onError={handleImageError}
                          />
                        </div>
                        <div className="d-grid gap-1 h-fit-content">
                          <p className="  trate-title lh-normal">
                            {poItem?.userName}
                          </p>
                          <p className=" email-text-2 lh-normal">
                            {poItem?.userEmail}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="ms-3  mb-2">
                      <p
                        className=" email-text-2
                      lh-normal"
                      >
                        {
                          poItem?.messages?.[poItem?.messages?.length - 1]
                            .message
                        }
                      </p>
                    </div>
                  </th>
                  <th className=" col-2 d-flex align-items-center justify-content-center gap-icon-table">
                    <small className="notifi-date text-muted  lh-base">
                      <i class="fa-regular fa-clock"></i>
                      <span className="pe-1">
                        {getTimeDifference(poItem?.createdAt)}
                      </span>
                    </small>

                    <div className="form-check d-none">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                    </div>
                  </th>
                </tr>
              ))}

              {allPosData?.length == 0 ? (
                <tr className="row">
                  <div className="col-12  w-100 h-100 my-5 py-5">
                    <div className="text-center">
                      <p className="trate-sub-title ">
                        {errorsMsg ?? "No Record"}
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
