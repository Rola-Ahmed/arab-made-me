import React, { useEffect, useState } from "react";
import Factories from "./Factories";

import {
  fetchFactorieswithParam,
  fetchFactoryProductsSize,
} from "Services/factory";

export default function FetchFactories() {
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
    filterSearch: "",
    filterByCountry: "",
    filterBySector: [],
    // filterBySector: filterBySector?.split(",")?.map(String) ?? [],
  });

  const [apiLoadingData, setApiLoadingData] = useState({
    loadingPage: true,
    errorCausedMsg: true,
  });

  function getcurrentFilter(location, search, sector) {
    let param = "";

    if (filter?.filterSearch) {
      param = `param` + `&filter=${location}`;
    }
    if (filter?.filterByCountry) {
      param = `param` + `&location=${search}`;
    }
    return param;
  }

  async function FetchTotalLen() {
    try {
      let param = getcurrentFilter(filter?.location, filter?.filterSearch, "");

      let result = await fetchFactorieswithParam(param);

      if (result?.success) {
        setPagination((prevValue) => ({
          ...prevValue,
          totalPage: Math.ceil(
            (result.data.factories.length || 0) / prevValue.displayProductSize
          ),
        }));
      } else {
        setApiLoadingData({
          loadingPage: result?.loadingStatus,
          errorCausedMsg: result?.error,
        });
      }
    } catch (error) {}
  }

  useEffect(() => {
    FetchTotalLen();
  }, [filter]);

  useEffect(() => {
    const fetchFactoriesData = async () => {
      try {
        let param = getcurrentFilter(
          filter?.location,
          filter?.filterSearch,
          ""
        );
        let result = await fetchFactorieswithParam(
          `size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&${param}`
        );

        // if there is error
        if (result && result.error) {
        }
        if (result && result.success) {
          setAllFactoriesData(
            result.data.factories.filter((item) => item?.factoryId !== null)
          );
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

      if (result && result.success) {
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
          prevData.map((item) =>
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

  console.log("allFactoriesData", allFactoriesData);

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
