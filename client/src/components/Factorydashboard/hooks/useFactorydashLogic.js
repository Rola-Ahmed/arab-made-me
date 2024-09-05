// FactorydashLogic.js
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userDetails } from "Context/userType";
import useFactoryNotification from "./useFactoryNotification";
import { UserToken } from "Context/userToken";

const useFactorydashLogic = (pathname, hash) => {
  const currentNavPage = pathname?.split("/")?.pop()?.toLowerCase();
  const { isLogin } = useContext(UserToken);
  const { currentUserData, clearSession } = useContext(userDetails);
  const { notification } = useFactoryNotification(isLogin);
  const navigate = useNavigate();

  useEffect(() => {
    let scrollElement = document.getElementById("scollTOTop");
    if (hash) {
      console.log("hash", hash);
      scrollElement = document.querySelector(hash);
      scrollElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;
    }
    console.log("scrollElement", scrollElement);
    if (scrollElement) {
      scrollElement.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      console.log("pathnamepathname", pathname);
    }
  }, [pathname, hash]);

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  const handleDropdownToggle = (dropdownId, iconId) => {
    const dropdown = document.getElementById(dropdownId);
    const icon = document.getElementById(iconId).querySelector(".caret");
    dropdown.classList.toggle("d-block");
    icon.classList.toggle("fa-caret-up");
    icon.classList.toggle("fa-caret-down");
  };

  return {
    handleLogout,
    handleDropdownToggle,
    notification,

    currentUserData,
    isLogin,
    currentNavPage,
  };
};

export default useFactorydashLogic;
