import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { factorieswithProducts } from "Services/factory";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

export const useFetchFactories = () => {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  const [searchParams] = useSearchParams();
  const filterSearch = searchParams.get("filterSearch");
  const filterBySector = searchParams.get("filterBySector");
  // const filterByCountry = searchParams.get("filterByCountry");
  // const filterByCategory = searchParams.get("filterByCategory");



  const [pagination, setPagination] = useState(() => ({
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
      return [];
    })(),
  });

  const [apiLoadingData, setApiLoadingData] = useState({
    loadingPage: true,
    errorCausedMsg: "",
  });

  useEffect(() => {
    const fetchFactoriesData = async () => {
      let params = `location=${filter?.filterByCountry}&filter=${
        filter?.filterSearch
      }&sectors=${filter?.filterBySector.join(",")}`;

      let result = await factorieswithProducts(
        `size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&${params}`
      );

      if (result?.success) {
        setAllFactoriesData(result.data.factories);
        setPagination((prevValue) => ({
          ...prevValue,
          totalPage: result?.data?.pagination?.totalPages,
        }));
      }

      setApiLoadingData({
        loadingPage: result?.loadingStatus,
        errorCausedMsg: result?.error,
      });
    };

    fetchFactoriesData();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pagination?.currentPage, filter]);

  return {
    allFactoriesData,
    pagination,
    filter,
    apiLoadingData,
    currentUserData,
    isLogin,
    setFilter,
    setPagination,
  };
};
