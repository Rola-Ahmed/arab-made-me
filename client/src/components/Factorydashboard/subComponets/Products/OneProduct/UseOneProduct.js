import { useFetchOneProduct } from "hooks/useFetchOneProduct";
import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";

export function UseOneProduct() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  let { productDetails, error } = useFetchOneProduct(productId, {});
  let { isLogin } = useContext(UserToken);

  return {
    isLogin,
    // requestedData: productDetails,
     productDetails,
    apiLoadingData: {
      reqData: error ? true : false,
      errorWhileLoading: error,
    },
  };
}
