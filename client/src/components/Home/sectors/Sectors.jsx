import "./sector.css";
import { useEffect, useState } from "react";

import { baseUrl_IMG } from "config.js";

import Loading from "components/Loading/Loading";
import { handleImageError } from "utils/ImgNotFound";
import { useNavigate } from "react-router-dom";
import { useFetchSectors } from "components/Home/sectors/useFetchSectors";
import { fetchSectorProducts } from "Services/sector";

function Sectors() {
  let { allSectors, errormsg } = useFetchSectors();
  // let  errormsg = useFetchSectors();
  // console.log("errormsg", errormsg);

  const [allsSectors, setAllSectors] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      if (Array.isArray(allSectors) && allSectors.length > 0) {
        const updatedSectors = await Promise.all(
          allSectors?.map(async (item) => {
            let result = await fetchSectorProducts(item?.id);
            if (result?.success) {
              return {
                ...item,
                productQuntity: result?.data?.products?.length,
              };
            }
            return item;
          })
        );
        setAllSectors(updatedSectors);
      }
    };

    fetchProductData();
  }, [allSectors]);
  return (
    <section className="sector-section  margin-sm-screen">
      <div className="container container-1">
        <div className="w-100">
          <h2 className="text-4 text-start">Manufacturing Sectors</h2>
          <p className="text-5 text-start ">
            Everything you need to know about the product and billing.
            {allsSectors?.length}
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
                    <img
                      id={index}
                      className={`m-0 p-0  borderContainer`}
                      src={`${baseUrl_IMG}/${item?.image}`}
                      alt={`${baseUrl_IMG}/${item?.image}`}
                      onError={handleImageError}
                    />
                  </div>
                  <div className="sector-text">
                    <h4>{item?.name?.replace(/\bSupplies\b/gi, "")}</h4>

                    <p> {item?.productQuntity} Factory</p>
                  </div>
                </div>
              </div>
            ))}
            {errormsg !== "" ? (
              <div className=" text-center m-auto w-100 rounded-3 border-2 border-row fw-bold m-auto py-5 rounded-3 text-center text-muted w-100">
                {errormsg}
              </div>
            ) : (
              <>
                {allsSectors?.map((item, index) => (
                  <div className="sec-r-item">
                    <div
                      className="card-sector cursor"
                      onClick={() => {
                        navigate(
                          `productMarketPlace/${item?.id}-${item?.name}`
                        );
                      }}
                    >
                      <div className="sector-img">
                        <img
                          id={index}
                          className={`m-0 p-0  borderContainer`}
                          src={`${baseUrl_IMG}/${item?.image}`}
                          alt={`${baseUrl_IMG}/${item?.image}`}
                          onError={handleImageError}
                        />
                      </div>
                      <div className="sector-text">
                        <h4>{item?.name?.replace(/\bSupplies\b/gi, "")}</h4>

                        <p> {item?.productQuntity} Factory</p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sectors;
