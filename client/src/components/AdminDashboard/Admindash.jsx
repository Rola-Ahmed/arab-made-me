import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { baseUrl } from "config.js";

import { handleImageError } from "utils/ImgNotFound";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { GlobalMsgContext } from "Context/globalMessage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getNotifcation from "containers/Admindashboard/Admindash";
import DashLogo from "components/Shared/Dashboards/DashLogo";
function Admindash() {
  document.title = "Admin Dashboard";
  // State
  const [activeMenu, setActiveMenu] = useState("");
  const notification = getNotifcation(); // Fetch unopened notifications length

  // Context
  const { setIsLogin } = useContext(UserToken);
  const { currentUserData } = useContext(userDetails);
  const { globalMsg, setGlobalMsg } = useContext(GlobalMsgContext);

  // Router
  const location = useLocation();
  const navigate = useNavigate();
  const currentPathname = location.pathname.split("/");
  const currentNavPage =
    currentPathname[currentPathname.length - 1]?.toLowerCase();

  // Logout
  const logOut = () => {
    setIsLogin("");
    localStorage.clear();
    navigate("/");
  };

  // Toast on global message change
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
                      currentNavPage == "CustomProductRequest" ? "active" : ""
                    }   text-decoration-none`}
                    to="CustomProductRequest"
                  >
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
                      currentNavPage == "visitrequestVisit" ? "active" : ""
                    }   text-decoration-none`}
                    to="VisitRequestVisit"
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
              </div>
            </div>
          </div>

          {/*  */}

          <div className="profile-container justify-content-between align-items-center d-flex ">
            <div className="profile-img d-none">
              <img
                className="w-100 h-100"
                // src={`${baseUrl_IMG}/${mircoSite?.coverImage}`}
                alt="factory logo"
                onError={handleImageError}
              />
            </div>
            <div className="w size-profile ">
              <p className="text-white name-text">
                {currentUserData?.userName}
              </p>
              <p className="text-white email-text  w-100 title-text-handler">
                {currentUserData?.userEmail}
              </p>
            </div>

            <i
              className="fa-solid fa-arrow-right-from-bracket cursor pe-2"
              onClick={() => logOut()}
            ></i>
          </div>
        </div>
        <div className="col-10 bg-white border-rounded   overflow-container">
          <Outlet context={[activeMenu, setActiveMenu]} />
        </div>
      </div>
    </section>
  );
}

export default Admindash;
