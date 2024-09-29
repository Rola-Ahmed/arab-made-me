import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { getOneSourcingOffer } from "Services/sourcingOffer";

export function UseOneOffer() {
  const { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const factoryOffersId = searchParams.get("factoryOffersId");
  const [requestedData, setRequestedData] = useState({  });

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    errorWhileLoading: null,
  });


  useEffect(() => {
    async function fetchReqData() {
      let result = await getOneSourcingOffer(factoryOffersId, "include=product");
      if (result?.success) {
        setRequestedData((prevData) => ({
          ...prevData,
          ...result?.data?.sourcingoffers,
        }));
       
      } 
        setApiLoadingData((prevVal) => ({
          ...prevVal,
          reqData: result?.loadingStatus,
          errorWhileLoading: result?.error,
        }));

   
    }

  

    fetchReqData();

  
  }, [factoryOffersId, isLogin]);

  return {
    isLogin,
    requestedData,
    apiLoadingData,
    setRequestedData,
  };
}
