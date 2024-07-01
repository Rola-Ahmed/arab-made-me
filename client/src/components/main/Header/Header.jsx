import React from "react";
import "./Header.css";

export default function Header(props) {
  return (
    <section className="top-header">
      <div className="header-overlay">
        {" "}
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="container title-conatiner">
            {" "}
            <h2 className="header-titile">{props.title}</h2>
            <div className="link-page d-flex justify-content-start align-content-center w-100 d-none">
              <div className="arrow-icon  d-flex justify-content-center align-items-center"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
