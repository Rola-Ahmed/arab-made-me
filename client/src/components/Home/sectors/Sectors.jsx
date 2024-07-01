import "./sector.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import Loading from "components/Loading/Loading";
import { handleImageError } from "utils/ImgNotFound";
import { useNavigate } from "react-router-dom";

// import img1 from "../../../assets/images/sectors/1.jpg";
// import img2 from "../../../assets/images/sectors/2.jpg";
// import img3 from "../../../assets/images/sectors/3.jpg";
// import img4 from "../../../assets/images/sectors/4.jpg";
// import img5 from "../../../assets/images/sectors/5.jpg";
// import img6 from "../../../assets/images/sectors/6.jpeg";
// import img7 from "../../../assets/images/sectors/7.jpg";
// import img8 from "../../../assets/images/sectors/8.jpg";
// import img9 from "../../../assets/images/sectors/9.jpg";
// import img10 from "../../../assets/images/sectors/10.jpg";

function Sectors() {
  const [allsSectors, setAllSectors] = useState([]);
  const [apiLoadingData, setapiLoadingData] = useState(true);
  async function fetchSectors() {
    setapiLoadingData(true);

    try {
      const response = await axios.get(`${baseUrl}/sectors?size=10`);

      if (response.data.message === "done") {
        setAllSectors(response.data.sectors);
      }
      setapiLoadingData(false);
    } catch (error) {
      setapiLoadingData(true);
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    // Promise.all(
    allsSectors.map(async (item) => {
      try {
        const productResponse = await axios.get(
          `${baseUrl}/sectors/products/${item?.id}`
        );

        if (productResponse.data.message === "done") {
          setAllSectors((prevData) =>
            prevData.map((value) =>
              value?.id === item?.id
                ? {
                    ...item,
                    productQuntity: productResponse?.data?.products?.length,
                  }
                : value
            )
          );
        }
      } catch (error) {}
    });
    // );
  }, [apiLoadingData]);

  useEffect(() => {
    fetchSectors();
  }, []);

  // still loading
  if (apiLoadingData == true) {
    return <Loading />;
  }

  return (
    <section className="sector-section  margin-sm-screen">
      <div className="container container-1">
        <div className="w-100">
          <h2 className="text-4 text-start">Manufacturing Sectors</h2>
          <p className="text-5 text-start ">
            Everything you need to know about the product and billing.
          </p>
        </div>
        <div className="sector-container">
          <div className="sec-r-container secrotr-row">
            {allsSectors?.map((item, index) => (
              <div className="sec-r-item">
                <div
                  className="card-sector cursor"
                  onClick={() => {
                    navigate(`productMarketPlace/${item?.id}-${item?.name}`);
                  }}
                >
                  <div className="sector-img">
                    {/* <Link className="text-decoration-none " to=""> */}
                    <img
                      id={index}
                      className={`m-0 p-0  borderContainer`}
                      src={`${baseUrl_IMG}/${item?.image}`}
                      // src={`img${item.id}`}
                      // src={getImageByIndex(item.id)}
                      alt={`img`[item.id]}
                      onError={handleImageError}
                    />
                    {/* </Link> */}
                  </div>
                  <div className="sector-text">
                    <h4>{item.name.replace(/\bSupplies\b/gi, "")}</h4>

                    <p> {item?.productQuntity} Factory</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sectors;
