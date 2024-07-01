import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import { baseUrl } from "config.js";
import { UserToken } from "Context/userToken";

import { errorHandler } from "utils/errorHandler";

import PrivateLabelReqIndexList from "components/Factorydashboard/subComponets/PrivateLabelRequest/Index/IndexList";

export default function PrivateLabeReqIndexContainer() {
  let { isLogin } = useContext(UserToken);

  const [allprivateLabelData, setAllprivateLabelData] = useState([]);
  const [apiLoadingData, setApiLoadingData] = useState(true);
  const [errorsMsg, setErrorsMsg] = useState();
  // filter update 
  const [dataFilterFromChild, setFilterDataFromChild] = useState("");

  const [pagination, setPagination] = useState(() => ({
    displayProductSize: 8,
    currentPage: 1,
    // will be called by api to get the max lenght of the product & divide it on displayProductSize inorder to get the total page
    totalPage: 1,
  }));

  const handleDataFromChild = (data) => {
    setFilterDataFromChild(data);
  };

  // get all data
  useEffect(() => {
    async function fetchFactoriesData() {
      setApiLoadingData(true);
      try {
        let config = {
          method: "get",
          url: `${baseUrl}/factories/factory/privateLabelings?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&formsFilter=${dataFilterFromChild?.formsFilter}&sort=${dataFilterFromChild?.sort}&include=product&include=importer`,
          headers: {
            authorization: isLogin,
          },
        };

        const response = await axios.request(config);
        if (response?.data?.message == "done") {
          setAllprivateLabelData(response.data.privateLabelings);
        } else {
          setErrorsMsg(response?.data?.message);
        }
        setApiLoadingData(false);
      } catch (error) {
        setApiLoadingData(false);
        setErrorsMsg(errorHandler(error));
      }
    }
    fetchFactoriesData();
  }, [
    pagination?.currentPage,
    pagination?.totalPage,
    dataFilterFromChild,
    isLogin,
  ]);
  // used to get the total length of the product
  useEffect(() => {
    const fetchDataLenght = async () => {
      try {
        const response1 = await axios.get(
          `${baseUrl}/factories/factory/privateLabelings?formsFilter=${dataFilterFromChild?.formsFilter}&sort=${dataFilterFromChild?.sort}`,
          {
            headers: {
              authorization: isLogin,
            },
          }
        );

        if (response1?.data?.message === "done") {
          setPagination((prevValue) => ({
            ...prevValue,
            totalPage: Math.ceil(
              (response1.data?.privateLabelings?.length || 0) /
                prevValue.displayProductSize
            ),
          }));
        }
      } catch (error) {}
    };

    fetchDataLenght();
  }, [dataFilterFromChild, isLogin]);

  return (
    <PrivateLabelReqIndexList
      allprivateLabelData={allprivateLabelData}
      pagination={pagination}
      setPagination={setPagination}
      handleDataFromChild={handleDataFromChild}
      apiLoadingData={apiLoadingData}
      errorsMsg={errorsMsg}
    />
  );
}
