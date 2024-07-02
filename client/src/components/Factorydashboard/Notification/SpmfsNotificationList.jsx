import React, { useRef } from "react";
import { baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";
import { useNavigate } from "react-router-dom";

// utils
import { getTimeDifference as getTimeDiff } from "utils/getTimeDifference";
import { getMonthName as getDate } from "utils/getMonthName";

export default function SpmfsNotificationList(props) {
  let { isLoading, notifcationData, page, handleDisplayPrevData, totalPage } =
    props;

  let currentScroller = useRef(null);

  let navigate = useNavigate();

  // utils function
  let getTimeDifference = getTimeDiff;
  let getMonthName = getDate;

  // Function to send data to the parent component
  const sendDataToParentOnClick = () => {
    if (totalPage == page) return;
    handleDisplayPrevData(page + 1);
  };
  return (
    <>
      <ul
        ref={currentScroller}
        className=" dropdown-menu show-notifi-drop "
        onScroll={() => {
          // hight of the div x.current.scrollHeight
          // scrollTop is a non-rounded number, while scrollHeight and clientHeight are rounded — so the only way to determine if the scroll area is scrolled to the bottom is by seeing if the scroll amount is close enough to some threshold (in this example 1):

          // means the scroll is at the bottom
          if (
            Math.abs(
              currentScroller.current.scrollHeight -
                currentScroller.current.clientHeight -
                currentScroller.current.scrollTop
            ) <= 1
          ) {
            sendDataToParentOnClick();
          }
        }}
      >
        <div className="header-dropdowm">
          <h4 className="fw-bolder dropdown-item text ">Notifcations</h4>
        </div>

        {notifcationData?.map((item) => (
          <div
            className={`dropdown-item  cont-notif  ${
              item?.status === "open" && "active-Notifi"
            }`}
          >
            <div className="d-grid gap-4 grid-col-size">
              <div className="profile-img">
                <img
                  src={`${baseUrl_IMG}/${item?.importer?.image}`}
                  // alt="user image"
                  alt={`${baseUrl_IMG}/${item?.importer?.image}`}
                  onError={handleImageError}
                  className="w-100 h-100"
                />
              </div>
              <div className="d-grid gap-2">
                <div className="d-grid gap-0">
                  <small className="d-block  lh-base text-truncate req-name-noti">
                    {item?.importer?.name} sent you a request
                  </small>
                  <small className="notifi-date text-muted  lh-base">
                    <i class="fa-regular fa-clock"></i>
                    <span className="pe-1">
                      {getTimeDifference(item?.createdAt)}
                    </span>
                    <span>{getMonthName(item?.createdAt.split("T")?.[0])}</span>
                  </small>
                </div>
                <button
                  className="order-btn-1 btn-2 w-100"
                  onClick={() => {
                    navigate(
                      `/factorydashboard/customProductReq/moreDetails?customProductId=${item?.id}`
                      // &factoryName=undefined
                    );
                  }}
                >
                  <p className="font-size-btn cursor">View Request</p>
                </button>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="dropdown-item  cont-notif text-center  ">
            <>
              <i className="fas fa-spinner fa-spin"></i>
            </>
          </div>
        )}
      </ul>
    </>
  );
}
