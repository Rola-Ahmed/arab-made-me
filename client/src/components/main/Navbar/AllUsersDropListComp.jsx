import React from "react";
import CurrectAccountDropList from "./CurrectAccountDropList";
import { useNavigate } from "react-router-dom";

export default function AllUsersDropListComp(props) {
  let { loading, currentUserData } = props;
  // console.log("loading",loading)
  let navigate = useNavigate();

  if (loading) {
    return (
      <div>
        <i className="fas fa-spinner fa-spin text-white"></i>
      </div>
    );
  }
  return (
    <>
      {/* display factory details if signed in */}
      {currentUserData?.factoryId && (
        <CurrectAccountDropList
          coverImage={currentUserData?.profile}
          name={currentUserData?.FactoryName}
          profilePath={`/factoryDashboard/factoryProfile`}
          DashboardPath={`/factoryDashboard`}
        />
      )}

      {/* display imorter details if signed in */}
      {currentUserData?.importerId && (
        <CurrectAccountDropList
          coverImage={currentUserData?.profile}
          name={currentUserData?.importerName}
          profilePath={`/importerdashboard/importerProfile`}
          DashboardPath={`/importerdashboard`}
        />
      )}

      {/* display admin details if signed in */}
      {currentUserData.userRole == "admin" && (
        <CurrectAccountDropList
          coverImage={currentUserData?.profile}
          name={currentUserData?.userName}
          DashboardPath={`/admin/adminDashboard`}
        />
      )}

      {/* display becomae a factoyr or admin if default user is signed in */}

      {currentUserData?.factoryId == null &&
      currentUserData?.importerId == null &&
      currentUserData?.userRole != "admin" ? (
        <>
          <div
            className="text-1 text-decoration-none cursor d-flex justify-content-center"
            onClick={() => {
              navigate("/CompanyDetails");
            }}
          >
            Become a Factory
          </div>
          <div
            className="text-1 text-decoration-none cursor d-flex justify-content-center"
            onClick={() => {
              navigate("/buyerRegistration");
            }}
          >
            Become a Buyer
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
