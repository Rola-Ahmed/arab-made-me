import { useEffect, useState } from "react";
import Factories from "./Factories";
import { useSearchParams } from "react-router-dom";

import {
  fetchFactorieswithParam,
  fetchFactoryProductsSize,
} from "Services/factory";

export default function FetchFactories() {
  const [searchParams] = useSearchParams();
  const filterSearch = searchParams.get("filterSearch");
  // const filterByCountry = searchParams.get("filterByCountry");
  // const filterBySector = searchParams.get("filterBySector");
  // const filterByCategory = searchParams.get("filterByCategory");

  console.log("filterSearch", filterSearch);
  const numOfProductsFetch = 20;
  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 9,
    currentPage: 1,
    totalPage: 1,
  }));
  const [allFactoriesData, setAllFactoriesData] = useState([]);
  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );

  const [filter, setFilter] = useState({
    filterSearch: filterSearch || "",
    filterByCountry: "",
    filterBySector: [],
    // filterBySector: filterBySector?.split(",")?.map(String) ?? [],
  });
  console.log("filterfilterfilter", filter);

  const [apiLoadingData, setApiLoadingData] = useState({
    loadingPage: true,
    errorCausedMsg: '',
  });

  function getcurrentFilter(location='', search='', sector) {
    // console.log("location, search",location, search)
    let param = "";

    if (search) {
      param.concat(`&filter=${search}`);
    }
    if (location) {
      // param = param + `&location=${search}`;
      param.concat(`&location=${location}`);
    }
    
    // let param = `&location=${search}&filter=${location}`;


    return `&location=${location}&filter=${search}`;
  }

  async function FetchTotalLen() {
    try {
      let param = getcurrentFilter(filter?.location, filter?.filterSearch, "");
      console.log("param", param);

      let result = await fetchFactorieswithParam(param);

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
    } catch (error) {}
  }

  useEffect(() => {
    FetchTotalLen();
  }, [filter]);

  useEffect(() => {
    const fetchFactoriesData = async () => {
      let param = "";
      if (filter?.location) {
        param = getcurrentFilter(filter?.location, filter?.filterSearch, "");
      }
      try {
        let result = await fetchFactorieswithParam(
          `size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&${param}`
        );

        // if there is error
        if (result && result.error) {
        }
        if (result?.success) {
          setAllFactoriesData(result.data.factories);
          const uniqueIds = [
            ...new Set(
              result.data.factories
                .map((obj) => obj.id) // Extract all factoryIds
                .filter((id) => id !== null) // Filter out null values
            ),
          ];

          setUniqueFactoryIDofProducts(uniqueIds);
        }
      } catch (error) {}
    };

    fetchFactoriesData();

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pagination, filter]);

  //   factory products
  const getFactoryProduct = async (factoryId) => {
    try {
      let result = await fetchFactoryProductsSize(
        factoryId,
        numOfProductsFetch
      );

      if (result?.success) {
        // Extract specific attributes (id, name, coverImage) and filter out the rest
        const filteredAttributes = result.data.products.map((item) => {
          // Extract specific attributes
          const { id, name, coverImage } = item;

          return {
            id,
            name,
            coverImage,
          };
        });

        setAllFactoriesData((prevData) =>
          prevData?.map((item) =>
            item?.id === factoryId
              ? {
                  ...item,
                  productLength: result.data.products?.length,
                  productData: filteredAttributes,
                }
              : item
          )
        );
      }
    } catch (error) {}
  };

  //   loop on factory products
  useEffect(() => {
    if (uniqueFactoryIDofProducts !== null) {
      uniqueFactoryIDofProducts?.map((factoryId) => (
        <>{getFactoryProduct(factoryId)}</>
      ));
    }
  }, [uniqueFactoryIDofProducts]);

  return (
    <Factories
      setFilter={setFilter}
      allFactoriesData={allFactoriesData}
      pagination={pagination}
      filter={filter}
      setPagination={setPagination}
      apiLoadingData={apiLoadingData}
    />
  );
}
