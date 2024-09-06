import { useEffect, useContext } from "react";
import { useFetchFactoryById } from "hooks/useFetchFactoryById";
import { getFactoryTeam } from "Services/factory";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

export const useMircoData = (update, fetch_team) => {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const { data, errorMessage } = useFetchFactoryById(
    currentUserData?.factoryId
  );

  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        // Dispatch an action with the fetched data
        update(data);

        // Fetch the team data
        const result = await getFactoryTeam(currentUserData?.factoryId);
        // Check if the result is successful and dispatch the team data
        if (result?.success) {
          fetch_team(result?.data?.teamMembers);
          // update(result?.data?.teamMembers);
        }
      }
    };

    fetchData();
  }, [data, currentUserData?.factoryId]);

  return {
    isLogin,
    errorloadingData: errorMessage,
  };
};
