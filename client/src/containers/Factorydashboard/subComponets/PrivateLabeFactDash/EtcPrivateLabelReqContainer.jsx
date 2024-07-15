import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { UserToken } from "Context/userToken";
import { baseUrl } from "config.js";

// utils function
import EtcPrivateLabelReq from "components/Factorydashboard/subComponets/PrivateLabelRequest/MoreDetails/EtcPrivateLabelReq";

export default function EtcPrivateLabelReqContainer() {
  let { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const privateLabelId = searchParams.get("privateLabelId");

  const [apiLoadingData, setApiLoadingData] = useState({
    reqData: true,
    findQuotation: true,
  });

  const [requestedData, setRequestedData] = useState({ quoteId: null });

  async function fetchReqData() {
    setApiLoadingData((prevVal) => ({
      ...prevVal,
      reqData: true,
      findQuotation: true,
    }));
    // get privtae label data
    let ReqDataconfig = {
      method: "get",
      url: `${baseUrl}/privateLabelings/${privateLabelId}?include=importer`,
    };

    // check if private label has qoutations
    let QouteIdConfig = {
      method: "get",
      url: `${baseUrl}/factories/factory/quotations`,
      headers: {
        authorization: isLogin,
      },
    };

    try {
      const response1 = await axios(ReqDataconfig);
      if (response1.data.message === "done") {
        setRequestedData((prevData) => ({
          ...prevData,
          ...response1.data.privatelabelings,
        }));
        setApiLoadingData((prevVal) => ({
          ...prevVal,
          reqData: false,
        }));
      } else {
      }
    } catch (error) {}

    try {
      const response2 = await axios(QouteIdConfig);

      if (response2.data.message === "done") {
        // Extract the quotations array from the response
        const { quotations } = response2.data;

        quotations.forEach((item) => {
          if (item.privateLabelingId == privateLabelId) {
            // Use item.id to match with privateLabelId
            setRequestedData((prevData) => ({
              ...prevData,
              quoteId: item.id, // Use item.id directly
            }));
            setApiLoadingData((prevVal) => ({
              ...prevVal,
              findQuotation: false,
            }));
          }
        });
      }
    } catch (error) {}
  }

  //update status once the form is opend from pending to seen
  async function updateData(status) {
    setApiLoadingData(true);

    try {
      let config = {
        method: "put",
        url: `${baseUrl}/privateLabelings/factory/${privateLabelId}`,
        headers: {
          authorization: isLogin,
        },
        data: {
          status: status,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setRequestedData((prevVal) => ({
          ...prevVal,
          status: status,
        }));

        if (status !== "seen") {
          toast("Status Updated", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            theme: "colored",
            type: "success",
          });
        }
      } else {
        if (status !== "seen") {
          toast("Something Went Wrong, please try Again Later", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            theme: "colored",
            type: "error",
          });
        }
      }
    } catch (error) {
      if (status !== "seen") {
        toast("Something Went Wrong, please try Again Later", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          theme: "colored",
          type: "error",
        });
      }
    }
  }

  //
  useEffect(() => {
    fetchReqData();
  }, [privateLabelId]);

  useEffect(() => {
    if (
      requestedData?.status &&
      !["rejected", "accepted"].includes(requestedData.status.toLowerCase())
    ) {
      updateData("seen");
    }
  }, [privateLabelId, requestedData.status]);

  return (
    <EtcPrivateLabelReq
      isLogin={isLogin}
      requestedData={requestedData}
      apiLoadingData={apiLoadingData}
    />
  );
}
