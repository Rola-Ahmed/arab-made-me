import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";


import { useNavigate, useSearchParams } from "react-router-dom";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ContactBtn from "components/Importerdashboard/Shared/ContactBtn";

import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import PoInfo from "components/Shared/Dashboards/Forms/PoInfo";
import FactoryInfo from "components/Forms/Shared/FactoryInfo";

export default function OnePo() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const poId = searchParams.get("poId");

  const [apiLoadingData, setapiLoadingData] = useState(true);
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

  const [PosData, setPosData] = useState();
  let [factoryDetails, setFactoryDetails] = useState({});

  async function fetchFactoriesData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/importers/importer/pos?include=factory`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        const matchedObject = response.data.pos.find((obj) => obj.id == poId);

        if (matchedObject) {
          setPosData(matchedObject);
        }

        setapiLoadingData(false);
      } else {
        setapiLoadingData(true);
      }
    } catch (error) {
      setapiLoadingData(true);
    }
  }

  useEffect(() => {
    fetchFactoriesData();
  }, [poId]);

  // utils function

  async function fetchImporterData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/importers/${currentUserData?.importerId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.importers);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (currentUserData && currentUserData?.importerId !== null) {
      fetchImporterData();
    }
  }, [currentUserData]);

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
                <FactoryInfo productDetails={PosData?.factory} />

                </div>
              </div>


{/* PO INFO */}
              <PoInfo  requestedData={PosData}
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
                  recieverUserId={PosData?.factory?.userId}
                  baseUrl={baseUrl}
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
