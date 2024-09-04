import { useEffect, useState, useContext } from "react";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { useFetchFactoryById } from "hooks/useFetchFactoryById";

const useFactoryProfile = () => {
  const { currentUserData, clearSession } = useContext(userDetails);
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

  return {
    factoryProfile,
    errorloadingProfile: errorMessage,
    setFactoryProfile,
    clearSession,
    isLogin,
  };
};

export default useFactoryProfile;
