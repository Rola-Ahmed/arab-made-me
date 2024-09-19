import { getMonthName as getDate } from "utils/getMonthName";
import { baseUrl_IMG } from "config.js";
import { handleLogoTextError } from "utils/ImgNotFound";
import { useAppTranslation } from "config.js";

let getMonthName = getDate;
export default function SourcingRequestCard(props) {
  let { reqData, datacompletelyLoaded, accessFormSourcingRequest } = props;
  const { trans: t, currentLang } = useAppTranslation();
  const isArabic = currentLang == "ar"; // Check if the language is Arabic

  return (
    // bg-success
    <div className="padding-card  pe-0  rounded-3 border">
      <div className={`row w-100 ${isArabic && "ar-flex-reverse ar-text"}`}>
        <div className="col-9  ">
          <div className=" ">
            <p className="fs-22-semi  fs-600">{reqData?.productName} </p>
            <p className="sourcing horizontal-text-handler ">
              {reqData?.productDescription}
            </p>
            <p className="mb-1">
              <span className="fw-bold" translate="no">
                Requested by{" "}
              </span>
              {reqData?.importer?.name}
            </p>
            {/* <div className="mb-1 d-flex"> */}
            <p className="mb-1 me-3">
              <span className="fw-bold" translate="no">
                Quantity{" "}
              </span>
              {reqData?.quantity}
            </p>
            <p className="mb-1">
              <span className="fw-bold">Deadline </span>
              {reqData?.deadline
                ? getMonthName(reqData?.deadline?.split("T")?.[0])
                : " - "}
            </p>

            {/* </div> */}
          </div>
        </div>

        <div className="col-3 pe-0 ">
          <div className="position-relative w-100">
            <img
              className="sorcingh-img"
              src={`${baseUrl_IMG}/${reqData?.docs}`}
              onError={handleLogoTextError}
              alt="sourcing request img"
            />
          </div>
        </div>
        <div className="col-12  ">
          <div className=" w-100 d-flex">
            <p className="fw-bold pe-1 w-fit-content">Sourcing Countries</p>
            <p className="title-text-handler" style={{ flex: "1" }}>
              {" "}
              {reqData?.preferredCountries?.length == 0
                ? "All Countries"
                : reqData?.preferredCountries?.join(", ")}
            </p>
          </div>
        </div>
        <div className="col-12 pe-0">
          <div className="d-flex mt-2">
            {datacompletelyLoaded ? (
              <button
                className="req-btn bg-main text-white me-2   "
                type="button"
              >
                <i className="fas fa-spinner fa-spin text-white"></i>
              </button>
            ) : (
              <button
                className="req-btn  me-2 cursor fs-14-med fw-600 bg-main text-white"
                onClick={() => {
                  accessFormSourcingRequest(
                    `answerQuotation/SourcingReq?id=${reqData?.id}&productName=${reqData?.productName}&userId=${reqData?.importerId}`
                  );
                }}
              >
                Send Quote
              </button>
            )}

            <button
              className="req-btn cursor fs-14-med fw-600 text-main-2 bg-white"
              type="button"
              onClick={() => {
                accessFormSourcingRequest(
                  `SourcingRequest?sourcingRequestId=${reqData?.id}&productName=${reqData?.productName}`
                );
              }}
            >
              More Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
