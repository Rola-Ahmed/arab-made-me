import { useContext, useState, useEffect } from "react";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import {
  useLocation,
  useNavigate,
  Link,
  Outlet,
  Navigate,
} from "react-router-dom";
import DashLogo from "components/Shared/Dashboards/DashLogo";
import DashNavBtn from "components/Shared/Dashboards/DashNavBtn";
import BottomDashMenu from "components/Shared/Dashboards/BottomDashMenu";
import DashListsDropDown from "components/Shared/Dashboards/DashListsDropDown";
import ErrorToast from "components/ErrorToast";

function Importerdash() {
  document.title = "Importer Dashboard";
  let { setIsLogin, isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  // global message appearing "used pop up message"

  let navigate = useNavigate();
  const { pathname } = useLocation();
  // Determine current active page for navigation highlight
  const currentNavPage = pathname
    .split("/")
    .pop()
    .toLowerCase();
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    let scroll = document.getElementById("scollTOTop");

    if (scroll) {
      scroll.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname]);

  const logOuut = () => {
    setIsLogin("");
    localStorage.clear();
    navigate("/");
  };

  // if user is not loged in
  if (!isLogin) {
    // return {
    // navigate("/");
    ErrorToast(
      "You are not authorized to access this page. Please sign in first."
    );
    return <Navigate to="/signIn" />;
    // };
  }
  if ( currentUserData && !currentUserData?.importerId) {
   
    if (currentUserData?.factoryId) {
      ErrorToast("You are not authorized to access");
      return <Navigate to="/factorydashboard/403?refresh" />;
    } else if (currentUserData?.userRole == "admin") {
      ErrorToast("You are not authorized to access");
      return <Navigate to="/adminDashboard/403?refresh" />;
    } else if (currentUserData?.userRole == "user"){
      ErrorToast("You are not authorized to access");
      return <Navigate to="/403" />;
    }
  }

  return (
    <section id="scrollTo" className="factory-dashboard vh-100 overflow-hidden">

      <div className="row h-100 w-100 remove-x">
        <div className="col-2 left-nav-fac-dashboard h-100 d-grid">
          <div className="static-navbar">
            <DashLogo />

            <div className="scroller-container">
              <div className="page-sub-menu">
                <Link
                  className={`base-btn  cursor dashboard-color  ${
                    currentNavPage == "importerdashboard" ? "active" : ""
                  } text-decoration-none`}
                  to=""
                >
                  <i className="fa-solid fa-box-open"></i>
                  <p className="sub-title cursor">Dashboard</p>
                </Link>

                {/* drop down Prodile */}
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
                  {/* drop down List*/}
                  <div id="drop-profile" className={`dropdwon-menu-style  `}>
                    {/* profile image section */}
                    <div className="mt-3"></div>
                    <DashListsDropDown
                      path={"importerProfile"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="profileImage"
                      title="Profile Image"
                      icon="fa-solid fa-user"
                    />

                    {/* Account Inforamtion */}
                    <DashListsDropDown
                      path={"importerProfile"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="accountInformation"
                      title="Account Inforamtion"
                      icon="fa-solid fa-gears"
                    />

                    {/* Password Change */}
                    <DashListsDropDown
                      path={"importerProfile"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="PasswordChange"
                      title="Password Change"
                      icon="fa-solid fa-lock "
                    />

                    {/* socialAccount */}
                    <DashListsDropDown
                      path={"importerProfile"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="socialAccount"
                      title="Social Accounts"
                      icon="fa-solid fa-share-nodes"
                    />

                    {/* Email Notification */}
                    <DashListsDropDown
                      path={"importerProfile"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="EmailNotification"
                      title="Notifications"
                      icon="fa-solid fa-bell"
                    />

                    {/* legal docs */}
                    <DashListsDropDown
                      path={"importerProfile"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="legalDocs"
                      title="Legal Documents"
                      icon="fa-solid fa-file-circle-check"
                    />

                    {/* legal docs */}
                    <DashListsDropDown
                      path={"importerProfile"}
                      setActiveMenu={setActiveMenu}
                      urlHashValue="importerInforamtion"
                      title="Importer Inforamtion"
                      icon="fa-solid fa-circle-info"
                    />

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
                  icon="fa-solid fa-tag"
                  currentNavPage={currentNavPage}
                  activePageName="whitelabel"
                  navigateToPage="whiteLabel"
                  title="White Label Requests"
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
                  icon="fa-solid fa-tag"
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

          <BottomDashMenu
            profile={currentUserData?.profile}
            name={currentUserData?.importerName}
            email={currentUserData?.importerEmail}
            logOuut={logOuut}
          />
        </div>
        {/* <div className="col-10 bg-white border-rounded h-100  overflow-container"> */}
        <div
          id="scollTOTop"
          className="col-10 bg-white border-rounded   overflow-container "
        >
          <div className="w-100 h-100">
            <Outlet context={[activeMenu, setActiveMenu]} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Importerdash;
