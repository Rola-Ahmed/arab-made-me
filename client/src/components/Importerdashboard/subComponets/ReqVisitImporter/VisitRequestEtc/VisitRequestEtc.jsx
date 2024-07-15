import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { useNavigate, useSearchParams } from "react-router-dom";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ContactBtn from "components/Importerdashboard/Shared/ContactBtn";

// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import { formattedTime as getFornattedTime } from "utils/formattedTime";

// import FactoryUnVerified from "components/ActionMessages/FactoryUnVerifiedDash/FactoryUnVerifiedDash";
export default function VisitRequestEtc() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let formattedTime = getFornattedTime;

  const [searchParams] = useSearchParams();
  const visitReqId = searchParams.get("visitReqId");

  const [apiLoadingData, setapiLoadingData] = useState(true);
  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState([]);

  const [PosData, setPosData] = useState();
  let [factoryDetails, setFactoryDetails] = useState({});

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

  useEffect(() => {
    if (currentUserData && currentUserData?.importerId !== null) {
      fetchReqData(`importers/importer/visits?include=factory`);
    }
    if (currentUserData && currentUserData?.factoryId !== null) {
      fetchReqData(`factories/factory/visits?include=importer`);
    }
  }, [visitReqId]);

  // utils function
  let getMonthName = getDate;

  async function fetchImporterData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/importers/${currentUserData?.importerId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.importers);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }
  async function fetchFactoryData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/${currentUserData?.factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.factories);
      } else if (response.data.message == "404 Not Found") {
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (currentUserData && currentUserData?.importerId !== null) {
      fetchImporterData();
    }
    if (currentUserData && currentUserData?.factoryId !== null) {
      fetchFactoryData();
    }
  }, [currentUserData]);

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

      <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <div className="d-flex justify-content-between">
                    <p>Buyer Information</p>

                    <button
                      className="edit-profile"
                      onClick={() => {
                        navigate(
                          "/importerdashboard/importerProfile#profileImage"
                        );
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
                            <label>Representative Name</label>
                            <input
                              type="text"
                              className="form-control text-dark"
                              value={`${
                                factoryDetails?.repName == null
                                  ? " "
                                  : `${factoryDetails?.repName}`
                              }`}
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
                              value="Buyer"
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
                              value={factoryDetails?.repEmail || ""}
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
                              value={factoryDetails?.repPhone || ""}
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
                  <p>Factory Information</p>

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

              <div className="col-12 d-flex justify-content-start btn-modal-gap mb-4">
                {/* <button
                  className="btn-edit d-none "
                  // bg-white border-btn
                  type="button"
                  onClick={() => {
                    handleIsLoggedInBtn(
                      `contactsupplier?userId=${PosData?.factory?.userId}&factoryName=${PosData?.factory?.name}`
                    );
                  }}
                >
                  <p className="cursor ">Contact Supplier</p>
                </button> */}
                <ContactBtn
                  isLogin={isLogin}
                  handleIsLoggedInBtn={handleIsLoggedInBtn}
                  recieverUserId={PosData?.factory?.userId}
                  baseUrl={baseUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
