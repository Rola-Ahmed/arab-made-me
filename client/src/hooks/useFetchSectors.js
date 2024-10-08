import { useState, useEffect } from "react";

import { FetchSectors } from "Services/sector";
export const useFetchSectors = () => {
  const [allSectors, setAllSectors] = useState([]);
  const [errormsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
    
      let result = await FetchSectors();
      console.log("result sectors",result)
      if (result?.success) {
        setAllSectors(result?.data?.sectors);
      } else {
        setErrorMsg(result?.error);
      }
    };

    fetchData(); // Call the asynchronous function
  }, []);


  return {allSectors, errormsg};
};
