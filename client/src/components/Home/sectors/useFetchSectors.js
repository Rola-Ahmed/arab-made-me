import { useState, useEffect } from "react";

import { FetchSectors } from "Services/sector";
export const useFetchSectors = () => {
  const [allSectors, setAllSectors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await FetchSectors();
        if (result?.success) {
          setAllSectors(result?.data?.sectors);
        }
      } catch (error) {}
    };

    fetchData(); // Call the asynchronous function
  }, []);

  return allSectors;
};
