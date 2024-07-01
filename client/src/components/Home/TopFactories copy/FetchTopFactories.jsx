import React, { useEffect, useState, useContext, useRef } from "react";
import "./TopFactories.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HandleUsersBtnAccess, {
  handleIsLoggedInBtn,
} from "utils/actionBtns/HandleUsersBtnAccess";

import { Link, useNavigate } from "react-router-dom";
import { UserToken } from "Context/userToken";
// modals
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerifiedModal/ImporterUnVerifiedModal";
import UserNotAuthorized from "components/ActionMessages/UserNotAuthorized/UserNotAuthorized";
import DescritionPopUp from "components/Helpers/DescritionPopUp";

import { userDetails } from "Context/userType";

import { handleImageError } from "utils/ImgNotFound";
// static variabls
import { BtnDescription } from "constants/BtnDescription";
import DropdownActionBtnsFactory from "components/Shared/DropdownActionBtns/FactoryBtns/DropdownActionBtnsFactory";
import ProductCarousel from "./ProductCarousel/ProductCarousel";
import BannerSlider from "./BannerSlider/BannerSlider";

export default function TopFactories() {
  const [allFactoriesData, setAllFactoriesData] = useState([]);

  const sliderRef = useRef();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  const numOfFactoriesFetch = 50;
  // const numOfFactoriesFetch = 2;

  let navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );

  // action verification
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");
  let [factoryHasProduct, setFactoryHasProduct] = useState({
    status: false,
    location: "",
  });

  async function fetchFactoriesData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories?size=${numOfFactoriesFetch}`,
      };

      const response = await axios.request(config);
      setAllFactoriesData(
        response.data.factories.filter((item) => item?.factoryId !== null)
      );
      const uniqueIds = [
        ...new Set(
          response.data.factories
            .map((obj) => obj.id) // Extract all factoryIds
            .filter((id) => id !== null) // Filter out null values
        ),
      ];

      setUniqueFactoryIDofProducts(uniqueIds);
    } catch (error) {}
  }
  const getFactoryProduct = async (factoryId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/factories/products/${factoryId}?size=100`
      );

      let productCoverImg = [];
      let productName = [];
      let productId = [];

      response.data.products.map((item) => {
        if (item.coverImage !== null) {
          productCoverImg.push(item.coverImage);
        }
        productName.push(item.name);
        productId.push(item.id);
      });

      setAllFactoriesData((prevData) =>
        prevData.map((item) =>
          item?.id === factoryId
            ? {
                ...item,
                productCoverImg: productCoverImg,
                productName: productName,
                productId: productId,
                productLength: response.data.products?.length,
              }
            : item
        )
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchFactoriesData();
  }, []);

  useEffect(() => {
    if (uniqueFactoryIDofProducts !== null) {
      uniqueFactoryIDofProducts?.map((factoryId) => (
        <>{getFactoryProduct(factoryId)}</>
      ));
    }
  }, [uniqueFactoryIDofProducts]);

  const settingsMain = {
    // dots: false,
    // fade: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1398,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },

      {
        breakpoint: 989,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 539,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  function DirectToFactoryPage(factoryId, factoryName) {
    navigate(`/factoryPage/${factoryId}-${factoryName}`);
  }

  const handleBtnCheckIfProductExisit = (
    loginPath,
    productLength,
    id,
    name
  ) => {
    if (productLength == 0) {
      setFactoryHasProduct({
        status: true,
        location: `factoryId=${id}&factoryName=${name}`,
      });
      return;
    }
    handleUserClickValidation1(loginPath);
  };




  return <></>;
}
