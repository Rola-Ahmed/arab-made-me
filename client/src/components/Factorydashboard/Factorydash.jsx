import "./Factorydash.css";
import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
// import { userDetails } from "Context/userType";
import DashLogo from "components/Shared/Dashboards/DashLogo";
import BottomDashMenu from "components/Shared/Dashboards/BottomDashMenu";
import DashNavBtn from "components/Shared/Dashboards/DashNavBtn";
import DashListsDropDown from "components/Shared/Dashboards/DashListsDropDown";
import useFactorydashLogic from "./subComponets/hooks/useFactorydashLogic";
import { checkFactorydashAuthorization } from "roles/factorydashRoles";
function Factorydash() {
  document.title = "Factory Dashboard";
  const { pathname } = useLocation();
  const {
    isLogin,
    notification,
    currentUserData,
    handleLogout,
    handleDropdownToggle,
    setActiveMenu,
    activeMenu,
    currentNavPage
  } = useFactorydashLogic(pathname);

  // Use the authorization check function
  const authorizationResult = checkFactorydashAuthorization(
    isLogin,
    currentUserData
  );
  if (authorizationResult) return authorizationResult;

  return (
    <section className="factory-dashboard vh-100 overflow-hidden  vw-100">
      <div className="row h-100 w-100 remove-x">
        <div className="col-2 left-nav-fac-dashboard h-100 d-grid">
          <div className="static-navbar">
            <DashLogo />

            <div className="scroller-container">
              <div className="page-sub-menu">
                <Link
                  className={`base-btn  cursor dashboard-color  ${
                    currentNavPage == "factorydashboard" ? "active" : ""
                  } text-decoration-none`}
                  to=""
                >
                  <i className="fa-solid fa-box-open"></i>
                  <p className="sub-title cursor">Dashboard</p>
                </Link>

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
                    onClick={() =>
                      handleDropdownToggle("drop-profile", "factoryProfile")
                    }
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

                    <div className="mt-3"></div>
                    <DashListsDropDown
                      path={"factoryProfile"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="accountInformation"
                      title="Account Inforamtion"
                      icon="fa-solid fa-gears"
                    />

                    {/* Password Change */}
                    <DashListsDropDown
                      path={"factoryProfile"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="PasswordChange"
                      title="Password Change"
                      icon="fa-solid fa-lock "
                    />

                    {/*  */}

                    {/* Email Notification */}
                    <DashListsDropDown
                      path={"factoryProfile"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="EmailNotification"
                      title="Notifications"
                      icon="fa-solid fa-bell"
                    />
                    {/* legal docs */}
                    <DashListsDropDown
                      path={"factoryProfile"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="legalDocs"
                      title="Legal Documents"
                      icon="fa-solid fa-file-circle-check"
                    />

                    {/* legal docs */}
                    <DashListsDropDown
                      path={"factoryProfile"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="subscriptionPlan"
                      title="Subscription Plan"
                      icon="fa-solid fa-envelope-circle-check pe-2"
                    />
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
                    onClick={() =>
                      handleDropdownToggle("drop-mircoSite", "mircoSite")
                    }
                  >
                    <i class="fa-solid fa-user"></i>
                    <p className="sub-title cursor">My Microsite</p>
                    <i
                      class={`fa-solid caret  fa-caret-down
                       text-white`}
                    ></i>
                  </Link>
                  <div id="drop-mircoSite" className={`dropdwon-menu-style `}>
                    <DashListsDropDown
                      path={"mircoSite"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="factorylogo"
                      title="Factory Logo"
                      icon="fa-solid fa-user"
                    />

                    <DashListsDropDown
                      path={"mircoSite"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="socialAccount"
                      title="Social Accounts"
                      icon="fa-solid fa-share-nodes"
                    />

                    <DashListsDropDown
                      path={"mircoSite"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="factoryimages"
                      title="Cover Images"
                      icon="fa-solid fa-images"
                    />

                    <DashListsDropDown
                      path={"mircoSite"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="certificates"
                      title="Certificates"
                      icon="fa-solid fa-stamp"
                    />

                    <DashListsDropDown
                      path={"mircoSite"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="CoverVideo"
                      title="Cover Video"
                      icon="fa-solid fa-video"
                    />

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
                      <div className="d-flex  align-items-center ms-4 ps-2">
                        <svg
                          style={{ width: "30px" }}
                          fill="white"
                          viewBox="10 -8 72 72"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            <path d="M55.2,24.3V23.08a1.27,1.27,0,0,0-1.27-1.27h0l-.17-3.48h.21a1.26,1.26,0,0,0,1.27-1.26V15.85a1.26,1.26,0,0,0-1.27-1.26H46.8a1.26,1.26,0,0,0-1.27,1.26v1.22a1.26,1.26,0,0,0,1.27,1.26h.11l-.17,3.49a1.26,1.26,0,0,0-1.21,1.26V24.3a1.27,1.27,0,0,0,1,1.24L45.45,48.21H38.66L37.65,30a1.27,1.27,0,0,0,1.07-1.25V27.55a1.27,1.27,0,0,0-1.27-1.26h0l-.2-3.48h.2a1.27,1.27,0,0,0,1.27-1.27V20.33a1.27,1.27,0,0,0-1.27-1.27H30.32a1.26,1.26,0,0,0-1.26,1.27v1.21a1.26,1.26,0,0,0,1.26,1.27h.11l-.2,3.48a1.27,1.27,0,0,0-1.17,1.26v1.22A1.26,1.26,0,0,0,30,30L29,48.21H22.13l-.88-13.73a1.26,1.26,0,0,0,1-1.23V32A1.25,1.25,0,0,0,21,30.77l-.22-3.49H21A1.25,1.25,0,0,0,22.24,26V24.8A1.25,1.25,0,0,0,21,23.54H13.84a1.26,1.26,0,0,0-1.26,1.26V26a1.26,1.26,0,0,0,1.26,1.26h.1l-.23,3.49A1.28,1.28,0,0,0,12.58,32v1.22a1.27,1.27,0,0,0,.9,1.21L12.2,54.6a1.17,1.17,0,0,0,.32.91,1.23,1.23,0,0,0,.9.39H54.26a1.27,1.27,0,0,0,.9-.38,1.23,1.23,0,0,0,.33-.91L54.07,25.55A1.27,1.27,0,0,0,55.2,24.3ZM37.46,22.18ZM21,26.65ZM54.26,55.27Z"></path>
                            <path d="M17.27,21.43A2.46,2.46,0,0,0,19,20.7a2.42,2.42,0,0,0,.51-.76A3.55,3.55,0,0,0,22,18.88,3.46,3.46,0,0,0,23,17a4,4,0,1,0-3.07-6.83,4,4,0,0,0-1.17,2.59,3.68,3.68,0,0,0-1.86,1,3.63,3.63,0,0,0-1,3.17,3.92,3.92,0,0,0-.33.27A2.49,2.49,0,0,0,14.8,19a2.48,2.48,0,0,0,2.47,2.47Z"></path>
                            <path d="M33.75,17.09A2.47,2.47,0,0,0,36,15.61a3.62,3.62,0,0,0,3.43-2.92A4,4,0,0,0,42,11.52a4,4,0,0,0,1.17-2.83A4,4,0,0,0,42,5.85a4,4,0,0,0-6.84,2.6,3.62,3.62,0,0,0-2.87,4.15,2.22,2.22,0,0,0-.33.28,2.41,2.41,0,0,0-.72,1.74,2.46,2.46,0,0,0,2.47,2.47Z"></path>
                            <path d="M58.63,1.27a4,4,0,0,0-5.67,0,4.05,4.05,0,0,0-1.17,2.6,3.68,3.68,0,0,0-1.86,1,3.59,3.59,0,0,0-1,3.16,3,3,0,0,0-.33.28,2.46,2.46,0,0,0,0,3.49,2.41,2.41,0,0,0,1.74.72,2.45,2.45,0,0,0,1.75-.72,2.63,2.63,0,0,0,.52-.76A3.64,3.64,0,0,0,56,8.11,3.93,3.93,0,0,0,58.63,7a4,4,0,0,0,0-5.68Z"></path>
                          </g>
                        </svg>
                        <p className="sub-text cursor ">Factory Inforamtion</p>
                      </div>
                    </Link>
                    {/*  */}

                    <DashListsDropDown
                      path={"mircoSite"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="team"
                      title="Team"
                      icon="fa-solid fa-user-plus"
                    />
                  </div>
                </div>

                <DashNavBtn
                  icon="fa-solid fa-tag"
                  currentNavPage={currentNavPage}
                  activePageName="privatelabel"
                  navigateToPage="PrivateLabel"
                  title="Private Label Requests"
                  notification={notification?.PrivateLabelingsNotif}
                />

                <DashNavBtn
                  icon="fa-solid fa-rectangle-list"
                  currentNavPage={currentNavPage}
                  activePageName="customerproductrequest"
                  navigateToPage="CustomerProductRequest"
                  title="Custom Product Requests"
                  notification={notification?.spmfsNotif}
                />

                <DashNavBtn
                  icon="fa-solid fa-tag"
                  currentNavPage={currentNavPage}
                  activePageName="whitelabel"
                  navigateToPage="whiteLabel"
                  title="White Label Requests"
                  notification={0}
                />
                <DashNavBtn
                  icon="fa-solid fa-industry"
                  currentNavPage={currentNavPage}
                  activePageName="factoryrequestvisit"
                  navigateToPage="FactoryRequestVisit"
                  title="Factory Visit Requests"
                  notification={notification?.visitsNotif}
                />

                <DashNavBtn
                  icon="fa-solid fa-money-bill-trend-up"
                  currentNavPage={currentNavPage}
                  activePageName="rfqrequests"
                  navigateToPage="RfqRequests"
                  title="RFQ Requests"
                  notification={notification?.rfqsNotif}
                />

                <DashNavBtn
                  icon="fa-solid fa-bag-shopping"
                  currentNavPage={currentNavPage}
                  activePageName="purchasingorders"
                  navigateToPage="purchasingOrders"
                  title="Purchasing Orders"
                  notification={notification?.posNotif}
                />

                <DashNavBtn
                  icon="fa-solid fa-percent"
                  currentNavPage={currentNavPage}
                  activePageName="allfactoryoffers"
                  navigateToPage="AllFactoryOffers"
                  title="Offers"
                  notification={notification?.offersNotif}
                />

                <DashNavBtn
                  icon="fa-solid fa-box-open"
                  currentNavPage={currentNavPage}
                  activePageName="allfactoryproducts"
                  navigateToPage="AllFactoryProducts"
                  title="Products"
                  notification="0"
                />

                <DashNavBtn
                  icon="fa-solid fa-envelope"
                  currentNavPage={currentNavPage}
                  activePageName="quotations"
                  navigateToPage="quotations"
                  title="Quotations"
                  notification={notification?.quotationsNotif}
                />

                <DashNavBtn
                  icon="fa-solid fa-tag"
                  currentNavPage={currentNavPage}
                  activePageName="chatlist"
                  navigateToPage="chatList"
                  title="Messages"
                  notification={notification?.quotationsNotif}
                />
              </div>
            </div>
          </div>

          <BottomDashMenu
            profile={currentUserData?.profile}
            name={currentUserData?.FactoryName}
            email={currentUserData?.factoryRepEmail}
            logOuut={handleLogout}
          />
        </div>
        <div
          id="scollTOTop"
          className="col-10 bg-white border-rounded   overflow-container factory-scroll-padding "
        >
          <Outlet context={[activeMenu, setActiveMenu]} />
        </div>
      </div>
    </section>
  );
}

export default Factorydash;
