import { useState, useEffect } from "react";
import { fetchFactoryProducts2 } from "Services/factory";

// Custom hook to fetch data by ID
export const useFetchFactoryPrdoucts = (id, params) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (id, params) => {
      const result = await fetchFactoryProducts2(id, params);
      if (result?.success) {
        setData(result?.data?.products);
      } else {
        setError(result?.error);
      }
    };

    fetchData(id, params);
  }, [id]);

  return { factoryProducts: data, error };
};
