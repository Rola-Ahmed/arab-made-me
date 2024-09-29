import { useState, useEffect } from "react";
import { getOneSourcingOffer } from "Services/sourcingOffer";

// Custom hook to fetch data by ID
export const useFetchOneOffer = (productId) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (id, params) => {
      const result = await getOneSourcingOffer(id, params);

      if (result?.success) {
        setData(result?.data?.sourcingoffers);
      } else {
        setError(result?.error);
      }
    };
    fetchData(productId);
  }, [productId]);
  return { offerDetails: data, error };
};
