import { useEffect, useState, useContext } from "react";
import Factories from "./Factories";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { factorieswithProducts } from "Services/factory";

export default function FetchFactories() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  const [searchParams] = useSearchParams();
  const filterSearch = searchParams.get("filterSearch");
  // const filterByCountry = searchParams.get("filterByCountry");
  const filterBySector = searchParams.get("filterBySector");
  // const filterByCategory = searchParams.get("filterByCategory");

  // const numOfProductsFetch = 20;
  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 9,
    currentPage: 1,
    totalPage: 1,
  }));
  const [allFactoriesData, setAllFactoriesData] = useState([]);

  const [filter, setFilter] = useState({
    filterSearch: filterSearch || "",
    filterByCountry: "",
    filterBySector: (() => {
      if (filterBySector) {
        return filterBySector?.split(",")?.map(Number);
      }

      return []; // Return the full phone if no match found
    })(),
    // filterBySector: filterBySector?.split(",")?.map(String) ?? [],
  });

  const [apiLoadingData, setApiLoadingData] = useState({
    loadingPage: true,
    errorCausedMsg: "",
  });

  async function FetchTotalLen() {
    let params = `location=${filter?.filterByCountry}&filter=${
      filter?.filterSearch
    }&sector=${filter?.filterBySector.join(",")}`;

    let result = await factorieswithProducts(params);

    if (result?.success) {
      setPagination((prevValue) => ({
        ...prevValue,
        totalPage: Math.ceil(
          (result.data.factories.length || 0) / prevValue.displayProductSize
        ),
      }));
    }
    //   } else {

    setApiLoadingData({
      loadingPage: result?.loadingStatus,
      errorCausedMsg: result?.error,
    });
    //   }
  }

  useEffect(() => {
    FetchTotalLen();
  }, [filter]);

  useEffect(() => {
    const fetchFactoriesData = async () => {
      let params = `location=${filter?.filterByCountry}&filter=${
        filter?.filterSearch
      }&sectors=${filter?.filterBySector.join(",")}`;

      let result = await factorieswithProducts(
        `size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&${params}`
      );

      // if there is error

      if (result?.success) {
        setAllFactoriesData(result.data.factories);
      }
    };
    

    fetchFactoriesData();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pagination, filter]);

  return (
    <Factories
      setFilter={setFilter}
      allFactoriesData={allFactoriesData}
      pagination={pagination}
      filter={filter}
      setPagination={setPagination}
      apiLoadingData={apiLoadingData}
      currentUserData={currentUserData}
      isLogin={isLogin}
    />
  );
}
