import React, { useContext, useState, useEffect } from "react";
import { baseUrl_IMG } from "config.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { GlobalMsgContext } from "Context/globalMessage";
import { handleImageError } from "utils/ImgNotFound";
import { useLocation, useNavigate, Outlet, Link } from "react-router-dom";
import DashLogo from "components/Shared/Dashboards/DashLogo";
import DashNavBtn from "components/Shared/Dashboards/DashNavBtn";

function Importerdash() {
  let { setIsLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let { globalMsg, setGlobalMsg } = useContext(GlobalMsgContext);

  let navigate = useNavigate();
  document.title = "Importer Dashboard";
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  const location = useLocation();
  const currentPathname = location.pathname.split("/");
  let currentNavPage =
    currentPathname?.[currentPathname?.length - 1].toLocaleLowerCase();

    // 
  const [activeMenu, setActiveMenu] = useState("");

  const logOuut = () => {
    setIsLogin("");
    localStorage.clear();

    localStorage.setItem("ToHomePage", "true");
    navigate("/");
  };

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
          // localStorage.removeItem("displayMessage");
          setGlobalMsg("");
        },
      });
    }
  }, [globalMsg]);

  return (
    <section className="factory-dashboard vh-100 overflow-hidden">
      <ToastContainer />
      <div className="row h-100 w-100 remove-x">
        <div className="col-2 left-nav-fac-dashboard h-100 d-grid">
          <div className="static-navbar">
            <DashLogo />

            <div class="dropdown">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-haspopup="false"
                aria-expanded="false"
                data-bs-target=".dropdown-menu"
              >
                Dropdown button
              </button>
              <div class="dropdown-menu" >
              {/* aria-labelledby="dropdownMenuButton" */}
                <a class="dropdown-item" href="#">
                  Action
                </a>
                <a class="dropdown-item" href="#">
                  Another action
                </a>
                <a class="dropdown-item" href="#">
                  Something else here
                </a>
              </div>
            </div>

            <div className="scroller-container">
              <div className="page-sub-menu">
                <div
                  className="p-0
                  m-0
                  text-decoration-none
                  text-dark
                  w-100
              "
                >
                  <Link
                    className={`base-btn  cursor dashboard-color  ${
                      currentNavPage == "importerdashboard" ? "active" : ""
                    } text-decoration-none`}
                    to=""
                  >
                    <i className="fa-solid fa-box-open"></i>
                    <p className="sub-title cursor">Dashboard</p>
                  </Link>
                </div>
                <div className="">
                  <Link
                    className={`base-btn cursor text-decoration-none ${
                      currentNavPage == "importerprofile" ? "active" : ""
                    }
                  `}
                    id="importerProfile"
                    // to="#"
                    to="importerProfile#profileImage"
                    onClick={() => {
                      let dropdown = document.getElementById("drop-profile");
                      let dropicon = document.getElementById("importerProfile");

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
                  <div id="drop-profile" className={`dropdwon-menu-style  `}>
                    <Link
                      className={` sub-btn  text-decoration-none ${
                        window?.location.href.includes("profileImage")
                          ? "active"
                          : ""
                      }`}
                      to="importerProfile#profileImage"
                      onClick={() => {
                        setActiveMenu("profileImage");
                      }}
                    >
                      <div className="d-flex  align-items-start sub-profile-cont    mt-3  ms-2 ps-4">
                        <i class="fa-solid fa-user pe-3 text-white"></i>
                        <p className="sub-text cursor ">Profile Image</p>
                      </div>
                    </Link>
                    {/*  */}
                    <Link
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("accountInformation")
                          ? "active"
                          : ""
                      }`}
                      to="importerProfile#accountInformation"
                      onClick={() => {
                        setActiveMenu("accountInformation");
                      }}
                    >
                      <div className="d-flex  align-items-center sub-profile-cont">
                        <i className="fa-solid fa-gears  pe-3 text-white"></i>
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
                      to="importerProfile#PasswordChange"
                      onClick={() => {
                        setActiveMenu("PasswordChange");
                      }}
                    >
                      <div className="d-flex  align-items-center sub-profile-cont">
                        <i className="fa-solid fa-lock pe-3 text-white"></i>
                        <p className="sub-text cursor ">Password Change</p>
                      </div>
                    </Link>
                    {/*  */}
                    <Link
                      to="importerProfile#socialAccount"
                      onClick={() => {
                        setActiveMenu("socialAccount");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("socialAccount")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-profile-cont">
                        <i className="fa-solid fa-share-nodes pe-3 text-white"></i>
                        <p className="sub-text cursor ">Social Accounts</p>
                      </div>
                    </Link>
                    {/*  */}
                    <Link
                      //
                      offset={-117}
                      to="importerProfile#EmailNotification"
                      onClick={() => {
                        setActiveMenu("EmailNotification");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("EmailNotification")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-profile-cont">
                        <i className="fa-solid fa-bell pe-3 text-white"></i>
                        <p className="sub-text cursor ">Notifications</p>
                      </div>
                    </Link>

                    <Link
                      to="importerProfile#legalDocs"
                      onClick={() => {
                        setActiveMenu("legalDocs");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("legalDocs")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-profile-cont">
                        <i className="fa-solid fa-file-circle-check pe-3 text-white"></i>
                        <p className="sub-text cursor ">Legal Documents</p>
                      </div>
                    </Link>
                    {/*  */}

                    {/*  */}
                    <Link
                      to="importerProfile#importerInforamtion"
                      onClick={() => {
                        setActiveMenu("importerInforamtion");
                      }}
                      className={` sub-btn  text-decoration-none  ${
                        window?.location.href.includes("importerInforamtion")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="d-flex  align-items-center sub-profile-cont mb-1">
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
                        <p className="sub-text cursor ">Importer Inforamtion</p>
                      </div>
                    </Link>
                    {/*  */}
                  </div>
                </div>

                <DashNavBtn
                  icon="fa-solid fa-tag"
                  currentNavPage={currentNavPage}
                  activePageName="privatelabel"
                  navigateToPage="PrivateLabel"
                  title="Private Label Requests"
                  notification=""
                />

                <DashNavBtn
                  icon="fa-solid fa-rectangle-list"
                  currentNavPage={currentNavPage}
                  activePageName="customerproductrequest"
                  navigateToPage="CustomerProductRequest"
                  title="Custom Product Requests"
                  notification=""
                />
                <DashNavBtn
                  icon="fa-solid fa-industry"
                  currentNavPage={currentNavPage}
                  activePageName="requestvisit"
                  navigateToPage="RequestVisit"
                  title="Factory Visit Requests"
                  notification=""
                />
                <DashNavBtn
                  icon="fa-solid fa-money-bill-trend-up"
                  currentNavPage={currentNavPage}
                  activePageName="rfqs"
                  navigateToPage="Rfqs"
                  title="RFQ Requests"
                  notification=""
                />
                <DashNavBtn
                  icon="fa-solid fa-bag-shopping"
                  currentNavPage={currentNavPage}
                  activePageName="purchasingorderss"
                  navigateToPage="purchasingOrders"
                  title="Purchasing Orders"
                  notification=""
                />
                <DashNavBtn
                  icon="fa-solid fa-bell"
                  currentNavPage={currentNavPage}
                  activePageName="allsourcingrequests"
                  navigateToPage="AllSourcingRequests"
                  title="Sourcing Requests"
                  notification=""
                />
                <DashNavBtn
                  icon="fa-solid fa-envelope"
                  currentNavPage={currentNavPage}
                  activePageName="allquotations"
                  navigateToPage="AllQuotations"
                  title="Quotations"
                  notification=""
                />
                <DashNavBtn
                  icon="sub-title cursor"
                  currentNavPage={currentNavPage}
                  activePageName="chatlist"
                  navigateToPage="chatList"
                  title="Messages"
                  notification=""
                />
              </div>
            </div>
          </div>

          {/*  */}

          <div className="profile-container justify-content-start align-items-center d-flex mt-5">
            <div className="profile-img">
              <img
                className="w-100 h-100"
                //  src={profile}
                // alt="profile "

                src={`${baseUrl_IMG}/${currentUserData?.profile}`}
                alt="importer logo"
                onError={handleImageError}
              />
            </div>
            <div className="w size-profile ">
              <div>
                <p className="text-white name-text">
                  {currentUserData?.importerName}
                </p>
                <p className="text-white email-text w-100 title-text-handler">
                  {currentUserData?.importerEmail}
                </p>
              </div>
            </div>

            <i
              className="fa-solid fa-arrow-right-from-bracket cursor"
              onClick={() => logOuut()}
            ></i>
          </div>
        </div>
        {/* <div className="col-10 bg-white border-rounded h-100  overflow-container"> */}
        <div className="col-10 bg-white border-rounded   overflow-container ">
          <div className="w-100 h-100">
            <Outlet context={[activeMenu, setActiveMenu]} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Importerdash;
