import React from "react";

export default function Endorsement(
  {factoryDetails,
  addEndorse,
  currentUserData}
) {
  // Use addEndorse function
  const handleClick = () => {
    addEndorse();
  };
  return (
    <>
      <h3 className="text-fac-4">Endorsements</h3>
      <div className=" row">
        <div className="col-12 ">
          <p>
            Encourage {factoryDetails?.name} Company to share positive
            experiences and to show that they are trustworthy and cooperative.
          </p>
        </div>
        <div className="col-6">
          <div className="d-flex justify-content-start align-items-center padding-text-endors">
            <p> Endorsements: {factoryDetails?.endorsements || 0}</p>
          </div>
        </div>
        <div className="col-6 ">
          <div className="d-flex justify-content-end align-items-center">
            {!currentUserData?.datacompletelyLoaded ? (
              <button className="btn-endorse cursor" onClick={handleClick}>
                <p className="text-end cursor">Endorse</p>
              </button>
            ) : (
              <button type="button" className="btn-endorse px-4">
                <i className="fas fa-spinner fa-spin"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
