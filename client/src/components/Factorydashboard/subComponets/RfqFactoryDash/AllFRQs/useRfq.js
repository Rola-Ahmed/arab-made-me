import { useEffect, useState } from "react";
import { getRFQs } from "Services/FactoryRequests/rfq";

const useRFQData = (isLogin, filter) => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    displayProductSize: 8,
    totalPage: 1,
  });
  const [apiLoadingData, setApiLoadingData] = useState(true);
  const [allAnsRfqData, setAllAnsRfqData] = useState([]);
  const [errorsMsg, setErrorsMsg] = useState("");

  const fetchReqLeng = async () => {
    const params = `formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`;
    const result = await getRFQs(params, { authorization: isLogin });
    if (result?.success) {
      const totalRFQs = result.data?.rfqs?.length || 1;
      setPagination((prevValue) => ({
        ...prevValue,
        totalPage: Math.ceil(totalRFQs / prevValue.displayProductSize),
      }));
    }
  };

  const fetchReqData = async () => {
    setApiLoadingData(true);
    const params = `size=${pagination.displayProductSize}&page=${pagination.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}&include=importer&include=product`;
    const result = await getRFQs(params, { authorization: isLogin });
    console.log("result",result)
    if (result?.success) {
      setAllAnsRfqData(result?.data?.rfqs);
    } else {
      setErrorsMsg(result?.error);
    }
    setApiLoadingData(false);
  };

  useEffect(() => {
    fetchReqLeng();
  }, [filter]);

  useEffect(() => {
    fetchReqData();
  }, [pagination.currentPage, filter]);

  return { allAnsRfqData, pagination, apiLoadingData, errorsMsg ,setPagination};
};

export default useRFQData;
