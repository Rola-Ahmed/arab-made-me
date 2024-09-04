import { useState, useEffect } from "react";
import { fetchOneFactory } from "Services/factory";

// Custom hook to fetch data by ID
export const useFetchFactoryById = (factoryId) => {
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchData = async (id) => {
      const result = await fetchOneFactory(id);
      if (result?.success) {
        setData(result?.data?.factories);
      } else {
        setErrorMessage(result?.error);
      }
    };
    fetchData(factoryId);
  }, [factoryId]);

  return { data, errorMessage };
};
