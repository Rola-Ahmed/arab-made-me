import { useState, useEffect } from "react";
import { getOneSourcingOffer } from "Services/sourcingOffer";

// Custom hook to fetch data by ID
export const useFetchOneOffer = (productId,params) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (id, params) => {
      if(!params){
        params='';
      }
      const result = await getOneSourcingOffer(id, params);

      if (result?.success) {
        setData(result?.data?.sourcingoffers);
      } else {
        setError(result?.error);
      }
    };
    fetchData(productId,params);
  }, [productId]);
  return { offerDetails: data, error };
};
