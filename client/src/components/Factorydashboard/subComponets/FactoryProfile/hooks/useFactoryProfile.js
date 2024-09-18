import { useEffect, useState, useContext } from "react";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { useFetchFactoryById } from "hooks/useFetchFactoryById";
import { determinePathAndData } from "utils/factoryUtils";

const useFactoryProfile = () => {
  const { currentUserData, clearSession,setCurrentUserData } = useContext(userDetails);
  const { isLogin } = useContext(UserToken);

  //  const { data, errorMessage } = useFetchFactoryById(16);
  const { data, errorMessage } = useFetchFactoryById(
    currentUserData?.factoryId
  );

  const [factoryProfile, setFactoryProfile] = useState(null);

  useEffect(() => {
    if (data) {
      setFactoryProfile({
        ...data,
        businessEmail: currentUserData?.userEmail,
      });
      
    }
  }, [data, currentUserData?.userEmail]);

  const updateCurrentUser = (factoryDatat) => {
    let { path } = determinePathAndData(factoryDatat);
    setCurrentUserData((prevUserData) => ({
      ...prevUserData,
      // continueProfilePath: null,
      continueProfilePath: path,
    }));
  };

  return {
    factoryProfile,
    errorloadingProfile: errorMessage,
    setFactoryProfile,
    clearSession,
    isLogin,
    updateCurrentUser
  };
};

export default useFactoryProfile;
