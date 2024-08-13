import { useEffect, useState } from 'react';
import { getOneQuote } from 'Services/quotations'; 
import { useParams } from "react-router-dom";

const useOneQuote = () => {
    let { quoteId } = useParams();
  const [apiDetails, setApiDetails] = useState(null);

  // Fetch request data function
  async function fetchRequestData() {
      let result = await getOneQuote(quoteId);
      if (result?.success) {
        setApiDetails(result?.data?.quotations);
      } else {
        console.error('Failed to fetch data');
      }
   
  }

  useEffect(() => {
    if (quoteId !== undefined) {
      fetchRequestData();
    }
  }, [quoteId]);

  return {apiDetails};
};

export default useOneQuote;
