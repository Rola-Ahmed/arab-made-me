import { getMonthName as getDate } from "utils/getMonthName";
import { baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";
import { useNavigate } from "react-router-dom";

let getMonthName = getDate;
export default function SourcingRequestCard(props) {
  let { reqData, currentUserData, setModalShow, isLogin } = props;
  let navigate = useNavigate();

  const accessForm = (directto) => {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));

      return;
    }

    if (
      currentUserData?.userRole == "importer" ||
      currentUserData?.userRole == "admin"
    ) {
      // if (currentUserData?.importerId !== null) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isImporterVerified: true,
      }));

      return;
    }

    if (currentUserData?.userRole == "user") {
      console.log("user");
      setModalShow((prevVal) => ({
        ...prevVal,
        isUser: true,
      }));

      return;
    }

    if (
      currentUserData?.userRole == "factory" &&
      currentUserData?.continueProfilePath != null
    ) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isFactoryVerified: true,
      }));

      return;
    } else {
      navigate(directto);
    }
  };

  return (
    // bg-success
    <div className="padding-card  pe-0  rounded-3 border">
      <div className="row w-100">
        <div className="col-9  ">
          <div className=" ">
            <p className="fs-22-semi  fs-600">{reqData?.productName} </p>
            <p className="sourcing horizontal-text-handler ">
              {reqData?.productDescription}
            </p>
            <p className="mb-1">
              <span className="fw-bold">Requested by </span>
              {reqData?.importer?.name}
            </p>
            {/* <div className="mb-1 d-flex"> */}
            <p className="mb-1 me-3">
              <span className="fw-bold">Quantity </span>
              {reqData?.quantity}
            </p>
            <p className="mb-1">
              <span className="fw-bold">Deadline </span>
              {reqData?.deadline
                ? getMonthName(reqData?.deadline?.split("T")?.[0])
                : " - "}
            </p>

            {/* </div> */}
            <p className="d-flex">
              <span className="fw-bold pe-1">Sourcing Countries</span>
              <span className="sourcing horizontal-text-handler-1">
                {reqData?.preferredCountries?.length == 0
                  ? "All Countries"
                  : reqData?.preferredCountries?.join(", ")}
              </span>
            </p>
          </div>
        </div>

        <div className="col-3 pe-0 ">
          <div className="position-relative w-100">
            <img
              className="sorcingh-img"
              src={`${baseUrl_IMG}/${reqData?.docs}`}
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
                    `/answerQuotation/SourcingReq?id=${reqData?.id}&productName=${reqData?.productName}&userId=${reqData?.importerId}`
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
                  `/SourcingRequest?sourcingRequestId=${reqData?.id}&productName=${reqData?.productName}`
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
