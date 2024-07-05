import React, { useContext, useEffect } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { logo } from "constants/Images";
import { userDetails } from "Context/userType";
import { UserToken } from "Context/userToken";
// import { GlobalMsgContext } from "Context/globalMessage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllUsersDropListComp from "./AllUsersDropListComp";
import useGlobalMessage from "hooks/useGlobalMessage";
import "./navbar.css";
import LanguageSwitcher from "components/LanguageSwitcher/LanguageSwitcher";
import NavLinkBtn from "./NavLinkBtn";
import ScrollToTop from "components/ScrollTo";
function Navbar(props) {
  let navigate = useNavigate();
  const { pathname } = useLocation();
  let { isLogin, setIsLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  // pop up message
  const { setGlobalMsg } = useGlobalMessage();

  const logOuut = () => {
    setIsLogin("");
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <ScrollToTop />
      <ToastContainer />
      <header className="header-nav">
        <nav className="navbar navbar-expand-lg navbar-dark  ">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="logo" className="w-100 h-100" />
            </Link>
            <button
              className="navbar-toggler "
              type="button"
              data-bs-toggle="collapse"
              data-bs-target=".navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse  navbarNav "
              id="navbarNav"
            >
              <ul className="navbar-nav m-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link " aria-current="page" to="/">
                    Home
                  </Link>
                </li>

                <NavLinkBtn path="/aboutus" name="About Us" />

                <NavLinkBtn
                  path="/sourcinghub/sourcingRequests"
                  name="Sourcing Hub"
                />

                {/* means we r not stanging on the homepage */}
                {pathname !== "/" && (
                  <>
                    <NavLinkBtn
                      path="/productMarketPlace"
                      name="Market Place"
                    />

                    <NavLinkBtn
                      path="/factoryGallery"
                      name=" Factory Gallery"
                    />
                  </>
                )}

                <NavLinkBtn path="/contact" name=" Contact Us" />
              </ul>
            </div>
            <div
              className="btns collapse navbar-collapse  m-0 p-0 navbarNav"
              id="navbarNav"
            >
              {/* btn to change lanuages */}
              <LanguageSwitcher />
              {!isLogin ? (
                <>
                  <div
                    className="text-1 text-decoration-none cursor d-flex justify-content-center"
                    onClick={() => {
                      navigate("/signIn");
                    }}
                  >
                    Log in
                  </div>
                  <button
                    className="btn1"
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <>
                  <AllUsersDropListComp
                    loading={currentUserData?.datacompletelyLoaded}
                    currentUserData={currentUserData}
                  />

                  <button className="btn1" onClick={() => logOuut()}>
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
