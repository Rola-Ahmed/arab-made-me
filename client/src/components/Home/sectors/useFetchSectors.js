import { useState, useEffect } from "react";

import { FetchSectors } from "Services/sector";
export const useFetchSectors = () => {
  const [allSectors, setAllSectors] = useState([]);
  const [errormsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // try {
      let result = await FetchSectors();
      if (result?.success) {
        setAllSectors(result?.data?.sectors);
      } else {
        setErrorMsg(result?.error);
      }
      // } catch (error) {}
    };

    fetchData(); // Call the asynchronous function
  }, []);

  return allSectors, errormsg;
};
