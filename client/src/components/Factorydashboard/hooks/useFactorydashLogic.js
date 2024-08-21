// FactorydashLogic.js
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userDetails } from "Context/userType";
import useFactoryNotification from "./useFactoryNotification";
import { UserToken } from "Context/userToken";

const useFactorydashLogic = (pathname ) => {
  console.log("pathname",pathname)
  const currentNavPage = pathname?.split("/")?.pop()?.toLowerCase();
  const { isLogin } = useContext(UserToken);
  const { currentUserData, clearSession } = useContext(userDetails);
  const { notification } = useFactoryNotification(isLogin);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    const scrollElement = document.getElementById("scollTOTop");
    if (scrollElement) {
      scrollElement.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname]);

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
    activeMenu,
    setActiveMenu,
    currentUserData,
    isLogin,
    currentNavPage,
  };
};

export default useFactorydashLogic;
