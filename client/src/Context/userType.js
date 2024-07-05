import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import { jwtDecode } from "jwt-decode";

// Create the user context
export const userDetails = createContext("");

export function UserTypeProvider({ children }) {
  let { isLogin, setIsLogin } = useContext(UserToken);

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

  // if there is any error then remove userdata and set  datacompletelyLoaded: false
  const errorCase = () => {
    setAndStoreData((prevVal) => ({
      ...prevVal,
      datacompletelyLoaded: false,
    }));
  };
  const [currentUserData, setCurrentUserData] = useState(itialValues);
  const [loading, setLoading] = useState(true);

  async function getCurrentUser() {
    let decodedToken = "";
    if (isLogin) {
      decodedToken = jwtDecode(isLogin).id;
    } else {
      errorCase();
      return;
    }

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/users/${decodedToken}`,
      };

      const response = await axios.request(config);

      if (response.data.message === "done") {
        setAndStoreData((prevVal) => ({
          ...prevVal,
          userRole: response.data.users.role,
          // userName: response.data.users.name?.join(' '),
          userName: response.data.users.name?.[0],

          userID: response.data.users.id,
          userEmail: response.data.users.email,

          importerId: response?.data?.users?.importerId,
          factoryId: response?.data?.users?.factoryId,
          // datacompletelyLoaded:1
          datacompletelyLoaded:
            response?.data?.users?.importerId === null &&
            response?.data?.users?.factoryId == null
              ? false
              : true,
        }));
      } else {
        setIsLogin("");
        localStorage.clear();
      }
    } catch (error) {
      console.log("Errorrrr", error);
      if (error?.response?.data?.message == "users not found") {
        setIsLogin("");
        localStorage.clear();

        errorCase();
      }
    } finally {
      setLoading(false);
    }
  }

  async function getFactory() {
    if (currentUserData.factoryId !== null) {
      let configFactory = {
        method: "get",

        url: `${baseUrl}/factories/${currentUserData.factoryId}`,
      };

      axios
        .request(configFactory)
        .then((response) => {
          if (response.data.message === "done") {
            setAndStoreData((prevVal) => ({
              ...prevVal,
              factoryVerified: response.data.factories.verified,
              // FactoryName:response.data.factories?.repName?.[0],
              FactoryName: response.data.factories?.name,
              factoryEmailActivated: response.data.factories.emailActivated,
              datacompletelyLoaded: false,
              profile: response.data.factories.coverImage,
            }));
          }
        })
        .catch((error) => {});
    }
  }
  async function getImporter() {
    if (currentUserData.importerId !== null) {
      let configFactory = {
        method: "get",
        url: `${baseUrl}/importers/${currentUserData.importerId}`,
      };

      axios
        .request(configFactory)
        .then((response) => {
          if (response.data.message == "done") {
            setAndStoreData((prevData) => ({
              ...prevData,
              importerVerified: response.data.importers.verified,
              importerName: response.data.importers?.repName,
              importerEmail: response.data.importers?.repEmail,
              importerEmailActivated: response.data.importers.emailActivated,
              datacompletelyLoaded: false,
              profile: response.data.importers.image,
            }));
          }
        })
        .catch((error) => {});
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, [isLogin]);

  useEffect(() => {
    if (!loading) {
      if (currentUserData.factoryId !== null) {
        getFactory();
      }

      if (currentUserData.importerId !== null) {
        getImporter();
      }
    }
  }, [loading, currentUserData.factoryId, currentUserData.importerId]);

  const setAndStoreData = (newValue) => {
    setCurrentUserData(newValue);
  };

  return (
    <userDetails.Provider
      value={{ currentUserData, setCurrentUserData: setAndStoreData }}
    >
      {children}
    </userDetails.Provider>
  );
}
