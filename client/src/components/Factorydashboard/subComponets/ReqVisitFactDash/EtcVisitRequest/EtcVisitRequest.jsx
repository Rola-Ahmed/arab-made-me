import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

import { baseUrl } from "config.js";

// auth
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

// modals
import BecomomeAFactory from "components/ActionMessages/BecomeAFactory/BecomeAFactory";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
// shared component accross  the components
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";

// shared function
import { getMonthName as getDate } from "utils/getMonthName";
import { formattedTime as getFornattedTime } from "utils/formattedTime";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";

export default function EtcVisitRequest() {
  let navigate = useNavigate();
  let getMonthName = getDate;
  let formattedTime = getFornattedTime;

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const visitReqId = searchParams.get("visitReqId");

  const [apiLoadingData, setapiLoadingData] = useState(true);
  const [PosData, setPosData] = useState();
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isFactory: false,
  });

  async function fetchReqData(url) {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/${url}`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        const matchedObject = response.data.visits.find(
          (obj) => obj.id == visitReqId
        );

        if (matchedObject) {
          setPosData(matchedObject);
        }

        setapiLoadingData(false);
      } else {
        setapiLoadingData(true);
      }
    } catch (error) {
      setapiLoadingData(true);
    }
  }

  async function UpdateStatusData() {
    const data = { status: "seen" };
    try {
      let config = {
        method: "put",
        url: `${baseUrl}/visits/${visitReqId}`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setPosData((prevVal) => ({
          ...prevVal,
          status: data.status,
        }));
      }
    } catch (error) {}
  }

  useEffect(() => {
    // if user for example is importer and so the data wont load
    if (currentUserData && currentUserData?.factoryId !== null) {
      fetchReqData(`factories/factory/visits?include=importer&include=factory`);
      UpdateStatusData();
    }
  }, [visitReqId, isLogin]);

  // auth validation
  useEffect(() => {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));
    } else {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: false,
      }));
    }

    if (currentUserData?.factoryId !== undefined) {
      if (currentUserData?.factoryId === null) {
        setapiLoadingData(true);

        setModalShow((prevVal) => ({
          ...prevVal,
          isFactory: true,
        }));
      } else {
        setModalShow((prevVal) => ({
          ...prevVal,
          isFactory: false,
        }));
      }
    }
  }, [currentUserData, isLogin]);

  return (
    <>
      <IsLoggedIn
        show={modalShow.isLogin}
        // onHide={() =>
        //   setModalShow((prevVal) => ({
        //     ...prevVal,
        //     isLogin: false,
        //   }))
        // }
        distination={`/sigin/`}
        bgBlur={"bg-blur"}
      />

      <BecomomeAFactory
        show={modalShow.isFactory}
        // onHide={() =>
        //   setModalShow((prevVal) => ({
        //     ...prevVal,
        //     isFactory: false,
        //   }))
        // }
        bgBlur={"bg-blur"}
      />

      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="Visit Requests" />

        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Factory Visit Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/factorydashboard/FactoryRequestVisit");
                }}
              >
                <p className="cursor">Factory Visit Requests</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <div className="d-flex justify-content-between">
                    <p>Factory Information</p>
                    <button
                      className="edit-profile"
                      onClick={() => {
                        navigate("/factorydashboard/mircoSite#factorylogo");
                      }}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Factory Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={PosData?.factory?.name || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Role</label>
                            <input
                              type="text"
                              className="form-control text-dark"
                              value="Factory"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representative phone number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={PosData?.factory?.repPhone || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representative Name</label>
                            <input
                              className="form-control text-dark"
                              value={`${
                                PosData?.factory?.repName == null
                                  ? " "
                                  : `${PosData?.factory?.repName?.[0]}  ${PosData?.factory?.repName?.[1]}`
                              }`}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label> Representative email</label>
                            <input
                              type="text"
                              className="form-control"
                              value={PosData?.factory?.repEmail || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <div className="d-flex justify-content-between">
                    <p>Buyer Information</p>
                  </div>
                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representative Name</label>
                            <input
                              type="text"
                              className="form-control text-dark"
                              value={`${
                                PosData?.importer?.repName == null
                                  ? " "
                                  : `${PosData?.importer?.repName}`
                              }`}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label> Representative email</label>
                            <input
                              type="text"
                              className="form-control"
                              value={PosData?.importer?.repEmail || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representative phone number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={PosData?.importer?.repPhone || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                              value={PosData?.status || ""}
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
                              value={` ${formattedTime(PosData?.date)}`}
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
                                  PosData?.createdAt?.split("T")?.[0]
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
                            value={PosData?.purpose || ""}
                            readOnly
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 d-flex justify-content-start btn-modal-gap">
                <button
                  className="btn-edit border-btn bg-white  d-none"
                  type="button"
                  onClick={() => {
                    navigate(
                      `/contactsupplier?userId=${PosData?.importer?.userId}&importerName=${PosData?.importer?.name}`
                    );
                  }}
                >
                  <p className="cursor text-success text-dark">Contact Buyer</p>
                </button>

                <ContactBtn
                  isLogin={isLogin}
                  recieverUserId={PosData?.importer?.userId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
