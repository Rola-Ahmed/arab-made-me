import { useState } from "react";
import { baseUrl } from "config.js";

import { useNavigate } from "react-router-dom";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ContactBtn from "components/Importerdashboard/Shared/ContactBtn";

// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import { formattedTime as getFornattedTime } from "utils/formattedTime";
import FactoryInfo from "components/Forms/Shared/FactoryInfo";
import { useOneVisit } from "./useOneVisit";
import Loading from "components/Loading/Loading";

// import FactoryUnVerified from "components/ActionMessages/FactoryUnVerifiedDash/FactoryUnVerifiedDash";
export default function VisitRequestEtc() {
  let navigate = useNavigate();

  let { isLogin, requestedData, apiLoadingData } = useOneVisit();
  let formattedTime = getFornattedTime;

  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState([]);

  // utils function
  let getMonthName = getDate;

  function handleIsLoggedInBtn(loginPath, storgaeName) {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));

      setisLoggedReDirect(`/signIn/${loginPath}`);
      return;
    }

    navigate(`/${loginPath}`);
  }

  return (
    <>
      <IsLoggedIn
        show={modalShow.isLogin}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
        distination={isLoggedReDirect}
      />

      <div id="view" className="m-4 order-section  ">
        <SubPageUtility
          currentPage="More Details"
          PrevPage="Factory Visit Requests"
        />
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Factory Visit Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/RequestVisit");
                }}
              >
                <p className="cursor">Factory Visit Requests</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {apiLoadingData?.reqData && (
        <div className="section factory-profile m-5">
          <div className="container gap-container">
            <div className="row">
              <div className="d-flex justify-content-center w-100">
                {apiLoadingData?.errorWhileLoading ? (
                  <div className="border-3 border-row py-5">
                    <p className="text-muted fw-semibold text-center my-5 py-5">
                      {apiLoadingData?.errorWhileLoading}
                    </p>
                  </div>
                ) : (
                  <Loading />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!apiLoadingData?.reqData && (
        <div className="section factory-profile m-5">
          <div className="container gap-container">
            <div className="row">
              <div className="col-12  container-2-gap  p-0">
                <div className="container-profile-input w-100">
                  <div className="title-contianer-input w-100">
                    <FactoryInfo productDetails={requestedData?.factory} />
                  </div>
                </div>

                <div className="container-profile-input w-100">
                  <div className="title-contianer-input w-100">
                    <p> Factory Visit Details</p>
                    <div className="w-100 ">
                      <div className="row  row-gap">
                        <div className="col-6">
                          <div className="grid-gap-col">
                            <div className="form-group">
                              <label>status</label>
                              <input
                                className="form-control"
                                value={requestedData?.status || ""}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="grid-gap-col">
                            <div className="form-group">
                              <label>Visit Date </label>
                              <input
                                className="form-control"
                                value={` ${formattedTime(requestedData?.date)}`}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="grid-gap-col">
                            <div className="form-group">
                              <label>Created At </label>
                              <input
                                className="form-control"
                                value={
                                  `${getMonthName(
                                    requestedData?.createdAt?.split("T")?.[0]
                                  )}` || ""
                                }
                                readOnly
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group">
                            <label>purpose</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={requestedData?.purpose || ""}
                              readOnly
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 d-flex justify-content-start btn-modal-gap mb-4">
                  <ContactBtn
                    isLogin={isLogin}
                    handleIsLoggedInBtn={handleIsLoggedInBtn}
                    recieverUserId={requestedData?.factory?.userId}
                    baseUrl={baseUrl}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
