import { getMonthName as getDate } from "utils/getMonthName";
import { baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";
import { useNavigate } from "react-router-dom";

let getMonthName = getDate;
export default function SourcingRequestCard(props) {
  let { item, currentUserData, setModalShow } = props;
  let navigate = useNavigate();

  const accessForm = (directto) => {
    if (currentUserData?.importerId !== null) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isImporterVerified: true,
      }));

      return;
    }

    if (
      currentUserData?.factoryId !== null &&
      (currentUserData?.factoryVerified === "0" ||
        !currentUserData?.factoryEmailActivated)
    ) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isFactoryVerified: true,
      }));

      return;
    }

    if (
      currentUserData?.importerId == null &&
      currentUserData?.factoryId == null
    ) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isImporterVerified: true,
      }));

      return;
    } else {
      navigate(directto);
    }
  };

  return (
    <div className="parentsourc  pe-0 ">
      <div className="row w-100">
        <div className="col-9  ">
          <div className=" ">
            <h5 className="sour-2">{item?.productName} </h5>
            <p className="sourcing horizontal-text-handler ">
              {item?.productDescription}
            </p>
            <p className="mb-1">
              <span className="fw-bold">Requested by</span>
              {item?.importer?.name}
            </p>
            {/* <div className="mb-1 d-flex"> */}
            <p className="mb-1 me-3">
              <span className="fw-bold">Quantity</span>
              {item?.quantity}
            </p>
            <p className="mb-1">
              <span className="fw-bold">Deadline</span>
              {item?.deadline
                ? getMonthName(item?.deadline?.split("T")?.[0])
                : " - "}
            </p>

            {/* </div> */}
            <p className="d-flex">
              <span className="fw-bold pe-1">Sourcing Countries</span>
              <span className="sourcing horizontal-text-handler-1">
                {item?.preferredCountries?.length === 0
                  ? "All Countries"
                  : item?.preferredCountries
                      ?.map((countryitem) => countryitem)
                      .join(", ")}
              </span>
            </p>
          </div>
        </div>

        <div className="col-3 pe-0 ">
          <div className="img-parent-source">
            <img
              className="sorcingh-img"
              src={`${baseUrl_IMG}/${item?.docs}`}
              onError={handleImageError}
              alt="sourcing request img"
            />
          </div>
        </div>
        <div className="col-12 pe-0">
          <div className="d-flex mt-2">
            {currentUserData?.datacompletelyLoaded ? (
              <button
                className="req-btn btn-color me-2 req-btn cursor"
                type="button"
              >
                <i className="fas fa-spinner fa-spin text-white"></i>
              </button>
            ) : (
              <button
                className="req-btn btn-color me-2 req-btn cursor"
                onClick={() => {
                  accessForm(
                    `/answerQuotation/SourcingReq?id=${item?.id}&productName=${item?.productName}&userId=${item?.importerId}`
                  );
                }}
              >
                Send Quote
              </button>
            )}

            <button
              className="req-btn cursor "
              type="button"
              onClick={() => {
                accessForm(
                  `/SourcingRequest?sourcingRequestId=${item?.id}&productName=${item?.productName}`
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
