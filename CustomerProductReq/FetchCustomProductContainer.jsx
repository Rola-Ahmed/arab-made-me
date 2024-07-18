import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "config.js";

import CustomerProductReq from "./CustomProductReq";
import useAuthFormChecks from "components/Forms/hooks/useAuthFormChecks";
import Header from "components/main/Header/Header";
function FetchCustomProductContainer() {
  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const factoryName = searchParams.get("factoryName");
  let navigate = useNavigate();

  let [factoryDetails, setFactoryDetails] = useState({});

  const [isLoading, setIsLoading] = useState({
    submitLoading: false,
    pageLoading: true,
  });

  async function fetchFactoryData() {
    setIsLoading((prev) => ({
      ...prev,
      pageLoading: true,
    }));
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/${factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.factories);
        setIsLoading((prev) => ({
          ...prev,
          pageLoading: false,
        }));
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  if (factoryId == null) {
    localStorage.setItem("ToHomePage", "Page Not Found");
    navigate("/");
  }

  useEffect(() => {
    fetchFactoryData();
  }, [factoryId]);

  // checks if user is logged in
  // can user access this page
  // if page is loading
  const authChecks = useAuthFormChecks(
    isLoading,
    "Custom Product Request",
    `CustomerProductReq?factoryId=${factoryId}&factoryName=${factoryName}`
  );

  if (authChecks) {
    return authChecks;
  }

  return (
    <>
      <Header title="Custom Product Request" />
      <CustomerProductReq
        factoryDetails={factoryDetails}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        factoryId={factoryId}
      />
    </>
  );
}

export default FetchCustomProductContainer;
