import React from "react";

export default function IssuePage() {
  return (
    <div className="mt-5  pt-5">
      <div className=" d-grid gap-5">
        <i class="fa-solid fa-circle-xmark opps-icon m-auto"></i>

        <h4 className="text-center fw-semibold">Opps Something went Wrong</h4>

        <p className="text-center">
          Something went wrong while loading the page
        </p>
      </div>
    </div>
  );
}
