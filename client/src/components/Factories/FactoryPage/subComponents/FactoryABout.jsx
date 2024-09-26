import React from "react";

export default function FactoryABout({ factoryDetails, allSectors }) {
  console.log("factoryDetails",factoryDetails)
  return (
    <>
      {" "}
      <h3 className="text-fac-4">About</h3>
      <div className=" row">
        <div className="col-3 ">
          <p
            className=" fw-bolder
        "
          >
            Company Category
          </p>
        </div>
        <div className="col-9 ">
          <p>
            {factoryDetails?.sectorId !== null
              ? allSectors?.find(
                  (item) => item?.id === factoryDetails?.sectorId
                )?.name
              : ""}
          </p>
        </div>

        <div className="col-3 ">
          <p
            className=" fw-bolder
        "
          >
            Year Established
          </p>
        </div>
        <div className="col-9 ">
          <p>{factoryDetails?.yearOfEstablishmint}</p>
        </div>

        <div className="col-3 ">
          <p
            className=" fw-bolder
        "
          >
            Number of Employees
          </p>
        </div>
        <div className="col-9 ">
          <p
            className=" fw-bolder
        "
          >
            {factoryDetails?.numberOfEmployees} Employees
          </p>
        </div>

        <div className="col-3 ">
          <p
            className=" fw-bolder
        "
          >
            Company Website
          </p>
        </div>
        <div className="col-9 ">
          <p className="text-break">
            <a
              target="_blank"
              rel="noreferrer"
              href={`${factoryDetails?.website}`}
            >
              {factoryDetails?.website}
            </a>
          </p>
        </div>

        <div className="col-3 ">
          <p
            className=" fw-bolder
        "
          >
            Social Links
          </p>
        </div>
        <div className="col-9 ">
          <p>
            <i
              onClick={() => {
                window.open(factoryDetails?.socialLinks?.facebook, "_blank");
              }}
              className="fab fa-facebook-f  cursor social-icons me-3 "
            ></i>
            <i
              onClick={() => {
                window.open(factoryDetails?.socialLinks?.instagram, "_blank");
              }}
              className="fab fa-instagram  cursor social-icons"
            ></i>
          </p>
        </div>

        <div className="col-3 ">
          <p
            className=" fw-bolder
        "
          >
            Company Phone
          </p>
        </div>
        <div className="col-9 ">
          <p>{factoryDetails?.phone}</p>
        </div>

        <div className="col-3 ">
          <p
            className=" fw-bolder
        "
          >
            Company Address
          </p>
        </div>
        <div className="col-9 ">
          <p>{factoryDetails?.address?.[0]}</p>
        </div>

        <div className="col-3 ">
          <p
            className=" fw-bolder
        "
          >
            Company Description
          </p>
        </div>
        <div className="col-9 ">
          <p>{factoryDetails?.description}</p>
        </div>

        <div className="col-3 ">
          <p
            className=" fw-bolder
        "
          >
           Why Us
          </p>
        </div>
        <div className="col-9 ">
          <p>{factoryDetails?.whyUs}</p>
        </div>
      </div>
    </>
  );
}
