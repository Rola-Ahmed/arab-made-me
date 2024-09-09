import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchFactoryProducts, fetchOneFactory } from "Services/factory";
import { fetchProductData } from "Services/products";
import useAuthFormChecks from "components/Forms/hooks/useAuthFormChecks";
import PrivateLabel from "./PrivateLabel";

export default function PrivateLabelContainerAPI() {
  // State variables

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
  });
  const [productDetailsArr, setProductDetailsArr] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [factoryDataOnly, setFactoryDataOnly] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      let result;
      if (productId) {
        result = await fetchProductData(productId);
      } else {
        result = await fetchFactoryProducts(factoryId);
      }

      // if there is error
      if (result?.success) {
        //  state is success
        if (productId) {
          setProductDetails(result.data.products);
        } else {
          if (result?.data?.products?.length > 0) {
            setProductDetailsArr(result.data.products);
          } else {
            result = await fetchOneFactory(factoryId);
            setFactoryDataOnly(result?.data?.factories);
          }
        }
      }
      setIsLoading((prev) => ({
        ...prev,
        pageLoading: result.loadingStatus,
        errorPageLoading: result.error,
      }));
    };

    fetchData();
  }, [productId, factoryId]);

  // checks if user is logged in
  // can user access this page
  // if page is loading
  const authChecks = useAuthFormChecks(
    isLoading,
    "Private Label",
    `privatelabel/form?factoryId=${factoryId}&factoryName=${factoryName}${
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
        <PrivateLabel
          productIsSelected={true}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          // new
          factoryData={productDetails?.factory}
          productDetails={productDetails}
          productName={productName}
          productId={productId}
          factoryId={factoryId}
        />
      ) : (
        <PrivateLabel
          productIsSelected={false}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          productDetails={productDetailsArr}
          // new
          // factoryData={productDetailsArr?.[0]?.factory}
          factoryData={
            productDetailsArr?.length > 0
              ? productDetailsArr?.[0]?.factory
              : factoryDataOnly
          }
          productName={productName}
          productId={productId}
          factoryId={factoryId}
        />
      )}
    </>
  );
}
