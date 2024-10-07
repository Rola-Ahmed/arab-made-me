import "./sector.css";
import { useEffect, useState } from "react";

import { baseUrl_IMG, useAppTranslation } from "config.js";

import { handleLogoTextError } from "utils/ImgNotFound";
import { useNavigate } from "react-router-dom";
import { fetchSectorswithProductsLength } from "Services/sector";

function Sectors() {
  const [allSectors, setAllSectors] = useState([]);
  const [errormsg, setErrormsg] = useState("");
  const { trans: t, currentLang } = useAppTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProductData = async () => {
      let result = await fetchSectorswithProductsLength("size=10");

      if (result?.success) {
        setAllSectors(result?.data?.sectors);
      } else {
        setErrormsg(result?.error);
      }
    };

    fetchProductData();
  }, []);
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
        <div className="sec-r-container secrotr-row  w-100 ">
          {errormsg != "" ? (
            <div className=" text-center m-auto w-100 rounded-3 border-2 border-row fw-bold m-auto py-5 rounded-3 text-center text-muted w-100">
              {errormsg}
            </div>
          ) : (
            <>
              {allSectors?.map((item, index) => (
                <div className="sec-r-item">
                  <div
                    className="default-padding h-100 cursor bg-white border rounded-4 gap-16 d-flex align-items-center ar-direction"
                    onClick={() => {
                      navigate(`productMarketPlace?filterBySector=${item?.id}`);
                    }}
                  >
                    <img
                      id={index}
                      className={`m-0 p-0  borderContainer rounded-3 `}
                      src={`${baseUrl_IMG}/${item?.image}`}
                      alt={`${baseUrl_IMG}/${item?.image}`}
                      onError={handleLogoTextError}
                    />
                    <div className="sector-text">
                      <p className="fs-18-semi mb-2 lh-normal">
                        {t(`sectors:sectors.${item?.name}`)}
                      </p>

                      <p className="mb-0 fs-14  lh-normal">
                        {item?.productscount == 0
                          ? `${t("translation:comingSoon")}`
                          : `${item?.productscount} ${t(
                              "translation:products"
                            )}`}
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
