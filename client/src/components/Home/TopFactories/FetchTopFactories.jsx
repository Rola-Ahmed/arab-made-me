import { useEffect, useState, useContext } from "react";

import { factorieswithProducts } from "Services/factory";
import TopFactories from "./TopFactories";
import { userDetails } from "Context/userType";
import { UserToken } from "Context/userToken";

export default function FetchTopFactories() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  const numOfFactoriesFetch = 30;
  const [allFactoriesData, setAllFactoriesData] = useState([]);
  useEffect(() => {
    const fetchFactoriesData = async () => {
      let result = await factorieswithProducts(`size=${numOfFactoriesFetch}`);

      if (result?.success) {
        setAllFactoriesData(result?.data?.factories);
      }
    };

    fetchFactoriesData();
  }, []);

  return (
    <TopFactories
      allFactoriesData={allFactoriesData}
      isLogin={isLogin}
      currentUserData={currentUserData}
    />
  );
}
