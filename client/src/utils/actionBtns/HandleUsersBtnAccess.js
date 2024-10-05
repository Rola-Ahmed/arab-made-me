const showLoginModal = (setModalShow, setisLoggedReDirect, redirectPath) => {
  console.log("nnjj",setModalShow, setisLoggedReDirect, redirectPath)
  setModalShow((prevVal) => ({
    ...prevVal,
    isLogin: true,
  }));
  setisLoggedReDirect(redirectPath);
};

// utils/navigationUtils.js
// HandleUsersBtnAccess
const handleButtonClick = (params) => {
  console.log("params",params)
  const {
    currentUserData,
    isLogin,
    navigate,
    setModalShow,
    setisLoggedReDirect,
    loginPath,
  } = params;

  // return

  if (!isLogin) {
    console.log("!isLogin",!isLogin)
    showLoginModal(setModalShow, setisLoggedReDirect, `/signIn/${loginPath}`);
    return;
  }

  if (isLogin) {
    // if currentUserData?.importerId!== null means there is a importer and he is logged in
    // setisLoggedReDirect(`/signIn/${loginPath}`);

    if (
      currentUserData?.importerId !== null &&
      currentUserData?.continueProfilePath
    ) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isImporterVerified: true,
      }));
      return;
    }

    if (currentUserData?.userRole == "factory") {
      setModalShow((prevVal) => ({
        ...prevVal,
        isFactoryVerified: true,
      }));
      return;
    }

    // means user type is default and can't access the page
    if (currentUserData?.userRole == "user") {
      setModalShow((prevVal) => ({
        ...prevVal,
        isDefaultUserNotAllowed: true,
      }));
      return;
    }

    // means the prewovis conditons are false and user can assess the page
    navigate(`/${loginPath}`);
  }
};

// utils/navigationUtils.js
const handleIsLoggedInBtn = (params) => {
  const {
    isLogin,
    navigate,
    setModalShow,
    setisLoggedReDirect,
    loginPath,
  } = params;

  if (!isLogin) {
    showLoginModal(setModalShow, setisLoggedReDirect, `/signIn/${loginPath}`);
    return;
  }

  navigate(`/${loginPath}`);
};

const accessFormSourcingRequest = (params) => {
  const {
    currentUserData,
    isLogin,
    navigate,
    setModalShow,
    setisLoggedReDirect,
    directto,
  } = params;

  if (!isLogin) {
    showLoginModal(setModalShow, setisLoggedReDirect, `/signIn/${directto}`);
    return;
  }

  switch (currentUserData?.userRole) {
    case "importer":
    case "admin":
      setModalShow((prevVal) => ({
        ...prevVal,
        isUserNotAllowed: true,
      }));
      return;

    case "user":
      setModalShow((prevVal) => ({
        ...prevVal,
        isDefaultUserNotAllowed: true,
      }));
      return;

    case "factory":
      if (currentUserData?.continueProfilePath != null) {
        setModalShow((prevVal) => ({
          ...prevVal,
          isFactoryAllowedAndVerified: true,
        }));
        // return;
        break;
      }

    default:
      // console.log(currentUserData?.userRole);
      navigate(`/${directto}`);
  }
};

export default handleButtonClick;
export { handleIsLoggedInBtn, accessFormSourcingRequest };
