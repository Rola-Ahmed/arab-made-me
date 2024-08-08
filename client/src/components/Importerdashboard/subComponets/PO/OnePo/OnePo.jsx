import {  useState } from "react";

import { useOnePo } from "./useOnePo";

import { useNavigate } from "react-router-dom";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ContactBtn from "components/Importerdashboard/Shared/ContactBtn";

import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import PoInfo from "components/Shared/Dashboards/Forms/PoInfo";
import FactoryInfo from "components/Forms/Shared/FactoryInfo";

export default function OnePo() {
  let navigate = useNavigate();
  let { isLogin, requestedData, apiLoadingData } = useOnePo();




  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
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

  
  const [isLoggedReDirect, setisLoggedReDirect] = useState([]);







  function handleIsLoggedInBtn(loginPath, storgaeName) {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));

      setisLoggedReDirect(`/signIn/${loginPath}`);
      return;
    }

    navigate(`/${loginPath}`);
  }

  return (
    <>
      <IsLoggedIn
        show={modalShow.isLogin}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
        distination={isLoggedReDirect}
      />

      <div id="view" className="m-4 order-section   ">
        <SubPageUtility
          currentPage="More Details"
          PrevPage="Purchasing Offer Details"
        />
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Purchasing Order Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/importerdashboard/purchasingOrders");
                }}
              >
                <p className="cursor">All Purchasing Order</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section factory-profile m-5">
        <div className="container gap-container p-0">
            <div className="  container-2-gap  p-0">
            

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                <FactoryInfo productDetails={requestedData?.factory} />

                </div>
              </div>


{/* PO INFO */}
              <PoInfo  requestedData={requestedData}
    handleImageClick={handleImageClick}
    />
              

           
              <div className="col-12 d-flex justify-content-start btn-modal-gap">
                {/* <button
                  // submitButton bg-white border-btn
                  className="btn-edit d-none"
                  type="button"
                  onClick={() => {
                    handleIsLoggedInBtn(
                      `contactsupplier?userId=${PosData?.factory?.userId}&factoryName=${PosData?.factory?.name}`
                    );
                  }}
                >
                  <p className="cursor ">Contact Supplier</p>
                </button> */}
                <ContactBtn
                  isLogin={isLogin}
                  handleIsLoggedInBtn={handleIsLoggedInBtn}
                  recieverUserId={requestedData?.factory?.userId}
                />
              </div>
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
