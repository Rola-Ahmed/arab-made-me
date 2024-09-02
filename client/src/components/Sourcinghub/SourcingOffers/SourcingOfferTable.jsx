import { useAppTranslation } from "config.js";
import SourcingOfferCard from "./SourcingOfferCard";

export default function SourcingOfferTable({
  allSourcingReqData,
  assessFormOPAuth,
}) {
  const { trans: t, currentLang } = useAppTranslation(["forms", "translation"]);

  return (
    <table
      className={`table table-striped align-middle ${
        currentLang == "ar" && "ar-p-size-thead"
      }`}
    >
      <thead>
        <tr className=" bg-header ">
          <th scope="col">
            <div className="d-flex  align-items-center justify-contnet-center ">
              <p className="fs-14-semi text-muted">
                {" "}
                {t("translation:product")}
              </p>
            </div>
          </th>
          <th scope="col">
            <div className="d-flex  align-items-center justify-contnet-center ">
              <p className="fs-14-semi text-muted">{t("forms:quantity")}</p>
            </div>
          </th>
          <th scope="col">
            <div className="d-flex  align-items-center justify-contnet-center ">
              <p className="fs-14-semi text-muted">
                {" "}
                {t("forms:exportingCountries")}
              </p>
            </div>
          </th>
          <th scope="col">
            <div className="d-flex  align-items-center justify-contnet-center ">
              <p className="fs-14-semi text-muted"> {t("forms:details")}</p>
            </div>
          </th>
          <th scope="col" className="">
            <div className="d-flex  align-items-center justify-contnet-center ">
              <p className="fs-14-semi text-muted">{t("forms:date")}</p>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {allSourcingReqData?.map((item) => (
          <SourcingOfferCard item={item} assessFormOPAuth={assessFormOPAuth} />
        ))}
      </tbody>
    </table>
  );
}
