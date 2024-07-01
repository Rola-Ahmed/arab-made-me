import React from "react";

export default function FactoryLogo(props) {
  let { baseUrl_IMG, handleImageError, handleShow,factoryProfile } = props;
  return (
    <>
      <div id="factorylogo"></div>
      <div className="container-profile-input w-100 ">
        <div className="title-contianer-input w-100">
          {" "}
          <p>factory logo </p>
          <div className="w-100 ">
            {" "}
            <div className="row  row-gap">
              <div className="col-12">
                <div className="grid-gap-col position-relative ">
                  <div className="factory-logo  edit-img ">
                    <img
                      className="w-100 h-100 "
                      src={`${baseUrl_IMG}/${factoryProfile?.coverImage}`}
                      alt="factory image coverImage"
                      onError={handleImageError}
                    />
                  </div>

                  {/* icon */}
                  <div className="edit-icon-profile-btn position-absolute  cursor">
                    <label
                      htmlFor="imgupload"
                      onClick={() => handleShow("coverImgReadOnly")}
                    >
                      <i className="fa-solid fa-pen-to-square  cursor"></i>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
