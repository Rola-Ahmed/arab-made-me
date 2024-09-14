import { useState } from "react";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

export default function LegalDocuments(props) {
  let { legalDocs, deleteDocs, setModalShow } = props;

  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });
  const handleImageClick = (imagePath) => {
    setShowImagePop({
      display: true,
      imagePath,
    });
  };
  return (
    <>
      <div id="legalDocs"></div>
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p className="">Legal Documents</p>
          <DisplayMultiImages
            handleImageClick={handleImageClick}
            images={legalDocs}
            deleteDocs={deleteDocs}
          />

          <div className="w-100">
            <button
              type="button"
              className="btn-edit"
              onClick={() =>
                setModalShow({
                  accountInfo: false,
                  legalDocs: true,
                })
              }
            >
              <p className="cursor">Upload </p>
            </button>
          </div>
        </div>
      </div>

      <MediaPopUp
        show={showImagePop.display}
        onHide={() =>
          setShowImagePop({
            display: false,
            imagePath: "",
          })
        }
        showImagePop={showImagePop.imagePath}
      />
    </>
  );
}
