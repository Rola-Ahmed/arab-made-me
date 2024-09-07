import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "config.js";
import { userDetails } from "Context/userType";

export default function CurrentAcccountInfo() {
  let { currentUserData } = useContext(userDetails);
  let [factoryDetails, setFactoryDetails] = useState({});

  // factory details
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
        // errorsMsg("404");
      }
    } catch (error) {}
  }

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

  useEffect(() => {
    if (currentUserData && currentUserData?.factoryId !== null) {
      fetchFactoryData();
    }
    if (currentUserData && currentUserData?.importerId !== null) {
      fetchImporterData();
    }
  }, [currentUserData]);

  return (
    <>
      {/* Account description */}
      {/* <div className="row row-container w-100 "> */}
      {/* Factory description */}
      {/* <div className="container container-po "> */}

      <div className="input-content ">
        <div className="d-flex justify-content-between w-100">
          <h5>Current Account Inforamtion</h5>

          <i
            data-bs-toggle="collapse"
            data-bs-target="#collapseExample"
            aria-expanded="false"
            aria-controls="collapseExample"
            class="fa-solid fa-chevron-down cursor"
          ></i>
        </div>
        <div id="collapseExample" className="row row-container w-100 collapse">
          {currentUserData?.factoryId !== null && (
            <>
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>Factory Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={factoryDetails?.name || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
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

              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label>Representative Name</label>
                  <input
                    type="text"
                    className="form-control text-dark"
                    value={`${
                      factoryDetails?.repName == null
                        ? " "
                        : `${factoryDetails?.repName?.[0]}  ${factoryDetails?.repName?.[1]}`
                    }`}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6 col-sm-12">
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

              <div className="col-md-6 col-sm-12">
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

              {/* <div className="col-12 d-none">
                <div className="form-group">
                  <label>description</label>
                  <textarea
                    type="text"
                    className="form-control"
                    value={factoryDetails?.description || ""}
                    readOnly
                  />
                </div>
              </div> */}
            </>
          )}

          {currentUserData?.importerId !== null && (
            <>
              <div className="col-md-6 col-sm-12">
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

              <div className="col-md-6 col-sm-12">
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

              <div className="col-md-6 col-sm-12">
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

              <div className="col-md-6 col-sm-12">
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

              {/* <div className="col-12 d-none">
                <div className="form-group">
                  <label>description</label>
                  <textarea
                    type="text"
                    className="form-control"
                    value={factoryDetails?.description || ""}
                    readOnly
                  />
                </div>
              </div> */}
            </>
          )}

          {currentUserData?.importerId == null &&
            currentUserData?.factoryId == null && (
              <>
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      className="form-control text-dark"
                      value="Default User"
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label> Representative email</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${
                        currentUserData?.userEmail == null
                          ? " "
                          : `${currentUserData?.userEmail}`
                      }`}
                      readOnly
                    />
                  </div>
                </div>
              </>
            )}
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
    </>
  );
}
