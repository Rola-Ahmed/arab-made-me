import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getOneProduct } from "Services/products";
export function UseOneProduct() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [requestedData, setRequestedData] = useState({  });

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
  });


  useEffect(() => {
    async function fetchReqData() {
      let result = await getOneProduct(productId,{});
      if (result?.success) {
        setRequestedData((prevData) => ({
          ...prevData,
          ...result?.data?.products,
        }));
       
      } 
        setApiLoadingData((prevVal) => ({
          ...prevVal,
          reqData: result?.loadingStatus,
          errorWhileLoading: result?.error,
        }));

   
    }

  

    fetchReqData();

  
  }, [productId]);

  return {
    // isLogin,
    requestedData,
    apiLoadingData,
  };
}
