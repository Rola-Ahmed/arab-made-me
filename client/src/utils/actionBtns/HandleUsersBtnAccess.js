// utils/navigationUtils.js
const handleButtonClick = (params) => {
  const {
    currentUserData,
    isLogin,
    navigate,
    setModalShow,
    setisLoggedReDirect,
    loginPath,
  } = params;

  if (isLogin) {
    // if currentUserData?.importerId!== null means there is a importer and he is logged in
    setisLoggedReDirect(`/signIn/${loginPath}`);

    if (
      currentUserData?.importerId !== null &&
      (currentUserData?.importerVerified === "0" ||
        !currentUserData?.importerEmailActivated)
    ) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isImporterVerified: true,
      }));
      return;
    }

    // if currentUserData?.factoryId!== null means there is a factory and he is logged in

    if (currentUserData?.factoryId !== null) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isFactoryVerified: true,
      }));
      return;
    }

    // means user type is default and can't access the page
    if (
      currentUserData?.importerId == null &&
      currentUserData?.factoryId == null
    ) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isFactoryVerified: true,
      }));
      return;
    }

    // means the prewovis conditons are false and user can assess the page
    navigate(`/${loginPath}`);
  } else if (!isLogin) {
    setModalShow((prevVal) => ({
      ...prevVal,
      isLogin: true,
    }));

    setisLoggedReDirect(`/signIn/${loginPath}`);
    return;
  }
};

// utils/navigationUtils.js
const handleIsLoggedInBtn = (params) => {
  const { isLogin, navigate, setModalShow, setisLoggedReDirect, loginPath } =
    params;

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
