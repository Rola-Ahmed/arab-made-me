import { useEffect, useState } from "react";

import axios from "axios";

import { baseUrl } from "config.js";
import AllProducts from "components/Products/AllProducts/AllProducts";
import { useLocation, useSearchParams } from "react-router-dom";

export default function FactoryProductsContainer() {
  // variables
  const [searchParams] = useSearchParams();

  const factoryId = searchParams.get("factoryId");
  const factoryName = searchParams.get("factoryName");

  let location = useLocation();

  const [allProductsData, setAllProductsData] = useState();

  const [apiLoadingData, setapiLoadingData] = useState(false);
  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 9,
    currentPage: 1,
    totalPage: 1,
  }));

  const [filter, setFilter] = useState({
    filterBySort: "",
    filterByCountry: "",
    filterBySector: [],

    filterBySearch: location?.state?.filterBy ?? "",
  });

  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setapiLoadingData(false);
      try {
        let url1 = `${baseUrl}/factories/products/${factoryId}?`;
        let url2 = `${baseUrl}/factories/products/${factoryId}?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&include=factory`;

        if (filter?.filterBySearch !== "") {
          url2 += `&filter=${filter?.filterBySearch}`;
          url1 += `&filter=${filter?.filterBySearch}`;
        }

        if (filter?.filterByCountry !== "") {
          url2 += `&location=${filter?.filterByCountry}`;
          url1 += `&location=${filter?.filterByCountry}`;
        }

        if (filter?.filterBySort !== "") {
          url2 += `&sort=${filter?.filterBySort}`;
          url1 += `&sort=${filter?.filterBySort}`;
        }

        const response1 = await axios.get(url1, {
          data: {
            sectors: filter?.filterBySector,
          },
        });

        if (response1.data.message === "done") {
          setPagination((prevValue) => ({
            ...prevValue,
            totalPage: Math.ceil(
              (response1.data.products.length || 0) /
                prevValue.displayProductSize
            ),
          }));
        }

        // i display this page form two diffrent places either from secors of all products
        let response2 = await axios.get(url2, {
          data: {
            // sectors: filter?.filterBySector,
            ...(filter?.filterBySector &&
              filter?.filterBySector.length > 0 && {
                sectors: filter?.filterBySector,
              }),
          },
        });

        if (response2?.data?.message === "done") {
          setAllProductsData(response2.data.products);

          setapiLoadingData(true);
        }
      } catch (error) {
        setapiLoadingData(false);
      }
    };

    fetchData();
  }, [pagination?.currentPage, filter, pagination?.displayProductSize]);

  return (
    <>
      <AllProducts
        headerTitle={`${factoryName} Products`}
        allProductsData={allProductsData}
        apiLoadingData={apiLoadingData}
        filter={filter}
        setFilter={setFilter}
        pagination={pagination}
        setPagination={setPagination}
        modalShow={modalShow}
        setModalShow={setModalShow}
        isLoggedReDirect={isLoggedReDirect}
        setisLoggedReDirect={setisLoggedReDirect}
      />
    </>
  );
}
