import { useEffect, useState } from "react";

import AllProducts from "components/Products/AllProducts/AllProducts";
import { useParams } from "react-router-dom";
import { getAllProducts } from "Services/products";
import { useSearchParams } from "react-router-dom";

export default function AllProductsContainer() {
  // variables
  let { sectorID } = useParams();

  const [searchParams] = useSearchParams();
  const filterSearch = searchParams.get("filterSearch");
  const filterBySector = searchParams.get("filterBySector");

  const [allProductsData, setAllProductsData] = useState();
  const [apiLoadingData, setapiLoadingData] = useState({
    loadingPage: true,
    errorCausedMsg: null,
  });
  const [pagination, setPagination] = useState(() => ({
    displayProductSize: 9,
    currentPage: 1,
    totalPage: 1,
  }));

  const [filter, setFilter] = useState({
    filterBySort: "",
    filterByCountry: "",
    filterBySector: (() => {
      if (filterBySector) {
        return filterBySector?.split(",")?.map(Number);
      }
      if (sectorID?.slice("-")?.[0] !== undefined) {
        return [sectorID?.slice("-")?.[0]];
      }

      return []; // Return the full phone if no match found
    })(),

    filterBySearch: filterSearch ?? "",
  });
  console.log("filterfilterfilter",filter)

  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });

  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setapiLoadingData({
        loadingPage: true,
        errorCausedMsg: null,
      });
      setAllProductsData([]);

      let url1 = ``;
      let url2 = `?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&include=factory`;

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

      if (filter?.filterBySector?.length > 0) {
        url2 += `&sectors=${filter?.filterBySector.join(",")}`;
        url1 += `&sectors=${filter?.filterBySector.join(",")}`;
      }
      const response1 = await getAllProducts(url1);

      if (response1?.success) {
        setTimeout(() => {
          setPagination((prevValue) => ({
            ...prevValue,
            totalPage: Math.ceil(
              (response1?.data?.products?.length || 0) /
                prevValue.displayProductSize
            ),
          }));
        }, 50);
      }

      setTimeout(() => {
        setapiLoadingData({
          loadingPage: response1?.loadingStatus,
          errorCausedMsg: response1?.error,
        });
      }, 50);

      // i display this page form two diffrent places either from secors of all products
      // let response2 = "";
      // display the products for specific sector
      // if (sectorID !== null || sectorID !== undefined) {
      const response2 = await getAllProducts(url2);

      if (response2?.data?.message === "done") {
        setAllProductsData(response2?.data?.products);
      }
    };

    fetchData();

    const updateUrl = (filterSeacrh = "", filterBySector) => {
      const queryParams = new URLSearchParams();
      const oldUrl = `${window.location.pathname}`;

      if (filterSeacrh != "") {
        queryParams.set("filterSearch", filterSeacrh);
      } else {
        window.history.replaceState(null, "", oldUrl);
      }

      if (filterBySector?.length > 0) {
        queryParams.set("filterBySector", filterBySector?.join(","));
      } else {
        window.history.replaceState(null, "", oldUrl);
      }

      // if (filters?.filterBypartner != "") {
      //   queryParams.set("filter", filters.filterBypartner);
      // }

      const queryString = queryParams.toString();
      const newUrl = `${window.location.pathname}?${queryString}`;
      // Replace the current state in the history without triggering a navigation

      window.history.replaceState(null, "", newUrl);
    };

    updateUrl(filter?.filterBySearch, filter?.filterBySector);
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
