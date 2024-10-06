import { useState, useContext, useEffect } from "react";

import { userDetails } from "Context/userType";
import { useFetchFactoryById } from "hooks/useFetchFactoryById";
import { useFetchImporterById } from "hooks/useFetchImporterById";

export default function CurrentAcccountInfo() {
  let { currentUserData } = useContext(userDetails);
  let [factoryDetails, setFactoryDetails] = useState([]);
  const [error, setError] = useState(null);
  const { data: factoryData, errorMessage: factoryError } = useFetchFactoryById(
    currentUserData?.factoryId ?? undefined
  );
  // }

  const {
    data: importerData,
    errorMessage: importerError,
  } = useFetchImporterById(currentUserData?.importerId);

  useEffect(() => {
    if (currentUserData && currentUserData?.factoryId !== null) {
      setFactoryDetails([
        {
          name: "Factory Name",
          value: factoryData?.name,
        },
        {
          name: "User Role",
          value: "Factory",
        },

        {
          name: "Representative Name",
          value: `${factoryData?.repName?.[0]} ${factoryData?.repName?.[1]}`,
        },

        {
          name: "Representative email",
          value: factoryData?.repEmail,
        },

        {
          name: "Representative phone number",
          value: factoryData?.repPhone,
        },
      ]);
      setError(factoryError);
    }
    if (currentUserData && currentUserData?.importerId !== null) {
      // console.log("current-------------- improetr");
      setFactoryDetails([
        {
          name: "Importer Name",
          value: importerData?.name,
        },
        {
          name: "Role",
          value: "Importer",
        },
        {
          name: "repesentive Name",
          value: importerData?.repName?.[0],
        },
        {
          name: "repesentive email",
          value: importerData?.repEmail,
        },
        {
          name: "repesentive Phone",
          value: importerData?.repPhone,
        },
      ]);
      setError(importerError);
    }
    if (
      currentUserData?.importerId == null &&
      currentUserData?.factoryId == null
    ) {
      setFactoryDetails([
        {
          name: "Representive Email",
          value: "currentUserData?.userEmail",
        },

        {
          name: "Role",
          value: "Default User",
        },
      ]);
    }
  }, [currentUserData, factoryData, importerData]);

  return (
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
        {factoryDetails?.map((data, index) => (
          <div className="col-md-6 col-sm-12" key={index}>
            <div className="form-group">
              <label>{data?.name}</label>
              <input
                type="text"
                className="form-control"
                value={data?.value}
                readOnly
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
