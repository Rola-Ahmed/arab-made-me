import { useEffect, useState } from "react";

import {
  fetchFactorieswithParam,
  fetchFactoryProductsSize,
} from "Services/factory";
import TopFactories from "./TopFactories";

export default function FetchTopFactories() {
  const numOfFactoriesFetch = 30;
  const numOfProductsFetch = 20;
  const [allFactoriesData, setAllFactoriesData] = useState([]);

  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );

  useEffect(() => {
    const fetchFactoriesData = async () => {
      let result = await fetchFactorieswithParam(`size=${numOfFactoriesFetch}`);

      if (result?.success) {
        setAllFactoriesData(
          result?.data?.factories?.filter((item) => item?.factoryId !== null)
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
    };

    fetchFactoriesData();
  }, []);

  const getFactoryProduct = async (factoryId) => {
    let result = await fetchFactoryProductsSize(factoryId, numOfProductsFetch);

    if (result?.success) {
      // Extract specific attributes (id, name, coverImage) and filter out the rest
      const filteredAttributes = result?.data?.products?.map((item) => {
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
                productLength: result?.data?.products?.length,
                productData: filteredAttributes,
              }
            : item
        )
      );
    }
  };

  useEffect(() => {
    if (uniqueFactoryIDofProducts !== null) {
      uniqueFactoryIDofProducts?.map((factoryId) => (
        <>{getFactoryProduct(factoryId)}</>
      ));
    }
  }, [uniqueFactoryIDofProducts]);

  return <TopFactories allFactoriesData={allFactoriesData} />;
}
