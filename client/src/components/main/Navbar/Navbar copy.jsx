import React, { useContext, useEffect } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { logo } from "constants/Images";
import { userDetails } from "Context/userType";
import { UserToken } from "Context/userToken";
import { GlobalMsgContext } from "Context/globalMessage";
import { ToastContainer, toast } from "react-toastify";
import AllUsersDropListComp from "./AllUsersDropListComp";
import "react-toastify/dist/ReactToastify.css";

import "./navbar.css";
import LanguageSwitcher from "components/LanguageSwitcher/LanguageSwitcher";
import NavLinkBtn from "./NavLinkBtn";
function Navbar() {
  let navigate = useNavigate();
  const { pathname } = useLocation();
  let { isLogin, setIsLogin } = useContext(UserToken);
  let { globalMsg, setGlobalMsg } = useContext(GlobalMsgContext);
  let { currentUserData } = useContext(userDetails);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  const logOuut = () => {
    setIsLogin("");
    localStorage.clear();
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
    <>
      <ToastContainer />
      {/* <p>
        <a
          class="btn btn-primary"
          data-bs-toggle="collapse"
          href="#collapseExample"
          role="button"
          aria-bs-expanded="false"
          aria-bs-controls="collapseExample"
        >
          Link with href
        </a>
        <button
          class="btn btn-primary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample"
          aria-bs-expanded="false"
          aria-bs-controls="collapseExample"
        >
          Button with data-target
        </button>
      </p>
      <div class="collapse" id="collapseExample">
        <div class="card card-body">
          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
          terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
          labore wes anderson cred nesciunt sapiente ea proident.
        </div>
      </div> */}
      <header className="header-nav">
        <nav className="navbar navbar-expand-lg navbar-dark  ">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="logo" className="w-100 h-100" />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target=".navbarNav"
              aria-bs-controls="navbarNav"
              aria-bs-expanded="false"
              aria-bs-label="Toggle navigation"

              // #
              // data-bs-toggle="collapse"
              // href="#collapseExample"
              // role="button"
              // aria-bs-expanded="false"
              // aria-bs-controls="collapseExample"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse  navbarNav "
              id="collapseExample"
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
              id="collapseExample"
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
