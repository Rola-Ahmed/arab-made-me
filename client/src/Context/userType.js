import { createContext, useState, useContext, useEffect } from "react";
import { UserToken } from "Context/userToken";
import { jwtDecode } from "jwt-decode";
import { getUser } from "Services/UserAuth";
import { fetchOneFactory } from "Services/factory";
import { fetchOneImporter } from "Services/importer";
import { determinePathAndData } from "utils/factoryContinueProfile";

// Create the user context
export const userDetails = createContext("");

export function UserTypeProvider({ children }) {
  let { isLogin, setIsLogin } = useContext(UserToken);
  const [loading, setLoading] = useState(true);

  // State for user data
  // const [currentUserData, setCurrentUserData] = useState(() => "");

  let itialValues = {
    // session
    userRole: null,
    userID: null,
    userName: null, //admin name from defultuser
    userEmail: null, //admin name from defultuser

    factoryId: null,
    factoryVerified: null,
    FactoryName: null,
    factoryEmailActivated: null,

    importerId: null,
    importerVerified: null,
    importerName: null,
    importerEmailActivated: null,

    profile: null,

    adminId: null,
    // adminName: null,
    datacompletelyLoaded: true,
  };
  const [currentUserData, setCurrentUserData] = useState(itialValues);

  // if there is any error then remove userdata and set  datacompletelyLoaded: false
  const errorCase = () => {
    setAndStoreData((prevVal) => ({
      ...prevVal,
      datacompletelyLoaded: false,
    }));
  };

  async function getCurrentUser() {
    let decodedToken = "";
    if (isLogin) {
      decodedToken = jwtDecode(isLogin).id;
    } else {
      errorCase();
      return;
    }

    let result = await getUser(decodedToken);

    if (result?.success) {
      let output = result?.data?.users;
      setAndStoreData((prevVal) => ({
        ...prevVal,
        userRole: output?.role,
        // userName: response.data.users.name?.join(' '),
        userName: output?.name?.[0],

        userID: output?.id,
        userEmail: output?.email,

        importerId: output?.importerId,
        factoryId: output?.factoryId,
        // datacompletelyLoaded:1
        datacompletelyLoaded:
          output?.importerId === null && output?.factoryId == null
            ? false
            : true,

        ...(output?.role == "user" && {
          continueProfilePath: "userType",
        }),
      }));
    } else if (result?.error == "users not found") {
      setIsLogin("");
      localStorage.clear();
      errorCase();
    } else {
      // error message occured
      setIsLogin("");
      localStorage.clear();
    }
    setLoading(false);
  }

  async function getFactory() {
    let result = await fetchOneFactory(currentUserData?.factoryId);

    if (result?.success) {
      // let path = null;

      let output = result?.data?.factories;

      // returns the results of path and validation of the factory
      let { path } = determinePathAndData(result?.data?.factories);

      setAndStoreData((prevVal) => ({
        ...prevVal,
        factoryVerified: output?.verified,
        FactoryName: output?.name,
        factoryRepEmail: output?.repEmail,
        factoryEmailActivated: output?.emailActivated,
        datacompletelyLoaded: false,
        profile: output?.coverImage,
        continueProfilePath: path,
      }));
    }
  }
  async function getImporter() {
    const result = await fetchOneImporter(currentUserData?.importerId, {});

    let path = "";
    if (result?.success) {
      let output = result?.data?.importers;
      if (!output?.repName) {
        path = "buyerRegistration";
      }
      setAndStoreData((prevData) => ({
        ...prevData,
        importerVerified: output?.verified,
        importerName: output?.repName,
        importerEmail: output?.repEmail,
        importerEmailActivated: output?.emailActivated,
        datacompletelyLoaded: false,
        profile: output?.image,
        continueProfilePath: path,
      }));
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, [isLogin]);

  useEffect(() => {
    if (!loading) {
      if (currentUserData.factoryId != null) {
        getFactory();
      }

      if (currentUserData.importerId != null) {
        getImporter();
      }
    }
  }, [loading, currentUserData.factoryId, currentUserData.importerId, isLogin]);

  const clearSession = () => {
    setIsLogin("");
    localStorage.removeItem("userToken");
  };

  const setAndStoreData = (newValue) => {
    setCurrentUserData(newValue);
  };

  // console.log("currentUserData", currentUserData);
  return (
    <userDetails.Provider
      value={{
        currentUserData,
        setCurrentUserData: setAndStoreData,
        clearSession,
      }}
    >
      {children}
    </userDetails.Provider>
  );
}
