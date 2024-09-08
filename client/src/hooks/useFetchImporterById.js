import { useState, useEffect } from "react";
import { fetchOneImporter } from "Services/importer";

// Custom hook to fetch data by ID
export const useFetchImporterById = (importerId) => {
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchData = async (id) => {
      const result = await fetchOneImporter(id,{});
      if (result?.success) {
        setData(result?.data?.importers);
      } else {
        setErrorMessage(result?.error);
      }
    };
    fetchData(importerId);
  }, [importerId]);

  return { data, errorMessage };
};
