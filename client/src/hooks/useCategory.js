import { useEffect, useState } from "react";
import { getCategory } from "Services/category";

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  const fetchReqData = async () => {
    try {
      const result = await getCategory();
      if (result?.success) {
        setCategories(result?.data?.categories || []);
      } else {
        console.error("Failed to fetch categories:", result?.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchReqData();
  }, []);

  return categories;
};

export default useCategories;
