import { useState, useEffect } from "react";
import { getOneProduct } from "Services/products";

// Custom hook to fetch data by ID
export const useFetchOneProduct = (productId) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (id) => {
      const result = await getOneProduct(id, {});
      if (result?.success) {
        setData(result?.data?.products);
      } else {
        setError(result?.error);
      }
    };
    fetchData(productId);
  }, [productId]);

  return { productDetails: data, error };
};
