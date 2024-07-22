import { useEffect, useState } from "react";

import axios from "axios";

import { baseUrl } from "config.js";

import AllProducts from "components/Products/AllProducts/AllProducts";
import { useParams, useLocation } from "react-router-dom";
import { getAllProducts } from "Services/products";
export default function AllProductsContainer() {
  // variables
  let { sectorID } = useParams();

  let location = useLocation();

  const [allProductsData, setAllProductsData] = useState();
  const [apiLoadingData, setapiLoadingData] = useState({
    loadingPage: true,
    errorCausedMsg: true,
  });
  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 9,
    currentPage: 1,
    totalPage: 1,
  }));

  const [filter, setFilter] = useState({
    filterBySort: "",
    filterByCountry: "",
    filterBySector:
      sectorID?.slice("-")?.[0] !== undefined
        ? [sectorID?.slice("-")?.[0]]
        : [],

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
      try {
        let url1 = `${baseUrl}/products?`;
        let url2 = `${baseUrl}/products?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&include=factory`;

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

        // const response1 = await axios.get(url1, {
        //   data: {
        //     sectors: filter?.filterBySector,
        //   },
        // });
        const response1 = await getAllProducts(url1);

        if (response1?.success) {
          setPagination((prevValue) => ({
            ...prevValue,
            totalPage: Math.ceil(
              (response1.data.products.length || 0) /
                prevValue.displayProductSize
            ),
          }));
        }

        setapiLoadingData({
          loadingPage: response1?.loadingStatus,
          errorCausedMsg: response1?.error,
        });

        // i display this page form two diffrent places either from secors of all products
        // let response2 = "";
        // display the products for specific sector
        // if (sectorID !== null || sectorID !== undefined) {
        let response2 = await axios.get(url2, {
          data: {
            sectors: filter?.filterBySector,
          },
        });

        if (response2?.data?.message === "done") {
          setAllProductsData(
            response2.data.products.filter((item) => item?.factoryId !== null)
          );
        }
      } catch (error) {}
    };

    fetchData();
  }, [pagination?.currentPage, filter]);

  return (
    <AllProducts
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
  );
}
