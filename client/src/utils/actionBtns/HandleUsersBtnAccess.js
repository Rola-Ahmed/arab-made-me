// utils/navigationUtils.js
// HandleUsersBtnAccess
const handleButtonClick = (params) => {
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
    setModalShow((prevVal) => ({
      ...prevVal,
      isLogin: true,
    }));

    setisLoggedReDirect(`/signIn/${loginPath}`);
    return;
  }

  if (isLogin) {
    // if currentUserData?.importerId!== null means there is a importer and he is logged in
    // setisLoggedReDirect(`/signIn/${loginPath}`);

    if (
      currentUserData?.importerId !== null &&
      currentUserData?.continueProfilePath != null
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
        isUser: true,
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
    setModalShow((prevVal) => ({
      ...prevVal,
      isLogin: true,
    }));

    setisLoggedReDirect(`/signIn/${loginPath}`);
    return;
  }

  navigate(`/${loginPath}`);
};

export default handleButtonClick;
export { handleIsLoggedInBtn };
