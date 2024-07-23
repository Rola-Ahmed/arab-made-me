import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// config
import { baseUrl } from "config.js";
import { UserToken } from "Context/userToken";

// helper
import { errorHandler } from "utils/errorHandler";

// representational component
import ViewQuote from "components/Factorydashboard/subComponets/Quotations/ViewQuote/ViewQuote";

export default function ViewQuoteContainer() {
  let { isLogin } = useContext(UserToken);
  const [requestedData, setRequestedData] = useState([]);
  const [apiLoadingData, setapiLoadingData] = useState(true);
  const [errorsMsg, setErrorsMsg] = useState();
  const [pagination, setPagination] = useState(() => ({
    displayProductSize: 8,
    currentPage: 1,
    // will be called by api to set the total pages
    totalPage: 1,
  }));
  const [dataFilterFromChild, setFilterDataFromChild] = useState("");

  async function fetchFactoriesData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/factory/quotations?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&formsFilter=${dataFilterFromChild?.formsFilter}&sort=${dataFilterFromChild?.sort}&include=importer`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);
      if (response?.data?.message == "done") {
        setRequestedData(response.data.quotations);

        setapiLoadingData(false);
      } else {
        setErrorsMsg(response?.data?.message);
      }
    } catch (error) {
      setapiLoadingData(false);
      setErrorsMsg(errorHandler(error));
    }
  }

  const deleteData = async (itemId) => {
    try {
      let config = {
        method: "delete",
        url: `${baseUrl}/quotations/${itemId}`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      toast("Data Deleted Successfully", {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        draggable: true,
        theme: "colored",
        type: "success",
      });

      setRequestedData((prevValue) =>
        prevValue.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      // setapiLoadingData(true);

      toast("Something went wrong, please try again later", {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        draggable: true,
        theme: "colored",
        type: "error",
      });
    }
    // }
  };

  useEffect(() => {
    fetchFactoriesData();
  }, [pagination?.currentPage, dataFilterFromChild]);

  useEffect(() => {
    const fetchDataLenght = async () => {
      try {
        // const response1 = await axios.get(`${baseUrl}/quotations`);
        const response1 = await axios.get(
          `${baseUrl}/factories/factory/quotations?formsFilter=${dataFilterFromChild?.formsFilter}&sort=${dataFilterFromChild?.sort}`,
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
              (response1.data?.quotations?.length || 0) /
                prevValue.displayProductSize
            ),
          }));
        }
      } catch (error) {}
    };

    fetchDataLenght();
  }, [dataFilterFromChild]);

  return (
    <ViewQuote
      requestedData={requestedData}
      apiLoadingData={apiLoadingData}
      errorsMsg={errorsMsg}
      setFilterDataFromChild={setFilterDataFromChild}
      setPagination={setPagination}
      pagination={pagination}
      deleteData={deleteData}
    />
  );
}
