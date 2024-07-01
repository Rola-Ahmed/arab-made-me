import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { baseUrl } from "config.js";
import { userDetails } from "Context/userType";

export default function FactoryInfo() {
  let navigate = useNavigate();
  let [factoryDetails, setFactoryDetails] = useState({});
  let { currentUserData } = useContext(userDetails);

  useEffect(() => {
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

    if (currentUserData && currentUserData?.factoryId !== null) {
      fetchFactoryData();
    }
  }, [currentUserData]);

  return (
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
                {" "}
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
                    value={factoryDetails?.repPhone || ""}
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
                      factoryDetails?.repName == null
                        ? " "
                        : `${factoryDetails?.repName?.[0]}  ${factoryDetails?.repName?.[1]}`
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
                    value={factoryDetails?.repEmail || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notes:
// displayes factory data
