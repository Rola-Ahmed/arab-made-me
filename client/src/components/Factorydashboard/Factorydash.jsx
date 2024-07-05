import React, { useContext, useEffect, useState, useRef } from "react";

import "./Factorydash.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import { logo } from "constants/Images";

import { GlobalMsgContext } from "Context/globalMessage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FactoryInfo from "./subComponets/FactoryInfo";
import DashLogo from "components/Shared/Dashboards/DashLogo";
function Factorydash(props) {
  let { notification, setIsLogin, factoryProfile } = props;
  // State the clicked menu
  const [activeMenu, setActiveMenu] = useState("");
  // starte from the top of the page at navigation
  const location = useLocation();
  const { pathname } = useLocation();
  // const scrollRef = useRef(null);

  useEffect(() => {
    // const navEntries = window.performance.getEntriesByType("navigation");
    // if (!scrollRef.current?.baseURI.includes(pathname)) {
    //   scrollRef.current.scrollTo({
    //     top: 0,
    //     left: 0,
    //     behavior: "instant",
    //   });
    // }
    // console.log("scrollRef",scrollRef.current?.baseURI.includes(pathname), pathname,scrollRef.current?.baseURI);
    // window.scrollTo({
    //   top: 0,
    //   left: 0,
    //   behavior: "instant",
    // });
    // console.log("factory pathname",pathname)
  }, [pathname]);

  // used this to highlight the current tap
  const currentPathname = location.pathname.split("/");
  const currentNavPage =
    currentPathname[currentPathname.length - 1]?.toLowerCase();

  // Title
  useEffect(() => {
    document.title = "Factory Dashboard";
  }, []);

  // Toast on global message change
  const { globalMsg, setGlobalMsg } = useContext(GlobalMsgContext);
  useEffect(() => {
    if (globalMsg !== "") {
      toast(globalMsg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        theme: "colored",
        type: "success",
        onClose: () => {
          setGlobalMsg("");
        },
      });
    }
  }, [globalMsg]);

  return (
    <section className="factory-dashboard vh-100 overflow-hidden  vw-100">
      <ToastContainer />

      <div className="row h-100 w-100 remove-x">
        <div className="col-2 left-nav-fac-dashboard h-100 d-grid">
          <div className="static-navbar">
            <DashLogo />

            <div className="scroller-container">
              <div className="page-sub-menu">
                <div
                  className="p-0
                   m-0
                  text-decoration-none
                  text-dark
                  w-100
                 position-relative
              "
                >
                  <Link
                    className={`base-btn  cursor dashboard-color  ${
                      currentNavPage == "factorydashboard" ? "active" : ""
                    } text-decoration-none`}
                    to=""
                  >
                    <i className="fa-solid fa-box-open"></i>
                    <p className="sub-title cursor">Dashboard</p>
                  </Link>
                </div>

                {/* pprofile */}
                <div className="">
                  <Link
                    className={`base-btn cursor text-decoration-none ${
                      currentNavPage == "factoryprofile" ? "active" : ""
                    }
                  `}
                    id="factoryProfile"
                    // to="#"
                    to="factoryProfile#accountInformation"
                    onClick={() => {
                      let dropdown = document.getElementById("drop-profile");
                      let dropicon = document.getElementById("factoryProfile");

                      dropdown.classList.toggle("d-block");
                      dropicon
                        .querySelector(".caret")
                        .classList.toggle("fa-caret-up");
                      dropicon
                        .querySelector(".caret")
                        .classList.toggle("fa-caret-down");
                    }}
                  >
                    <i class="fa-solid fa-user"></i>
                    <p className="sub-title cursor">Profile</p>
                    <i
                      class={`fa-solid caret  fa-caret-down
                       text-white`}
                    ></i>
                  </Link>
                  {/* drop down */}
                  <div id="drop-profile" className={`dropdwon-menu-style `}>
                    {/*  */}
                    <Link
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("accountInformation")
                          ? "active"
                          : ""
                      }`}
                      to="factoryProfile#accountInformation"
                      onClick={() => {
                        setActiveMenu("accountInformation");
                      }}
                    >
                      <div className="d-flex  align-items-center sub-icon-pro">
                        <i className="fa-solid fa-gears pe-2 text-white"></i>
                        <p className="sub-text cursor ">Account Inforamtion</p>
                      </div>
                    </Link>
                    {/*  */}
                    <Link
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("PasswordChange")
                          ? "active"
                          : ""
                      }`}
                      to="factoryProfile#PasswordChange"
                      onClick={() => {
                        setActiveMenu("PasswordChange");
                      }}
                    >
                      <div className="d-flex  align-items-center sub-icon-pro">
                        <i className="fa-solid fa-lock pe-2 text-white"></i>
                        <p className="sub-text cursor ">Password Change</p>
                      </div>
                    </Link>

                    <Link
                      //
                      offset={-117}
                      to="factoryProfile#EmailNotification"
                      onClick={() => {
                        setActiveMenu("EmailNotification");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("EmailNotification")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-icon-pro">
                        <i className="fa-solid fa-bell pe-2 text-white"></i>
                        <p className="sub-text cursor ">Notifications</p>
                      </div>
                    </Link>

                    <Link
                      to="factoryProfile#legalDocs"
                      onClick={() => {
                        setActiveMenu("legalDocs");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("legalDocs")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-icon-pro">
                        <i className="fa-solid fa-file-circle-check pe-2 text-white"></i>
                        <p className="sub-text cursor ">Legal Documents</p>
                      </div>
                    </Link>

                    <Link
                      to="factoryProfile#subscriptionPlan"
                      onClick={() => {
                        setActiveMenu("subscriptionPlan");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("subscriptionPlan")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-icon-pro">
                        <i className="fa-solid fa-envelope-circle-check pe-2 text-white"></i>
                        <p className="sub-text cursor ">Subscription Plan</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* mircosite page */}

                <div className="">
                  <Link
                    className={`base-btn cursor text-decoration-none ${
                      currentNavPage == "mircosite" ? "active" : ""
                    }
                  `}
                    id="mircoSite"
                    // to="#"
                    to="mircoSite#factorylogo"
                    onClick={() => {
                      let dropdown = document.getElementById("drop-mircoSite");
                      let dropicon = document.getElementById("mircoSite");

                      dropdown.classList.toggle("d-block");
                      dropicon
                        .querySelector(".caret")
                        .classList.toggle("fa-caret-up");
                      dropicon
                        .querySelector(".caret")
                        .classList.toggle("fa-caret-down");
                    }}
                  >
                    <i class="fa-solid fa-user"></i>
                    <p className="sub-title cursor">My Microsite</p>
                    <i
                      class={`fa-solid caret  fa-caret-down
                       text-white`}
                    ></i>
                  </Link>
                  <div id="drop-mircoSite" className={`dropdwon-menu-style `}>
                    <Link
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("factorylogo")
                          ? "active"
                          : ""
                      }`}
                      to="mircoSite#factorylogo"
                      onClick={() => {
                        setActiveMenu("factorylogo");
                        // navigate("mircoSite");
                      }}
                    >
                      <div className="d-flex  align-items-center sub-icon-pro">
                        <i class="fa-solid fa-user pe-2 text-white"></i>
                        <p className="sub-text cursor ">factory logo </p>
                      </div>
                    </Link>

                    <Link
                      to="mircoSite#socialAccount"
                      onClick={() => {
                        setActiveMenu("socialAccount");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("socialAccount")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-icon-pro">
                        <i className="fa-solid fa-share-nodes pe-2 text-white"></i>
                        <p className="sub-text cursor ">Social Accounts</p>
                      </div>
                    </Link>

                    <Link
                      to="mircoSite#factoryimages"
                      onClick={() => {
                        setActiveMenu("factoryimages");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("factoryimages")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-icon-pro">
                        <i className="fa-solid fa-images pe-2 text-white"></i>
                        <p className="sub-text cursor "> Cover Images</p>
                      </div>
                    </Link>

                    <Link
                      to="mircoSite#certificates"
                      onClick={() => {
                        setActiveMenu("certificates");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("certificates")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-icon-pro">
                        <i className="fa-solid fa-stamp pe-2 text-white"></i>
                        <p className="sub-text cursor ">Certificates</p>
                      </div>
                    </Link>

                    <Link
                      to="mircoSite#CoverVideo"
                      onClick={() => {
                        setActiveMenu("CoverVideo");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("CoverVideo")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-icon-pro">
                        <i className="fa-solid fa-images pe-2 text-white"></i>
                        <p className="sub-text cursor ">Cover Video</p>
                      </div>
                    </Link>
                    {/*  */}
                    <Link
                      to="mircoSite#FactoryInforamtion"
                      onClick={() => {
                        setActiveMenu("FactoryInforamtion");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("FactoryInforamtion")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-icon-pro">
                        <svg
                          style={{ width: "30px" }}
                          fill="white"
                          viewBox="10 -8 72 72"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            <title>factory</title>
                            <path d="M55.2,24.3V23.08a1.27,1.27,0,0,0-1.27-1.27h0l-.17-3.48h.21a1.26,1.26,0,0,0,1.27-1.26V15.85a1.26,1.26,0,0,0-1.27-1.26H46.8a1.26,1.26,0,0,0-1.27,1.26v1.22a1.26,1.26,0,0,0,1.27,1.26h.11l-.17,3.49a1.26,1.26,0,0,0-1.21,1.26V24.3a1.27,1.27,0,0,0,1,1.24L45.45,48.21H38.66L37.65,30a1.27,1.27,0,0,0,1.07-1.25V27.55a1.27,1.27,0,0,0-1.27-1.26h0l-.2-3.48h.2a1.27,1.27,0,0,0,1.27-1.27V20.33a1.27,1.27,0,0,0-1.27-1.27H30.32a1.26,1.26,0,0,0-1.26,1.27v1.21a1.26,1.26,0,0,0,1.26,1.27h.11l-.2,3.48a1.27,1.27,0,0,0-1.17,1.26v1.22A1.26,1.26,0,0,0,30,30L29,48.21H22.13l-.88-13.73a1.26,1.26,0,0,0,1-1.23V32A1.25,1.25,0,0,0,21,30.77l-.22-3.49H21A1.25,1.25,0,0,0,22.24,26V24.8A1.25,1.25,0,0,0,21,23.54H13.84a1.26,1.26,0,0,0-1.26,1.26V26a1.26,1.26,0,0,0,1.26,1.26h.1l-.23,3.49A1.28,1.28,0,0,0,12.58,32v1.22a1.27,1.27,0,0,0,.9,1.21L12.2,54.6a1.17,1.17,0,0,0,.32.91,1.23,1.23,0,0,0,.9.39H54.26a1.27,1.27,0,0,0,.9-.38,1.23,1.23,0,0,0,.33-.91L54.07,25.55A1.27,1.27,0,0,0,55.2,24.3ZM37.46,22.18ZM21,26.65ZM54.26,55.27Z"></path>
                            <path d="M17.27,21.43A2.46,2.46,0,0,0,19,20.7a2.42,2.42,0,0,0,.51-.76A3.55,3.55,0,0,0,22,18.88,3.46,3.46,0,0,0,23,17a4,4,0,1,0-3.07-6.83,4,4,0,0,0-1.17,2.59,3.68,3.68,0,0,0-1.86,1,3.63,3.63,0,0,0-1,3.17,3.92,3.92,0,0,0-.33.27A2.49,2.49,0,0,0,14.8,19a2.48,2.48,0,0,0,2.47,2.47Z"></path>
                            <path d="M33.75,17.09A2.47,2.47,0,0,0,36,15.61a3.62,3.62,0,0,0,3.43-2.92A4,4,0,0,0,42,11.52a4,4,0,0,0,1.17-2.83A4,4,0,0,0,42,5.85a4,4,0,0,0-6.84,2.6,3.62,3.62,0,0,0-2.87,4.15,2.22,2.22,0,0,0-.33.28,2.41,2.41,0,0,0-.72,1.74,2.46,2.46,0,0,0,2.47,2.47Z"></path>
                            <path d="M58.63,1.27a4,4,0,0,0-5.67,0,4.05,4.05,0,0,0-1.17,2.6,3.68,3.68,0,0,0-1.86,1,3.59,3.59,0,0,0-1,3.16,3,3,0,0,0-.33.28,2.46,2.46,0,0,0,0,3.49,2.41,2.41,0,0,0,1.74.72,2.45,2.45,0,0,0,1.75-.72,2.63,2.63,0,0,0,.52-.76A3.64,3.64,0,0,0,56,8.11,3.93,3.93,0,0,0,58.63,7a4,4,0,0,0,0-5.68Z"></path>
                          </g>
                        </svg>
                        {/* <i className="fa-solid fa-gears pe-2 text-white"></i> */}
                        <p className="sub-text cursor ">Factory Inforamtion</p>
                      </div>
                    </Link>
                    {/*  */}
                    <Link
                      to="mircoSite#team"
                      onClick={() => {
                        setActiveMenu("team");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("team") ? "active" : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-icon-pro">
                        <i className="fa-solid fa-envelope-circle-check pe-2 text-white"></i>
                        <p className="sub-text cursor ">Team</p>
                      </div>
                    </Link>
                  </div>
                </div>

                <div
                  className="p-0
                   m-0
                  text-decoration-none
                  text-dark
                  w-100
                 position-relative
              "
                >
                  <Link
                    className={`base-btn cursor ${
                      currentNavPage == "privatelabel" ? "active" : ""
                    }   text-decoration-none`}
                    to="PrivateLabel"
                  >
                    <i class="fa-solid fa-tag"></i>
                    <p className="sub-title cursor">Private Label Requests</p>
                  </Link>

                  {notification?.PrivateLabelingsNotif != 0 && (
                    <div className="dash-notif position-absolute ">
                      {notification?.PrivateLabelingsNotif}
                    </div>
                  )}
                </div>

                <div
                  className="p-0
                   m-0
                  text-decoration-none
                  text-dark
                  w-100
                 position-relative
              "
                >
                  <Link
                    className={`base-btn cursor ${
                      currentNavPage == "customerproductrequest" ? "active" : ""
                    }   text-decoration-none`}
                    to="CustomerProductRequest"
                  >
                    {/* <i className="fa-solid fa-money-bill-trend-up"></i> */}
                    <i class="fa-solid fa-rectangle-list"></i>
                    <p className="sub-title cursor">Custom Product Requests</p>
                  </Link>

                  {notification?.spmfsNotif != 0 && (
                    <div className="dash-notif position-absolute ">
                      {notification?.spmfsNotif}
                    </div>
                  )}
                </div>

                <div
                  className="p-0
                   m-0
                  text-decoration-none
                  text-dark
                  w-100
                 position-relative
              "
                >
                  <Link
                    className={`base-btn cursor ${
                      currentNavPage == "factoryrequestvisit" ? "active" : ""
                    }   text-decoration-none`}
                    to="FactoryRequestVisit"
                  >
                    <i class="fa-solid fa-industry"></i>
                    <p className="sub-title cursor">Factory Visit Requests</p>
                  </Link>
                  {notification?.visitsNotif != 0 && (
                    <div className="dash-notif position-absolute ">
                      {notification?.visitsNotif}
                    </div>
                  )}
                </div>

                <div
                  className="p-0
                   m-0
                  text-decoration-none
                  text-dark
                  w-100
                 position-relative
              "
                >
                  <Link
                    className={`base-btn cursor ${
                      currentNavPage == "rfqrequests" ? "active" : ""
                    }   text-decoration-none`}
                    to="RfqRequests"
                  >
                    <i className="fa-solid fa-money-bill-trend-up"></i>
                    <p className="sub-title cursor">RFQ Requests</p>
                  </Link>

                  {notification?.rfqsNotif != 0 && (
                    <div className="dash-notif position-absolute ">
                      {notification?.rfqsNotif}
                    </div>
                  )}
                </div>

                <div
                  className="p-0
                   m-0
                  text-decoration-none
                  text-dark
                  w-100
                 position-relative
              "
                >
                  <Link
                    className={`base-btn cursor ${
                      currentNavPage == "purchasingorders" ? "active" : ""
                    }   text-decoration-none`}
                    to="purchasingOrders"
                  >
                    <i class="fa-solid fa-bag-shopping"></i>
                    <p className="sub-title cursor">Purchasing Orders</p>
                  </Link>

                  {notification?.posNotif != 0 && (
                    <div className="dash-notif position-absolute ">
                      {notification?.posNotif}
                    </div>
                  )}
                </div>

                <div
                  className="p-0
                   m-0
                  text-decoration-none
                  text-dark
                  w-100
                 position-relative
                 position-relative
              "
                >
                  <Link
                    className={`base-btn cursor ${
                      currentNavPage == "allfactoryoffers" ? "active" : ""
                    }   text-decoration-none`}
                    to="AllFactoryOffers"
                  >
                    <i class="fa-solid fa-percent"></i>
                    <p className="sub-title cursor"> Offers</p>
                  </Link>
                  {notification?.offersNotif != 0 && (
                    <div className="dash-notif position-absolute ">
                      {notification?.offersNotif}
                    </div>
                  )}
                </div>

                <div
                  className="p-0
                   m-0
                  text-decoration-none
                  text-dark
                  w-100
                 position-relative
              "
                >
                  <Link
                    className={`base-btn cursor ${
                      currentNavPage == "allfactoryproducts" ? "active" : ""
                    }   text-decoration-none`}
                    to="AllFactoryProducts"
                  >
                    <i className="fa-solid fa-box-open"></i>
                    <p className="sub-title cursor"> Products</p>
                  </Link>
                </div>

                <div
                  className="p-0
                   m-0
                  text-decoration-none
                  text-dark
                  w-100
                
                  position-relative
              "
                >
                  <Link
                    className={`base-btn cursor ${
                      currentNavPage == "quotations" ? "active" : ""
                    }   text-decoration-none`}
                    to="quotations"
                  >
                    <i class="fa-solid fa-envelope"></i>
                    <p className="sub-title cursor">Quotations</p>
                  </Link>

                  {notification?.quotationsNotif != 0 && (
                    <div className="dash-notif position-absolute ">
                      {notification?.quotationsNotif}
                    </div>
                  )}
                </div>

                <div
                  className="p-0
                   m-0
                  text-decoration-none
                  text-dark
                  w-100
                 position-relative
              "
                >
                  <Link
                    className={`base-btn cursor  ${
                      currentNavPage == "chatlist" ? "active" : ""
                    }   text-decoration-none`}
                    to="chatList"
                  >
                    <i class="fa-solid fa-tag"></i>
                    <p className="sub-title cursor">Messages</p>
                  </Link>

                  {/* {notification?.PrivateLabelingsNotif != 0 && (
                    <div className="dash-notif position-absolute ">
                      {notification?.PrivateLabelingsNotif}
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>

          {/*  */}

          <FactoryInfo
            factoryProfile={factoryProfile}
            setIsLogin={setIsLogin}
          />
        </div>
        <div className="col-10 bg-white border-rounded   overflow-container factory-scroll-padding ">
          <Outlet context={[activeMenu, setActiveMenu]} />
        </div>
      </div>
    </section>
  );
}

export default Factorydash;
