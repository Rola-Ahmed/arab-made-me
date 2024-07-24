import { useState, useContext } from "react";
import { handleImageError } from "utils/ImgNotFound";
// shared components
import PaginationDash from "components/Shared/Dashboards/PaginationDash";
import { baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { useNavigate } from "react-router-dom";
import PageUtility from "components/Shared/Dashboards/PageUtility";
import { getTimeDifference as getTimeDiff } from "utils/getTimeDifference";
import useAllUserChats from "./useAllUserChats";
import StatusMessage from "components/Shared/Dashboards/StatusMessage";

export default function ChatList() {
  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();
  let getTimeDifference = getTimeDiff;

  const [filter, setFilter] = useState({
    formsFilter: "",
    sort: "date-DESC",
    sort_name: "",
  });

  // utils function

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
  } = useAllUserChats(isLogin, filter);

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
          <div
            className="input-group-prepend  cursor"
            onClick={(e) => {
              let value = document.getElementById("formsFilter").value;
              filtterData(value, "formsFilter");
            }}
          >
            <span className="input-group-text bg-white icon-search-container pe-0 cursor">
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
        {/* </div> */}
        {/* data section */}

        <div className=" data-container w-100 p-3">
          <table className="table mb-0">
            {/* headers */}

            {/* <thead className="d-none"></thead> */}

            <tbody>
              {/* row1 */}
              {reqData?.map((poItem) => (
                <tr className="row goToChat" onClick={() => {}}>
                  <th
                    className=" col  d-grid align-items-center gap-16 cursor  "
                    // userOneId = current user
                    onClick={() =>
                      navigate(
                        `/factorydashboard/conversation?currentChat=${poItem?.id}`
                      )
                    }
                  >
                    <div className=" col  d-flex align-items-center mt-2 ">
                      <div className="active-circule me-2"></div>
                      <div className="gap-16 justify-content-start align-items-start d-flex">
                        <div className="profile-img-2">
                          <img
                            className="w-100 h-100"
                            src={`${baseUrl_IMG}/${poItem?.UserTwoImage}`}
                            onError={handleImageError}
                          />
                        </div>
                        <div className="d-grid gap-1 h-fit-content">
                          <p className="  trate-title lh-normal">
                            {poItem?.UserTwoName}
                          </p>
                          <p className=" email-text-2 lh-normal">
                            {poItem?.UserTwoEmail}
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
                      <i class="fa-regular fa-clock me-1"></i>
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
