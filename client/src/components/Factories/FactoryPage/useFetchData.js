import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchFactoryProducts2,
  fetchOneFactory,
  getEndorse,
  getFactoryTeam,
} from "Services/factory";

export const useFetchData = () => {
  let { factoryIdName } = useParams();

  const [factoryDetails, setFactoryDetails] = useState({
    totalProducts: 0,
    teamMembers: [],
    endorsements: 0,
  });
  const [factoryProduct, setFactoryProduct] = useState([]);

  async function fetchFactoryPage() {
    let result = await fetchOneFactory(factoryIdName?.split("-")?.[0]);

    if (result?.success) {
      setFactoryDetails((prevVal) => ({
        ...prevVal,
        ...result?.data?.factories,
      }));

      //   ProductsFactory();
    }
  }

  async function ProductsFactory() {
    let reuslt = await fetchFactoryProducts2(
      factoryIdName?.split("-")?.[0],
      {}
    );

    if (reuslt?.success) {
      const first25Products = reuslt?.data?.products?.slice(0, 25);
      setFactoryProduct(first25Products);
      setFactoryDetails((prevValues) => ({
        ...prevValues,
        totalProducts: reuslt?.data?.products?.length,
      }));
    }
  }

  async function fetchTeamData() {
    let result = await getFactoryTeam(factoryIdName?.split("-")?.[0], {});

    if (result?.success) {
      setFactoryDetails((prevValues) => ({
        ...prevValues,
        teamMembers: result?.data?.teamMembers,
      }));
    }
  }

  async function factoryEndorse() {
    let result = await getEndorse(factoryIdName?.split("-")?.[0], {});

    if (result?.success) {
      setFactoryDetails((prevValues) => ({
        ...prevValues,
        endorsements: result?.data?.endorsements?.length,
      }));
    }
  }

  useEffect(() => {
    async function fetchData() {
      await fetchFactoryPage();
      await ProductsFactory();
      await fetchTeamData();
      await factoryEndorse();
    }
    if (factoryIdName && factoryIdName?.split("-")?.[0] !== undefined) {
      fetchFactoryPage();

      fetchData();
    }
  }, [factoryIdName]);

  return { factoryDetails, factoryProduct, factoryIdName };
};
