import React, { useRef, useEffect } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "constants/Images";
import { userDetails } from "Context/userType";
import { UserToken } from "Context/userToken";
import AllUsersDropListComp from "./AllUsersDropListComp";
import { useAppTranslation } from "config.js";

import "./navbar.css";
import LanguageSwitcher from "components/LanguageSwitcher/LanguageSwitcher";
import NavLinkBtn from "./NavLinkBtn";
import ScrollToTop from "components/ScrollTo";
function Navbar(props) {
  let navigate = useNavigate();
  let { isLogin, setIsLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  // pop up message
  const { trans: t, currentLang } = useAppTranslation();

  const logOuut = () => {
    setIsLogin("");
    localStorage.clear();
    navigate("/");
  };

  const navBarRef = useRef(null);

  useEffect(() => {
    // Function to handle click outside the nav bar
    const handleClickOutside = (event) => {
      // if (navBarRef.current && !navBarRef.current.contains(event.target)) {
      //   console.log("Clicked outside the navbar");
      //   // Perform your action here (e.g., close the navbar)
      //   // Example: document.getElementById('navbarNav').classList.remove('show');
      // }

      if (
        isLogin &&
        navBarRef.current &&
        !navBarRef.current.contains(event.target)
      ) {
        // Check if 'show' class is present and remove it

        let nav = document.getElementById("navBarCont");
        let btn = document.getElementById("menuBtn");
        if (nav.classList.contains("show")) {
          nav.classList.remove("show");
          btn.classList.add("collapsed");
          btn.setAttribute("aria-expanded", "false");
        }
      }
    };

    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <div className="lang-parent d-md-flex align-items-center justify-content-between border-bottom border-1 border-muted">
        {/* btn to change lanuages */}
        <LanguageSwitcher />

        <div className="btns p-0  w-fit-content  mx-md-0 mx-auto">
          {isLogin && currentUserData?.continueProfilePath && (
            <button
              className="btn1  border-0 rounded-3 color-changing-button  fw-600 fs-12 "
              onClick={() =>
                navigate(`/${currentUserData?.continueProfilePath}`)
              }
            >
              Please countine registration
            </button>
          )}
          {/* <i className="fa-solid fa-triangle-exclamation"></i> */}
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
                className="btn1 bg-sec border-0 text-white rounded-3 px-3 py-1"
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

              <button
                className="btn1 bg-sec border-0 rounded-3 text-white px-3 py-2 fw-600"
                onClick={() => logOuut()}
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>

      <div className=" nav-sticky position-sticky top-0" ref={navBarRef}>
        <header className="header-nav pt-1">
          <nav className="navbar navbar-expand-lg navbar-dark  ">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                <img src={logo} alt="logo" className="w-100 h-100" />
              </Link>
              <button
                id="menuBtn"
                className="navbar-toggler fs-16 "
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
                id="navBarCont"
              >
                <ul className={`navbar-nav m-auto mb-2 mb-lg-0  ${ currentLang == "ar" && "ar-displayed"}`}>
                 

                  <NavLinkBtn path="/" name={t("translation:home")}/>


                  <NavLinkBtn path="/aboutus" name={t("translation:aboutUs")} />

                  <NavLinkBtn
                    path="/sourcinghub/sourcingRequests"
                    name={t("translation:titles.SourcingHub")}
                  />

                  <NavLinkBtn
                    path="/productMarketPlace"
                    name={t("translation:marketPlace")}
                  />

                  <NavLinkBtn
                    path="/factoryGallery"
                    name={t("translation:factoryGallery")}
                  />

                  <NavLinkBtn
                    path="/contact"
                    name={t("translation:contactUs")}
                  />
                </ul>
              </div>
            </div>
          </nav>
        </header>
      </div>
    </>
  );
}

export default Navbar;
