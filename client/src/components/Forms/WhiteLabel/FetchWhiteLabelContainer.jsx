import { useEffect, useState } from "react";

import WhiteLabel from "./WhiteLabel";
import { useSearchParams } from "react-router-dom";
import { fetchFactoryProducts } from "Services/factory";
import { fetchProductData } from "Services/products";
import useAuthFormChecks from "components/Forms/hooks/useAuthFormChecks";

export default function WhiteLabelContainerAPI() {
  // State variables
  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const productId = searchParams.get("productId");
  // Constants for URL parameters
  const factoryName = searchParams.get("factoryName");
  const productName = searchParams.get("productName");

  const [isLoading, setIsLoading] = useState({
    submitLoading: false,
    pageLoading: true,
    errorPageLoading: true,
  });
  const [productDetailsArr, setProductDetailsArr] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result;
        if (productId) {
          result = await fetchProductData(productId);
        } else if (!productId) {
          result = await fetchFactoryProducts(factoryId);
        }
        console.log("result", result);

        // if there is error
        if (result.error) {
        } else {
          //  state is success

          if (result.data.message == "done") {
            if (productId) {
              setProductDetails(result.data.products);
            } else {
              setProductDetailsArr(result.data.products);
            }
          }
        }
        setIsLoading((prev) => ({
          ...prev,
          pageLoading: result.loadingStatus,
          errorPageLoading: result.error,
        }));
      } catch (error) {
        console.log("white error", error);
        setIsLoading((prev) => ({
          ...prev,
          pageLoading: true,
          errorPageLoading: "jijujuuuhuhhuhuhu",
        }));
      }
    };

    fetchData();
  }, [productId, factoryId]);

  // checks if user is logged in
  // can user access this page
  // if page is loading
  const authChecks = useAuthFormChecks(
    isLoading,
    "White Label Request",
    `whiteLabelings/form?factoryId=${factoryId}&factoryName=${factoryName}${
      productId !== null
        ? `&productId=${productId}&productName=${productName}`
        : ""
    }`
  );

  if (authChecks) {
    return authChecks;
  }

  return (
    <>
      {productId ? (
        <WhiteLabel
          productIsSelected={true}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          // new
          factoryData={productDetails?.factory}
          productDetails={productDetails}
        />
      ) : (
        <WhiteLabel
          productIsSelected={false}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          productDetails={productDetailsArr}
          // new
          factoryData={productDetailsArr?.[0]?.factory}
        />
      )}
    </>
  );
}
