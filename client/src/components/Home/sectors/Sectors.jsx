import "./sector.css";
import { useEffect, useState } from "react";

import { baseUrl_IMG, useAppTranslation } from "config.js";

import { handleImageError } from "utils/ImgNotFound";
import { useNavigate } from "react-router-dom";
import { useFetchSectors } from "hooks/useFetchSectors";
import { fetchSectorProducts } from "Services/sector";

function Sectors() {
  let { allSectors, errormsg } = useFetchSectors();
  const [allsSectors, setAllSectors] = useState([]);
  const { trans: t, currentLang } = useAppTranslation();

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
    <section className=" margin-sm-screen home-padding-t">
      <div className="container container-1 p-0 d-flex gap-48">
        <div className={`w-100 ${currentLang == "ar" && "ar-text"}`}>
          <p className={`header-Title mb-2 `}>
            {t("translation:titles.manufacturingSectors")}
          </p>
          <p className="fs-16 text-muted lh-normal">
            {t("titles.manufacturingSectorsSubtitle", { ns: "translation" })}
          </p>
        </div>
        {/* <div className="sector-container bg-danger"> */}
        <div className="sec-r-container secrotr-row  w-100">
          {errormsg != "" ? (
            <div className=" text-center m-auto w-100 rounded-3 border-2 border-row fw-bold m-auto py-5 rounded-3 text-center text-muted w-100">
              {errormsg}
            </div>
          ) : (
            <>
              {allsSectors?.map((item, index) => (
                <div className="sec-r-item">
                  <div
                    className="default-padding h-100 cursor bg-white border rounded-4 gap-16 d-flex align-items-center"
                    onClick={() => {
                      navigate(`productMarketPlace/${item?.id}-${item?.name}`);
                    }}
                  >
                    <img
                      id={index}
                      className={`m-0 p-0  borderContainer rounded-3 `}
                      src={`${baseUrl_IMG}/${item?.image}`}
                      alt={`${baseUrl_IMG}/${item?.image}`}
                      onError={handleImageError}
                    />
                    <div className="sector-text">
                      <p className="fs-18-semi mb-2 lh-normal">
                        {item?.name?.replace(/\bSupplies\b/gi, "")}
                      </p>

                      <p className="mb-0 fs-14  lh-normal">
                        {item?.productQuntity == 0
                          ? "Comming soon"
                          : `${item?.productQuntity} Products`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {/* </div> */}
      </div>
    </section>
  );
}

export default Sectors;
