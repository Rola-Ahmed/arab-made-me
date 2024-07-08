import React from "react";

import { nextImg, currentsubPoint } from "constants/Images";

export default function LastPointStatus({ title, isCurrentPoint }) {
  return (
    <div className=" text-check ">
      <div className="  timeline-reg d-flex">
        <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
        <div className="img-cont me-5">
          <img src={isCurrentPoint ? currentsubPoint : nextImg} alt="" />
        </div>
      </div>
      <p className="text-cont text-end">{title}</p>
    </div>
  );
}
