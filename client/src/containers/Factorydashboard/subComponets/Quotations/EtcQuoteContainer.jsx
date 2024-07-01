// 3rd party
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

import { baseUrl } from "config.js";
import { UserToken } from "Context/userToken";

//
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg/IsLoggedInMsg";
// import FactoryUnVerified from "components/ActionMessages/FactoryUnVerifiedDash/FactoryUnVerifiedDash";
// import BecomomeAFactory from "components/ActionMessages/BecomomeAFactory/BecomomeAFactory";

// represntational component
import EtcQuote from "components/Factorydashboard/subComponets/Quotations/EtcQuote/EtcQuote";
export default function EtcQuoteContainer() {
  let { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();
  const quotationsId = searchParams.get("quotationsId");

  const [requestedData, setRequestedData] = useState();
  const [apiLoadingData, setapiLoadingData] = useState(true);
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState(
    "/signIn/factorydashboard/quotations/moreDetails?quotationsId=20"
  );

  async function fetchReqData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/factory/quotations?include=importer&include=factory`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        const matchedObject = response.data.quotations.find(
          (obj) => obj.id == quotationsId
        );

        if (matchedObject) {
          setRequestedData(matchedObject);
        }

        setapiLoadingData(false);
      } else {
        setapiLoadingData(true);
      }
    } catch (error) {
      setapiLoadingData(true);
    }
  }

  async function UpdateStatusData() {
    const data = { status: "seen" };
    try {
      let config = {
        method: "put",
        url: `${baseUrl}/quotations/${quotationsId}`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setRequestedData((prevVal) => ({
          ...prevVal,
          status: data.status,
        }));
      }
    } catch (error) {}
  }

  useEffect(() => {
    fetchReqData();
    UpdateStatusData();
  }, [quotationsId, isLogin]);

  useEffect(() => {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));
    }
  }, [isLogin]);

  return (
    <>
      <IsLoggedIn
        show={modalShow.isLogin}
        // show={true}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
        distination={isLoggedReDirect}
        bgBlur={"bg-blur"}
      />

      <EtcQuote requestedData={requestedData} isLogin={isLogin} />
    </>
  );
}
